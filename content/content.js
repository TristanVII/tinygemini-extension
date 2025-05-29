// Global variables
let currentBubble = null;
let lastSelectedText = '';
let lastSelection = null;

// Initialize the content script
function init() {
    console.log('Ask AI extension initialized');
    
    // Listen for keyboard shortcuts on both document and window
    document.addEventListener('keydown', handleKeydown, true); // Use capture phase
    window.addEventListener('keydown', handleKeydown, true);
    
    // Listen for text selection changes
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);
    
    // Add context menu listener as backup
    document.addEventListener('contextmenu', handleContextMenu);
    
    // Clean up on page unload
    window.addEventListener('beforeunload', cleanup);
    
    // Add a visual indicator that the extension is loaded (temporary)
    console.log('Ask AI: Select text and press Option+A (or Alt+A) to activate');
}

// Handle keyboard shortcuts
function handleKeydown(event) {
    
    if (event.altKey) {
        // Prevent default behavior (like Select All)
        event.preventDefault();
        event.stopPropagation();
        
        console.log('Option + A detected, triggering Ask AI');
        handleAskAI();
        return false;
    }
    
    // Close bubble on Escape
    if (event.key === 'Escape') {
        closeChatBubble();
    }
}

// Handle text selection
function handleTextSelection() {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    if (selectedText && selectedText !== lastSelectedText) {
        lastSelectedText = selectedText;
        lastSelection = selection.getRangeAt(0);
    }
}

// Handle context menu (right-click)
function handleContextMenu(event) {
    const selectedText = getSelectedText();
    
    if (selectedText) {
        // Remove any existing context menu
        removeCustomContextMenu();
        
        // Create custom context menu
        const contextMenu = document.createElement('div');
        contextMenu.id = 'ask-ai-context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            cursor: pointer;
            user-select: none;
        `;
        contextMenu.textContent = '🤖 Ask AI about this text';
        
        // Position near cursor
        contextMenu.style.left = event.pageX + 'px';
        contextMenu.style.top = event.pageY + 'px';
        
        // Add click handler
        contextMenu.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeCustomContextMenu();
            handleAskAI();
        });
        
        // Add to page
        document.body.appendChild(contextMenu);
        
        // Remove menu after 3 seconds or on any click
        setTimeout(removeCustomContextMenu, 3000);
        document.addEventListener('click', removeCustomContextMenu, { once: true });
    }
}

// Remove custom context menu
function removeCustomContextMenu() {
    const menu = document.getElementById('ask-ai-context-menu');
    if (menu) {
        menu.remove();
    }
}

// Handle Ask AI functionality
async function handleAskAI() {
    const selectedText = getSelectedText();
    
    if (!selectedText) {
        showTemporaryMessage('Please select some text first');
        return;
    }
    
    // Check if API key is configured
    const apiKey = await getApiKey();
    if (!apiKey) {
        showTemporaryMessage('Please configure your Gemini API key in the extension popup');
        return;
    }
    
    showChatBubble(selectedText);
}

// Get currently selected text
function getSelectedText() {
    const selection = window.getSelection();
    return selection.toString().trim();
}

// Get API key from storage
function getApiKey() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['geminiApiKey'], (result) => {
            resolve(result.geminiApiKey);
        });
    });
}

// Show chat bubble
function showChatBubble(selectedText) {
    // Close existing bubble
    closeChatBubble();
    
    // Create bubble element
    const bubble = createChatBubble(selectedText);
    currentBubble = bubble;
    
    // Position bubble
    positionBubble(bubble);
    
    // Add to page
    document.body.appendChild(bubble);
    
    // Show with animation
    requestAnimationFrame(() => {
        bubble.classList.add('show');
    });
    
    // Add click outside listener
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);
}

// Create chat bubble element
function createChatBubble(selectedText) {
    const bubble = document.createElement('div');
    bubble.className = 'ai-chat-bubble';
    bubble.innerHTML = `
        <div class="header">
            <div class="title">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                </svg>
                Ask AI
            </div>
            <button class="close-btn" type="button">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
        <div class="content">
            <div class="selected-text">"${escapeHtml(selectedText)}"</div>
            <div class="actions">
                <button class="action-btn" data-action="explain">Explain</button>
                <button class="action-btn" data-action="summarize">Summarize</button>
                <button class="action-btn" data-action="translate">Translate</button>
                <button class="action-btn" data-action="improve">Improve</button>
            </div>
        </div>
    `;
    
    // Add event listeners
    const closeBtn = bubble.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeChatBubble);
    
    const actionBtns = bubble.querySelectorAll('.action-btn');
    actionBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            handleAction(action, selectedText, bubble);
        });
    });
    
    return bubble;
}

// Position bubble near the selection
function positionBubble(bubble) {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Position to the right of the selection
    let left = rect.right + 10;
    let top = rect.top + window.scrollY;
    
    // Adjust if bubble would go off screen
    const bubbleWidth = 350; // max-width from CSS
    const bubbleHeight = 200; // estimated height
    
    if (left + bubbleWidth > window.innerWidth) {
        left = rect.left - bubbleWidth - 10;
    }
    
    if (left < 10) {
        left = 10;
    }
    
    if (top + bubbleHeight > window.innerHeight + window.scrollY) {
        top = rect.bottom + window.scrollY - bubbleHeight;
    }
    
    if (top < window.scrollY + 10) {
        top = window.scrollY + 10;
    }
    
    bubble.style.left = `${left}px`;
    bubble.style.top = `${top}px`;
}

// Handle action button clicks
async function handleAction(action, selectedText, bubble) {
    const apiKey = await getApiKey();
    if (!apiKey) {
        showError(bubble, 'API key not configured');
        return;
    }
    
    // Show loading state
    showLoading(bubble);
    
    try {
        const response = await queryGemini(action, selectedText, apiKey);
        showResponse(bubble, response);
    } catch (error) {
        showError(bubble, error.message);
    }
}

// Query Gemini API
async function queryGemini(action, text, apiKey) {
    const prompts = {
        explain: `Please explain the following text in simple terms:\n\n"${text}"`,
        summarize: `Please provide a concise summary of the following text:\n\n"${text}"`,
        translate: `Please translate the following text to English (or if it's already in English, translate to Spanish):\n\n"${text}"`,
        improve: `Please improve the following text by making it clearer, more concise, or better written:\n\n"${text}"`
    };
    
    const prompt = prompts[action] || prompts.explain;
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });
    
    if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('No response from AI');
    }
    
    return data.candidates[0].content.parts[0].text;
}

