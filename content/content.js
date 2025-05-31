// Initialize the content script

const CURSOR_POSITION = {
    x: 0,
    y: 0
}

const SUMMARY_PROMPT = "Summarize the following text: "
const EXPLAIN_PROMPT = "Explain the following text: "

async function init() {
    try {

        setupListeners();
        const API_KEY = await getApiKey();
    } catch (error) {
        console.error(error)
    }
}

const setupKeybindListener = (keybind) => {
    document.addEventListener('keydown', (event) => {
        console.log(event)
        if (event.key === keybind) {
            event.preventDefault();
            handleOptionKeyTrigger();
        }
    });
}

const setupCursorListener = () => {
    document.addEventListener('mousemove', function (event) {
        CURSOR_POSITION.x = event.clientX;
        CURSOR_POSITION.y = event.clientY;
    });
}

function setupListeners() {
    setupKeybindListener('Alt');
    setupCursorListener();
}

// Handle Option key trigger
function handleOptionKeyTrigger() {
    try {
        const selection = window.getSelection().toString().trim();

        if (selection) {
            openBubbleAtCursor(selection);
        } else {
            openBubbleAtCursor(null);
        }
    } catch (error) {
        console.error('Error handling option key trigger:', error);
    }
}

// Store last mouse position as fallback
let lastMousePosition = { x: 0, y: 0 };

document.addEventListener('mousemove', (event) => {
    lastMousePosition = {
        x: event.clientX,
        y: event.clientY
    };
});

function getLastMousePosition() {
    return {
        x: lastMousePosition.x,
        y: lastMousePosition.y,
        width: 0,
        height: 0
    };
}

// Function to open a small black bubble next to cursor
function openBubbleAtCursor(selectedText = null) {
    // Create bubble using the helper function
    const bubble = createBubbleComponent(selectedText, handleAsk);
    console.log(bubble)
    
    // Position the bubble
    positionBubble(bubble);
    
    // Add to page
    document.body.appendChild(bubble);
}

// Handle Ask callback from bubble component
function handleAsk(action, selectedText, customQuestion) {
    console.log('Action:', action);
    console.log('Selected Text:', selectedText);
    console.log('Custom Question:', customQuestion);
    
    // Remove the bubble after action
    const bubble = document.getElementById('ai-cursor-bubble');
    if (bubble) {
        bubble.remove();
    }
    
    // Here you can integrate with your existing AI functionality
    // For example:
    if (action === 'summarize') {
        console.log('Summarizing:', selectedText);
        // Call your summarize API
    } else if (action === 'explain') {
        console.log('Explaining:', selectedText);
        // Call your explain API
    } else if (action === 'custom') {
        console.log('Custom question:', customQuestion, 'about:', selectedText);
        // Call your AI with custom question
    }
}

function positionBubble(bubble) {
    const bubbleWidth = 350; // max-width from CSS
    const bubbleHeight = 200; // estimated height

    let x = CURSOR_POSITION.x;
    let y = CURSOR_POSITION.y;

    if (CURSOR_POSITION.x + bubbleWidth > window.innerWidth) {
        x = CURSOR_POSITION.x - bubbleWidth;
    }

    if (CURSOR_POSITION.y + bubbleHeight > window.innerHeight) {
        y = CURSOR_POSITION.y - bubbleHeight;
    }


    console.log(x, y)
    bubble.style.left = x + 'px';
    bubble.style.top = y + 'px';
}


function getApiKey() {
    return new Promise((resolve, reject) => {
        try {
            if (!chrome.storage || !chrome.storage.sync) {
                console.error('Chrome storage API not available');
                resolve(null);
                return;
            }

            chrome.storage.sync.get(['geminiApiKey'], (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Chrome storage error:', chrome.runtime.lastError);
                    resolve(null);
                } else {
                    resolve(result.geminiApiKey);
                }
            });
        } catch (error) {
            console.error('Error accessing chrome storage:', error);
            resolve(null);
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
} 