
// SEREIN – Browser-based reflection system

const form = document.getElementById("reflection-form");
const input = document.getElementById("reflection-input");
const charCount = document.getElementById("char-count");
const submitBtn = document.getElementById("submit-btn");
const formMessage = document.getElementById("form-message");
const responseBox = document.getElementById("response-box");

input.addEventListener("input", () => {
  charCount.textContent = input.value.length;
  formMessage.textContent = "";
});

function classifyEntry(text) {
  const lowered = text.toLowerCase();

  const reflectionWords = [
    "today i", "yesterday", "i felt", "i learned",
    "i noticed", "went well", "i realised", "i realized"
  ];

  const focusWords = [
    "i want to", "i will", "my focus", "i plan",
    "i need to", "goal", "today, i"
  ];

  if (reflectionWords.some(word => lowered.includes(word))) {
    return "Reflection";
  }

  if (focusWords.some(word => lowered.includes(word))) {
    return "Focus";
  }

  return "Note";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    formMessage.textContent = "Please write something before submitting.";
    input.focus();
    return;
  }

  if (text.length > 1000) {
    formMessage.textContent = "Please keep your entry under 1000 characters.";
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Processing...";

  const entryType = classifyEntry(text);
  const wordCount = text.split(/\s+/).length;

  let message;

  if (entryType === "Focus") {
    message = "A clear intention is already half the work. Protect the first hour of your day for it.";
  } else if (entryType === "Reflection") {
    message = "Noticing what happened is how progress becomes lasting. Carry one lesson into tomorrow.";
  } else {
    message = "Thank you for putting your thoughts into words. Name one small action to take next.";
  }

  responseBox.innerHTML = "";

  const paragraph = document.createElement("p");
  paragraph.className = "response-message";
  paragraph.textContent = message;
  responseBox.appendChild(paragraph);

  const meta = document.createElement("div");
  meta.className = "response-meta";

  const details = [
    "Type: " + entryType,
    "Words: " + wordCount,
    "Processed: " + new Date().toLocaleString()
  ];

  details.forEach(detail => {
    const tag = document.createElement("span");
    tag.className = "meta-tag";
    tag.textContent = detail;
    meta.appendChild(tag);
  });

  responseBox.appendChild(meta);

  document.getElementById("response").scrollIntoView({
    behavior: "smooth"
  });

  submitBtn.disabled = false;
  submitBtn.textContent = "Submit reflection";
});
