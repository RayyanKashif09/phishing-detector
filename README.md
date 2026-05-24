# PhishGuard

Full-stack phishing email detection app for the research paper "A Fine-Tuned Lightweight LLM Approach for Detecting AI-Generated Phishing Emails" by Rayyan, Fatima, Sarah, NUML Faisalabad, Pakistan.

The backend loads a `distilbert-base-uncased` sequence classifier with LoRA adapters trained on SpamAssassin, CEAS_08, and 150 AI-generated phishing emails.

## Project Structure

```text
phishing-detector/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── model/
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── index.html
│   ├── src/
│   └── public/
└── chrome-extension/
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    ├── popup.css
    └── icons/
```

## Run Everything

Install all dependencies once:

```bash
npm run install:all
```

This installs a CPU-only PyTorch build for local development.

Start the backend and frontend together:

```bash
npm run dev
```

The backend runs on `http://localhost:5000` and the frontend runs on the Vite URL, usually `http://localhost:5173`.

## 1. Backend Setup

Copy your trained model files into `backend/model/`:

```text
adapter_config.json
adapter_model.safetensors
tokenizer.json
tokenizer_config.json
special_tokens_map.json
vocab.txt
```

Install and run:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The API runs on `http://localhost:5000`.

Endpoints:

```text
GET  /health
POST /predict
```

Prediction request:

```json
{
  "subject": "Urgent account verification",
  "body": "Click this link to verify your mailbox."
}
```

Prediction response:

```json
{
  "label": "phishing",
  "confidence": 0.987,
  "probabilities": {
    "legitimate": 0.013,
    "phishing": 0.987
  }
}
```

## 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite. The Vite dev server proxies `/predict` and `/health` to `http://localhost:5000`.

## 3. Chrome Extension Setup

1. Start the Flask backend on `http://localhost:5000`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the `chrome-extension/` folder.

Use the popup to paste email text and scan it. You can also select text on a web page, right-click, and choose "Scan for Phishing"; opening the popup will show the last scan result.

## Notes

- The backend preprocesses input by lowercasing, replacing URLs with `<url>`, replacing email addresses with `<email>`, stripping HTML, and collapsing whitespace.
- If `backend/model/` is empty, `/health` will show `model_loaded: false` and `/predict` will return a setup error.
- The frontend and extension intentionally use a strict black-and-white interface, with red or green only for the final classification label.
