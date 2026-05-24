const API_URL = "http://localhost:5000/predict";

function splitEmailText(text) {
  const lines = text.trim().split(/\r?\n/);
  const firstLine = lines[0] || "";
  const subject = firstLine.toLowerCase().startsWith("subject:")
    ? firstLine.replace(/^subject:\s*/i, "")
    : "";
  const body = subject ? lines.slice(1).join("\n") : text;
  return { subject, body };
}

async function scanText(text) {
  const payload = splitEmailText(text);
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Backend unavailable. Start Flask on port 5000.");
  }

  return data;
}

function renderResult(element, data) {
  const label = data.label === "phishing" ? "PHISHING" : "LEGITIMATE";
  const confidence = (Number(data.confidence || 0) * 100).toFixed(1);
  element.textContent = `${label} - Confidence: ${confidence}%`;
  element.className = data.label === "phishing" ? "phishing" : "legitimate";
}

async function handlePopupScan() {
  const textarea = document.getElementById("emailText");
  const button = document.getElementById("scanButton");
  const result = document.getElementById("result");
  const text = textarea.value.trim();

  if (!text) {
    result.textContent = "Paste email text to scan.";
    result.className = "";
    return;
  }

  button.textContent = "Scanning...";
  button.disabled = true;
  result.textContent = "";
  result.className = "";

  try {
    renderResult(result, await scanText(text));
  } catch (error) {
    result.textContent = error.message;
    result.className = "";
  } finally {
    button.textContent = "Scan";
    button.disabled = false;
  }
}

if (typeof chrome !== "undefined" && chrome.runtime && chrome.contextMenus) {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: "scan-for-phishing",
      title: "Scan for Phishing",
      contexts: ["selection"]
    });
  });

  chrome.contextMenus.onClicked.addListener(async (info) => {
    if (info.menuItemId !== "scan-for-phishing" || !info.selectionText) {
      return;
    }

    try {
      const result = await scanText(info.selectionText);
      await chrome.storage.local.set({
        lastScanText: info.selectionText,
        lastScanResult: result,
        lastScanError: ""
      });
    } catch (error) {
      await chrome.storage.local.set({
        lastScanText: info.selectionText,
        lastScanResult: null,
        lastScanError: error.message
      });
    }
  });
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", async () => {
    const button = document.getElementById("scanButton");
    const textarea = document.getElementById("emailText");
    const result = document.getElementById("result");

    button.addEventListener("click", handlePopupScan);

    if (typeof chrome !== "undefined" && chrome.storage) {
      const saved = await chrome.storage.local.get([
        "lastScanText",
        "lastScanResult",
        "lastScanError"
      ]);
      if (saved.lastScanText) {
        textarea.value = saved.lastScanText;
      }
      if (saved.lastScanResult) {
        renderResult(result, saved.lastScanResult);
      } else if (saved.lastScanError) {
        result.textContent = saved.lastScanError;
        result.className = "";
      }
    }
  });
}
