function createBubbleComponent(selectedText, onAsk) {
    // Remove any existing bubble
    const existingBubble = document.getElementById('ai-cursor-bubble');
    if (existingBubble) {
        existingBubble.remove();
    }

    // Create main bubble container with dark theme
    const bubble = document.createElement('div');
    bubble.id = 'ai-cursor-bubble';
    bubble.className = 'ai-custom-bubble';
    bubble.style.cssText = `
        position: absolute !important;
        background: rgba(30, 30, 30, 0.95) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 16px !important;
        padding: 24px !important;
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05) !important;
        z-index: 999999 !important;
        max-width: 380px !important;
        min-width: 320px !important;
        font-family: 'Raleway', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        font-size: 14px !important;
        color: #e8e8e8 !important;
        opacity: 1 !important;
        transform: none !important;
        display: block !important;
        box-sizing: border-box !important;
        backdrop-filter: blur(10px) !important;
        animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    `;

    // Add animation keyframes
    if (!document.getElementById('bubble-animations')) {
        const style = document.createElement('style');
        style.id = 'bubble-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(10px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Selected text section with dark theme
    if (selectedText) {
        const selectedTextContainer = document.createElement('div');
        selectedTextContainer.style.cssText = `
            margin-bottom: 20px !important;
            position: relative !important;
            display: block !important;
        `;

        const selectedTextDiv = document.createElement('div');
        const truncatedText = selectedText.length > 50 ? selectedText.substring(0, 50) + '....' : selectedText;
        selectedTextDiv.textContent = truncatedText;
        selectedTextDiv.style.cssText = `
            font-weight: 400 !important;
            padding: 12px 16px !important;
            background: rgba(20, 20, 20, 0.6) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
            border-radius: 12px !important;
            color: #f5f5f5 !important;
            font-size: 14px !important;
            display: block !important;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
            letter-spacing: 0.3px !important;
        `;

        // Hover popup with dark theme
        if (selectedText.length > 50) {
            const hoverPopup = document.createElement('div');
            hoverPopup.textContent = selectedText;
            hoverPopup.style.cssText = `
                position: absolute !important;
                bottom: 100% !important;
                left: 0 !important;
                right: 0 !important;
                background: rgb(20, 20, 20) !important;
                color: #e8e8e8 !important;
                padding: 12px 16px !important;
                border-radius: 12px !important;
                font-size: 13px !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                margin-bottom: 8px !important;
                word-wrap: break-word !important;
                z-index: 1000000 !important;
                display: block !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
                backdrop-filter: blur(10px) !important;
            `;

            // Add hover events with dark theme transitions
            selectedTextDiv.addEventListener('mouseenter', () => {
                selectedTextDiv.style.background = 'rgba(20, 20, 20, 0.8)';
                selectedTextDiv.style.borderColor = 'rgba(255, 20, 147, 0.3)';
                hoverPopup.style.opacity = '1';
                hoverPopup.style.visibility = 'visible';
            });

            selectedTextDiv.addEventListener('mouseleave', () => {
                selectedTextDiv.style.background = 'rgba(20, 20, 20, 0.6)';
                selectedTextDiv.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                hoverPopup.style.opacity = '0';
                hoverPopup.style.visibility = 'hidden';
            });

            selectedTextContainer.appendChild(hoverPopup);
        }

        selectedTextContainer.appendChild(selectedTextDiv);
        bubble.appendChild(selectedTextContainer);
    }

    // Action buttons section with gradient theme
    const actionsContainer = document.createElement('div');
    actionsContainer.style.cssText = `
        display: flex !important;
        gap: 12px !important;
        margin-bottom: 20px !important;
    `;

    // Create Summarize button with gradient
    const summarizeBtn = document.createElement('button');
    summarizeBtn.textContent = 'Summarize';
    summarizeBtn.style.cssText = `
        flex: 1 !important;
        background: linear-gradient(135deg, #ff1493 0%, #ff0000 50%, #ff4500 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 12px 16px !important;
        cursor: pointer !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        letter-spacing: 0.5px !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        display: block !important;
        font-family: inherit !important;
        position: relative !important;
        overflow: hidden !important;
    `;
    
    // Add shimmer effect
    summarizeBtn.addEventListener('mouseenter', () => {
        summarizeBtn.style.transform = 'translateY(-1px)';
        summarizeBtn.style.boxShadow = '0 4px 15px rgba(255, 20, 147, 0.3)';
    });
    summarizeBtn.addEventListener('mouseleave', () => {
        summarizeBtn.style.transform = 'translateY(0)';
        summarizeBtn.style.boxShadow = 'none';
    });
    summarizeBtn.addEventListener('click', () => {
        onAsk('summarize', selectedText, '');
    });

    // Create Explain button with gradient
    const explainBtn = document.createElement('button');
    explainBtn.textContent = 'Explain';
    explainBtn.style.cssText = `
        flex: 1 !important;
        background: linear-gradient(135deg, #ff4500 0%, #ffa500 50%, #ff1493 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 12px 16px !important;
        cursor: pointer !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        letter-spacing: 0.5px !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        display: block !important;
        font-family: inherit !important;
        position: relative !important;
        overflow: hidden !important;
    `;

    explainBtn.addEventListener('mouseenter', () => {
        explainBtn.style.transform = 'translateY(-1px)';
        explainBtn.style.boxShadow = '0 4px 15px rgba(255, 69, 0, 0.3)';
    });
    explainBtn.addEventListener('mouseleave', () => {
        explainBtn.style.transform = 'translateY(0)';
        explainBtn.style.boxShadow = 'none';
    });
    explainBtn.addEventListener('click', () => {
        onAsk('explain', selectedText, '');
    });

    actionsContainer.appendChild(summarizeBtn);
    actionsContainer.appendChild(explainBtn);
    bubble.appendChild(actionsContainer);

    // Custom question input with dark theme
    const customInput = document.createElement('textarea');
    customInput.placeholder = 'Custom question text...';
    customInput.style.cssText = `
        width: 100% !important;
        background: rgba(20, 20, 20, 0.6) !important;
        border: 1px solid rgb(255, 255, 255) !important;
        border-radius: 12px !important;
        padding: 14px 16px !important;
        font-size: 14px !important;
        font-family: inherit !important;
        resize: vertical !important;
        min-height: 80px !important;
        margin-bottom: 20px !important;
        box-sizing: border-box !important;
        outline: none !important;
        color: #e8e8e8 !important;
        display: block !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
    `;


    customInput.addEventListener('focus', () => {
        customInput.style.borderColor = 'rgba(255, 20, 147, 0.5)';
        customInput.style.background = 'rgba(20, 20, 20, 0.8)';
        customInput.style.boxShadow = '0 0 0 3px rgba(255, 20, 147, 0.1), 0 4px 12px rgba(0, 0, 0, 0.2)';
        customInput.style.transform = 'translateY(-1px)';
    });
    customInput.addEventListener('blur', () => {
        customInput.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        customInput.style.background = 'rgba(20, 20, 20, 0.6)';
        customInput.style.boxShadow = 'none';
        customInput.style.transform = 'translateY(0)';
    });
    
    customInput.style.setProperty('--placeholder-color', 'rgb(255, 255, 255)')
    const style = document.createElement('style');
    style.textContent = ` textarea { --placeholder-color: rgb(255, 255, 255); } textarea::placeholder { color: var(--placeholder-color) !important; } `; document.head.appendChild(style);
    document.head.appendChild(style);


    bubble.appendChild(customInput);

    // Ask button with main gradient
    const askButton = document.createElement('button');
    askButton.textContent = 'ASK';
    askButton.style.cssText = `
        width: 100% !important;
        background: linear-gradient(135deg, #ff1493 0%, #ff0000 25%, #ff4500 75%, #ffa500 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 14px 24px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        letter-spacing: 0.5px !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        display: block !important;
        font-family: inherit !important;
        position: relative !important;
        overflow: hidden !important;
    `;

    // Add shimmer effect on hover
    askButton.addEventListener('mouseenter', () => {
        askButton.style.transform = 'translateY(-1px)';
        askButton.style.boxShadow = '0 4px 15px rgba(255, 20, 147, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1)';
    });
    askButton.addEventListener('mouseleave', () => {
        askButton.style.transform = 'translateY(0)';
        askButton.style.boxShadow = 'none';
    });
    askButton.addEventListener('click', () => {
        const customQuestion = customInput.value.trim();
        if (customQuestion) {
            onAsk('custom', selectedText, customQuestion);
        }
    });

    bubble.appendChild(askButton);

    // Add close functionality (click outside to close)
    const closeHandler = (event) => {
        if (!bubble.contains(event.target)) {
            bubble.style.animation = 'slideOut 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            setTimeout(() => {
                bubble.remove();
                document.removeEventListener('click', closeHandler);
            }, 200);
        }
    };

    // Add slide out animation
    if (!document.getElementById('bubble-animations-out')) {
        const style = document.createElement('style');
        style.id = 'bubble-animations-out';
        style.textContent = `
            @keyframes slideOut {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(-10px) scale(0.95);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Delay adding the close handler to prevent immediate closing
    setTimeout(() => {
        document.addEventListener('click', closeHandler);
    }, 100);

    // Add escape key to close
    const escapeHandler = (event) => {
        if (event.key === 'Escape') {
            bubble.style.animation = 'slideOut 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards';
            setTimeout(() => {
                bubble.remove();
                document.removeEventListener('keydown', escapeHandler);
                document.removeEventListener('click', closeHandler);
            }, 200);
        }
    };
    document.addEventListener('keydown', escapeHandler);

    return bubble;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { createBubbleComponent };
}
