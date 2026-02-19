// Zetamac While You Wait - Background Service Worker

const ZETAMAC_URL = 'https://arithmetic.zetamac.com/';
let zetamacTabId = null;

async function openZetamac() {
  // Check if tab still exists
  if (zetamacTabId !== null) {
    try {
      const tab = await chrome.tabs.get(zetamacTabId);
      // Tab exists, focus it
      await chrome.tabs.update(zetamacTabId, { active: true });
      return;
    } catch (e) {
      // Tab was closed, reset
      zetamacTabId = null;
    }
  }

  // Open new Zetamac tab
  const tab = await chrome.tabs.create({
    url: ZETAMAC_URL,
    active: false // open in background so you can see it but don't lose your place
  });
  zetamacTabId = tab.id;
}

async function closeZetamac() {
  if (zetamacTabId === null) return;
  try {
    await chrome.tabs.remove(zetamacTabId);
  } catch (e) {
    // Already closed
  }
  zetamacTabId = null;
}

// Listen for tab removal so we keep state clean
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === zetamacTabId) {
    zetamacTabId = null;
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GENERATION_START') {
    openZetamac();
  } else if (message.type === 'GENERATION_STOP') {
    closeZetamac();
  }
});
