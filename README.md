# Zetamac While You Wait 🧮

A Chrome extension that automatically opens **Zetamac arithmetic** (https://arithmetic.zetamac.com/) whenever ChatGPT or Claude starts generating a response — and closes it when the response is done.

## How It Works

- You hit **Send** on ChatGPT or Claude
- A Zetamac tab opens in the background → practice mental math while you wait!
- When the AI finishes generating → Zetamac tab closes automatically

## Installation (Chrome)

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select this folder (`zetamac-extension/`)
5. The extension is now active!

## Supported Sites

- `chatgpt.com` / `chat.openai.com`
- `claude.ai`

## Notes

- The Zetamac tab opens in the **background** (you won't be yanked away from the chat)
- If you manually close the Zetamac tab mid-generation, it won't reopen until your next prompt
- The extension detects generation by watching for the "Stop" button that appears on both sites while streaming

## Troubleshooting

If the tab isn't opening/closing correctly, it may be because ChatGPT or Claude updated their UI. Open an issue or check `content.js` — you may need to update the selector for the stop button.
