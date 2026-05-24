import json
import os
import re
import threading
from pathlib import Path

import torch
from bs4 import BeautifulSoup
from flask import Flask, jsonify, request
from flask_cors import CORS
from peft import PeftConfig, PeftModel
from transformers import AutoModelForSequenceClassification, AutoTokenizer


APP_ROOT = Path(__file__).resolve().parent
MODEL_DIR = APP_ROOT / "model"
DEFAULT_BASE_MODEL = "distilbert-base-uncased"
MAX_LENGTH = 512

app = Flask(__name__)
CORS(app)

model = None
tokenizer = None
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model_error = None
model_loading = False
model_lock = threading.Lock()


def preprocess_text(text: str) -> str:
    text = text or ""
    text = BeautifulSoup(text, "lxml").get_text(" ")
    text = text.lower()
    text = re.sub(r"https?://\S+|www\.\S+", "<url>", text)
    text = re.sub(r"\b[\w.%+-]+@[\w.-]+\.[a-z]{2,}\b", "<email>", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text


def get_label_mapping(base_model) -> dict[int, str]:
    id2label = getattr(base_model.config, "id2label", None) or {}
    normalized = {
        int(key): str(value).lower()
        for key, value in id2label.items()
        if str(value).lower() in {"legitimate", "phishing"}
    }

    if set(normalized.values()) == {"legitimate", "phishing"}:
        return normalized

    return {0: "legitimate", 1: "phishing"}


def get_model_labels() -> dict[int, str]:
    config = getattr(model, "config", None)
    if config is None and getattr(model, "base_model", None) is not None:
        config = getattr(model.base_model, "config", None)

    id2label = getattr(config, "id2label", None) or {}
    labels = {int(index): str(label).lower() for index, label in id2label.items()}
    if set(labels.values()) == {"legitimate", "phishing"}:
        return labels

    return {0: "legitimate", 1: "phishing"}


def load_model():
    global model, tokenizer, model_error, model_loading

    with model_lock:
      if model_loading or (model is not None and tokenizer is not None):
          return
      model_loading = True

    try:
        required_files = [
            "adapter_config.json",
            "adapter_model.safetensors",
            "tokenizer.json",
            "tokenizer_config.json",
            "special_tokens_map.json",
            "vocab.txt",
        ]
        missing = [name for name in required_files if not (MODEL_DIR / name).exists()]
        if missing:
            model_error = f"Missing model files in {MODEL_DIR}: {', '.join(missing)}"
            return

        peft_config = PeftConfig.from_pretrained(MODEL_DIR)
        base_model_name = peft_config.base_model_name_or_path or DEFAULT_BASE_MODEL

        tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR, use_fast=True)
        base_model = AutoModelForSequenceClassification.from_pretrained(
            base_model_name,
            num_labels=2,
            id2label={0: "legitimate", 1: "phishing"},
            label2id={"legitimate": 0, "phishing": 1},
        )
        base_model.label_mapping = get_label_mapping(base_model)

        model = PeftModel.from_pretrained(base_model, MODEL_DIR)
        model.to(device)
        model.eval()
        model_error = None
    except Exception as exc:
        model = None
        tokenizer = None
        model_error = str(exc)
    finally:
        model_loading = False


def start_model_loader():
    thread = threading.Thread(target=load_model, daemon=True)
    thread.start()


def classify_email(subject: str, body: str) -> dict:
    combined = preprocess_text(f"{subject}\n\n{body}")
    inputs = tokenizer(
        combined,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=MAX_LENGTH,
    )
    inputs = {key: value.to(device) for key, value in inputs.items()}

    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=-1).squeeze(0).cpu().tolist()

    labels = get_model_labels()

    scores = {
        labels.get(index, str(index)): round(float(score), 6)
        for index, score in enumerate(probabilities)
    }
    label_index = int(torch.tensor(probabilities).argmax().item())
    label = labels.get(label_index, "phishing" if label_index == 1 else "legitimate")

    return {
        "label": label,
        "confidence": round(float(probabilities[label_index]), 6),
        "probabilities": {
            "legitimate": scores.get("legitimate", 0.0),
            "phishing": scores.get("phishing", 0.0),
        },
    }


@app.get("/health")
def health():
    return jsonify(
        {
            "status": "ok",
            "model_loaded": model is not None and tokenizer is not None,
            "model_loading": model_loading,
            "device": str(device),
            "model_dir": str(MODEL_DIR),
            "error": model_error,
        }
    )


@app.post("/predict")
def predict():
    if model_loading:
        return (
            jsonify(
                {
                    "error": "Model is still loading. Try again shortly.",
                    "details": model_error,
                }
            ),
            503,
        )

    if model is None or tokenizer is None:
        return (
            jsonify(
                {
                    "error": "Model is not loaded. Copy trained files into backend/model/ and restart the server.",
                    "details": model_error,
                }
            ),
            503,
        )

    payload = request.get_json(silent=True) or {}
    subject = payload.get("subject", "")
    body = payload.get("body", "")

    if not str(subject).strip() and not str(body).strip():
        return jsonify({"error": "Provide a subject or body to analyze."}), 400

    return jsonify(classify_email(str(subject), str(body)))


if __name__ == "__main__":
    start_model_loader()
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=True,
        use_reloader=False,
    )