// Show loading state
function showLoading(bubble) {
    const content = bubble.querySelector('.content');
    const existingResponse = content.querySelector('.response, .error, .loading');
    if (existingResponse) {
        existingResponse.remove();
    }
    
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = `
        <span>AI is thinking</span>
        <div class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    
    content.appendChild(loading);
}

// Show AI response
function showResponse(bubble, response) {
    const content = bubble.querySelector('.content');
    const loading = content.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
    
    const responseDiv = document.createElement('div');
    responseDiv.className = 'response';
    responseDiv.textContent = response;
    
    content.appendChild(responseDiv);
}

// Show error message
function showError(bubble, error) {
    const content = bubble.querySelector('.content');
    const loading = content.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = `Error: ${error}`;
    
    content.appendChild(errorDiv);
}

// Close chat bubble
function closeChatBubble() {
    if (currentBubble) {
        currentBubble.classList.remove('show');
        setTimeout(() => {
            if (currentBubble && currentBubble.parentNode) {
                currentBubble.parentNode.removeChild(currentBubble);
            }
            currentBubble = null;
        }, 300);
        
        document.removeEventListener('click', handleClickOutside);
    }
}

// Handle clicks outside bubble
function handleClickOutside(event) {
    if (currentBubble && !currentBubble.contains(event.target)) {
        closeChatBubble();
    }
}

// Show temporary message
function showTemporaryMessage(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 1000000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Cleanup function
function cleanup() {
    closeChatBubble();
    removeCustomContextMenu();
    document.removeEventListener('click', handleClickOutside);
    document.removeEventListener('keydown', handleKeydown, true);
    window.removeEventListener('keydown', handleKeydown, true);
    document.removeEventListener('contextmenu', handleContextMenu);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
} 