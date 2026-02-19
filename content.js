// Zetamac While You Wait - Content Script
// Detects when ChatGPT/Claude starts and stops generating

let isGenerating = false;
let observer = null;

function isChatGPT() {
  return location.hostname.includes('openai.com') || location.hostname.includes('chatgpt.com');
}

function isClaude() {
  return location.hostname.includes('claude.ai');
}

function notifyBackground(generating) {
  if (generating === isGenerating) return;
  isGenerating = generating;
  chrome.runtime.sendMessage({ type: generating ? 'GENERATION_START' : 'GENERATION_STOP' });
}

// ── ChatGPT detection ────────────────────────────────────────────────────────
// ChatGPT shows a "Stop generating" button while streaming.
// We watch for that button's appearance/disappearance.
function setupChatGPTObserver() {
  function checkGenerating() {
    // The stop button has data-testid="stop-button" or aria-label containing "Stop"
    const stopBtn =
      document.querySelector('[data-testid="stop-button"]') ||
      document.querySelector('button[aria-label*="Stop"]') ||
      // Fallback: look for the square (stop) icon inside a button
      document.querySelector('button svg rect[width="10"]')?.closest('button');

    notifyBackground(!!stopBtn);
  }

  observer = new MutationObserver(checkGenerating);
  observer.observe(document.body, { childList: true, subtree: true });
  checkGenerating();
}

// ── Claude detection ─────────────────────────────────────────────────────────
// Claude shows a stop button while streaming (aria-label="Stop Response" or similar)
function setupClaudeObserver() {
  function checkGenerating() {
    const stopBtn =
      document.querySelector('button[aria-label*="Stop"]') ||
      document.querySelector('[data-testid="stop-button"]') ||
      // Claude sometimes uses a square icon button
      document.querySelector('button.stop-button') ||
      // Check for the animated "thinking" dots or streaming indicator
      document.querySelector('[data-is-streaming="true"]');

    notifyBackground(!!stopBtn);
  }

  observer = new MutationObserver(checkGenerating);
  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  checkGenerating();
}

// ── Init ─────────────────────────────────────────────────────────────────────
function init() {
  if (isChatGPT()) {
    setupChatGPTObserver();
  } else if (isClaude()) {
    setupClaudeObserver();
  }
}

// Wait for page to be ready (SPA may load late)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-init on SPA navigation
let lastUrl = location.href;
new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    if (observer) { observer.disconnect(); observer = null; }
    isGenerating = false;
    setTimeout(init, 1000); // wait for new page to render
  }
}).observe(document.body, { childList: true, subtree: true });
