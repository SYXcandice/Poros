"use strict";

const config = window.POROS_CONFIG || {};
const get = (id) => document.getElementById(id);

function safeUrl(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  try {
    const url = new URL(value.trim(), document.baseURI);
    return ["https:", "http:"].includes(url.protocol) ? url : null;
  } catch { return null; }
}

const paperUrl = safeUrl(config.paperUrl);
if (paperUrl) {
  const button = get("paper-button");
  button.href = paperUrl.href;
  button.target = "_blank";
  button.rel = "noopener noreferrer";
  get("paper-button-label").textContent = "Read paper";
  get("paper-button-note").remove();
  const link = document.createElement("a");
  link.href = paperUrl.href;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.textContent = "Read paper ↗";
  get("paper-resource-action").replaceChildren(link);
}

const dialog = get("image-dialog");
let lastFigureTrigger = null;
document.querySelectorAll("[data-figure]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const source = trigger.querySelector("img");
    get("dialog-image").src = trigger.dataset.figure;
    get("dialog-image").alt = source.alt;
    get("dialog-caption").textContent = source.alt;
    lastFigureTrigger = trigger;
    dialog.showModal();
  });
});
get("close-dialog").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
dialog.addEventListener("close", () => lastFigureTrigger?.focus({ preventScroll: true }));

get("copy-citation").addEventListener("click", async () => {
  const text = get("bibtex").textContent.trim();
  const button = get("copy-citation");
  let copied = false;
  try {
    await navigator.clipboard.writeText(text);
    copied = true;
  } catch {
    // Support local HTTP previews and browsers without clipboard permission.
    const field = document.createElement("textarea");
    field.value = text;
    field.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.append(field);
    field.select();
    try { copied = document.execCommand("copy"); } catch { /* Offer manual selection below. */ }
    field.remove();
    button.focus({ preventScroll: true });
  }
  if (!copied) {
    const range = document.createRange();
    range.selectNodeContents(get("bibtex"));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
  const message = copied ? "BibTeX copied to clipboard." : "Citation selected. Press Control+C or Command+C to copy.";
  get("copy-status").textContent = message;
  button.querySelector("span").textContent = copied ? "Copied!" : "Press Ctrl/Cmd+C";
  setTimeout(() => { button.querySelector("span").textContent = "Copy BibTeX"; }, 3500);
});

if ("IntersectionObserver" in window) {
  const navLinks = Array.from(document.querySelectorAll("nav a"));
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      navLinks.forEach((link) => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }
  }, { rootMargin: "-12% 0px -60% 0px", threshold: 0 });
  document.querySelectorAll("main > section[id]").forEach((section) => observer.observe(section));
}
