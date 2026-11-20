// ===== SEREIN – script.js =====

// STEP LATER: replace the text below with your API Gateway URL
// Example: "https://abc123xyz.execute-api.ap-south-1.amazonaws.com/reflect"
const API_URL = "PASTE_YOUR_API_GATEWAY_URL_HERE";

const form = document.getElementById("reflection-form");
const input = document.getElementById("reflection-input");
const charCount = document.getElementById("char-count");
const submitBtn = document.getElementById("submit-btn");
const formMessage = document.getElementById("form-message");
const responseBox = document.getElementById("response-box");

// Live character counter
input.addEventListener("input", () => {
  charCount.textContent = input.value.length;
  formMessage.textContent = "";
});

// Helper: show text safely in the response box
function showResponseText(className, text) {
  responseBox.innerHTML = "";
  const p = document.createElement("p");
  p.className = className;
  p.textContent = text;
  responseBox.appendChild(p);
}

function showSuccess(data) {
  responseBox.innerHTML = "";

  const message = document.createElement("p");
  message.className = "response-message";
  message.textContent = data.message || "Response received.";
  responseBox.appendChild(message);

  const meta = document.createElement("div");
  meta.className = "response-meta";

  const tags = [];
  if (data.entryType) tags.push("Type: " + data.entryType);
  if (typeof data.wordCount === "number") tags.push("Words: " + data.wordCount);
  if (data.receivedAt) tags.push("Processed: " + new Date(data.receivedAt).toLocaleString());

  tags.forEach((text) => {
    const tag = document.createElement("span");
    tag.className = "meta-tag";
    tag.textContent = text;
    meta.appendChild(tag);
  });

  if (tags.length > 0) responseBox.appendChild(meta);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formMessage.textContent = "";

  const text = input.value.trim();

  // 1. Handle empty input
  if (text === "") {
    formMessage.textContent = "Please write something before submitting.";
    input.focus();
    return;
  }

  // 2. Check API is configured
  if (API_URL === "PASTE_YOUR_API_GATEWAY_URL_HERE") {
    showResponseText(
      "response-error",
      "The API is not connected yet. Add your API Gateway URL to script.js after completing the AWS setup."
    );
    document.getElementById("response").scrollIntoView({ behavior: "smooth" });
    return;
  }

  // 3. Loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  showResponseText("response-loading", "Waiting for your response from the cloud...");
  document.getElementById("response").scrollIntoView({ behavior: "smooth" });

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reflection: text }),
    });

    let data = null;
    try {
      data = await res.json();
    } catch (parseError) {
      data = null;
    }

    if (!res.ok) {
      const serverMessage = data && data.error ? data.error : "The server returned status " + res.status + ".";
      throw new Error(serverMessage);
    }

    if (!data) {
      throw new Error("The server returned an unreadable response.");
    }

    // 4. Show real response from Lambda
    showSuccess(data);
  } catch (error) {
    console.error("SEREIN request failed:", error);
    showResponseText(
      "response-error",
      "Something went wrong: " + error.message + " Please try again."
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Submit reflection";
  }
});