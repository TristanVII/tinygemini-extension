// Initialize the content script

const CURSOR_POSITION = {
    x: 0,
    y: 0
}

const SUMMARY_PROMPT = "Summarize the following text: "
const EXPLAIN_PROMPT = "Explain the following text: "
let SYSTEM_PROMPT = null;
let API_KEY = null;


async function init() {
    try {

        setupListeners();
        API_KEY = await getStorageKey('geminiApiKey');
        SYSTEM_PROMPT = await getStorageKey('systemPrompt');

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
    
    // Make bubble draggable
    makeBubbleDraggable(bubble);
    
    // Add to page
    document.body.appendChild(bubble);
}

// Make bubble draggable
function makeBubbleDraggable(bubble) {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    // Add mousedown event to start dragging
    bubble.addEventListener('mousedown', (e) => {
        // Don't start dragging if clicking on interactive elements
        const isInteractive = e.target.matches('button, textarea, input') || 
                             e.target.closest('button, textarea, input');
        
        if (!isInteractive) {
            isDragging = true;
            
            const rect = bubble.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            bubble.style.cursor = 'grabbing';
            bubble.style.userSelect = 'none';
            
            // Prevent default to avoid text selection
            e.preventDefault();
        }
    });
    
    // Add mousemove event to handle dragging
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - dragOffset.x;
            const y = e.clientY - dragOffset.y;
            
            // Keep bubble within viewport bounds
            const maxX = window.innerWidth - bubble.offsetWidth;
            const maxY = window.innerHeight - bubble.offsetHeight;
            
            const boundedX = Math.max(0, Math.min(x, maxX));
            const boundedY = Math.max(0, Math.min(y, maxY));
            
            bubble.style.left = boundedX + 'px';
            bubble.style.top = boundedY + 'px';
        }
    });
    
    // Add mouseup event to stop dragging
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            bubble.style.cursor = 'grab';
            bubble.style.userSelect = 'auto';
        }
    });
    
    // Add visual feedback for draggable area
    bubble.style.cursor = 'grab';
}

// Handle Ask callback from bubble component
async function handleAsk(action, selectedText, customQuestion) {
    
    let prompt = selectedText;
    if (action === 'summarize') {
        prompt = SUMMARY_PROMPT + selectedText;
    } else if (action === 'explain') {
        prompt = EXPLAIN_PROMPT + selectedText;
    } else if (action === 'custom') {
        prompt = customQuestion + " " + selectedText;
    }

    const response = await askAi(API_KEY, SYSTEM_PROMPT, prompt);
    return response;
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


function getStorageKey(key) {
    return new Promise((resolve, reject) => {
        try {
            if (!chrome.storage || !chrome.storage.sync) {
                console.error('Chrome storage API not available');
                resolve(null);
                return;
            }

            chrome.storage.sync.get([key], (result) => {
                if (chrome.runtime.lastError) {
                    console.error('Chrome storage error:', chrome.runtime.lastError);
                    resolve(null);
                } else {
                    resolve(result[key]);
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