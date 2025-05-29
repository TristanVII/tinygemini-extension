// Background service worker for Ask AI Chrome Extension

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('Ask AI extension installed');
        
        // Set default settings
        chrome.storage.sync.set({
            extensionVersion: '1.0.0'
        });
        
        // Open welcome page or show notification
        chrome.action.setBadgeText({
            text: 'NEW'
        });
        
        chrome.action.setBadgeBackgroundColor({
            color: '#667eea'
        });
        
        // Clear badge after 5 seconds
        setTimeout(() => {
            chrome.action.setBadgeText({
                text: ''
            });
        }, 5000);
    }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
    console.log('Ask AI extension started');
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // Handle any background tasks if needed
    if (request.action === 'getApiKey') {
        chrome.storage.sync.get(['geminiApiKey'], (result) => {
            sendResponse({ apiKey: result.geminiApiKey });
        });
        return true; // Keep the message channel open for async response
    }
    
    if (request.action === 'saveApiKey') {
        chrome.storage.sync.set({ geminiApiKey: request.apiKey }, () => {
            sendResponse({ success: true });
        });
        return true;
    }
});

// Keep service worker alive (for Manifest V3)
const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
chrome.runtime.onStartup.addListener(keepAlive);
keepAlive(); 