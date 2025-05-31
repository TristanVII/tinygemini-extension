# Ask AI Chrome Extension

A modern Chrome extension that allows you to interact with Google's Gemini AI directly from any webpage by selecting text and pressing `Option + A`.

## Features

- 🎯 **Text Selection AI**: Select any text on a webpage and get AI assistance
- ⌨️ **Keyboard Shortcut**: Press `Option + A` (Alt + A on Windows/Linux) to trigger
- 💬 **Smart Chat Bubble**: Beautiful floating chat interface
- 🔧 **Multiple Actions**: Explain, Summarize, Translate, or Improve selected text
- 🔑 **Secure API Key Storage**: Your Gemini API key is stored securely in Chrome
- 🎨 **Modern UI**: Clean, responsive design with smooth animations

## Installation

1. **Get a Gemini API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key
   - Copy the API key (starts with `AIza...`)

2. **Install the Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked" and select this extension folder
   - The extension icon should appear in your toolbar

3. **Configure the Extension**:
   - Click the extension icon in your Chrome toolbar
   - Paste your Gemini API key in the input field
   - Click "Save API Key"

## How to Use

1. **Select Text**: Highlight any text on a webpage
2. **Activate**: Press `Option + A` (or `Alt + A` on Windows/Linux)
3. **Choose Action**: Click one of the action buttons:
   - **Explain**: Get a simple explanation of the text
   - **Summarize**: Get a concise summary
   - **Translate**: Translate to/from English
   - **Improve**: Get suggestions to improve the text
4. **View Response**: The AI response will appear in the chat bubble
5. **Close**: Click the X button or press `Escape` to close

## File Structure

```
ask-ai-chrome-extension/
├── manifest.json              # Extension configuration
├── popup/
│   ├── popup.html            # Settings popup interface
│   ├── popup.css             # Popup styling
│   └── popup.js              # Popup functionality
├── content/
│   ├── content.js            # Main content script
│   └── content.css           # Chat bubble styling
├── background/
│   └── background.js         # Background service worker
├── icons/
│   ├── icon16.png            # 16x16 icon
│   ├── icon48.png            # 48x48 icon
│   └── icon128.png           # 128x128 icon
└── README.md                 # This file
```

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Permissions**: `storage`, `activeTab`, and host permissions for AI API calls
- **AI Integration**: Google Gemini Pro API
- **Modern JavaScript**: ES6+ features with async/await
- **Responsive Design**: Works on all screen sizes
- **Cross-Platform**: Windows, macOS, and Linux support

## Privacy & Security

- Your API key is stored locally in Chrome's secure storage
- No data is sent to any servers except Google's Gemini API
- Selected text is only processed when you explicitly trigger the extension
- No tracking or analytics

## Troubleshooting

**Extension not working?**
- Make sure you've entered a valid Gemini API key
- Check that the extension is enabled in `chrome://extensions/`
- Refresh the webpage after installing the extension

**API key errors?**
- Ensure your API key starts with `AIza`
- Verify the API key is active in Google AI Studio
- Check your API quota and usage limits

**Chat bubble not appearing?**
- Try selecting text first, then press `Option + A`
- Make sure the webpage has finished loading
- Check browser console for any error messages

## License

This project is open source and available under the MIT License. 