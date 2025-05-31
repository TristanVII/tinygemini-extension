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
        position: fixed !important;
        background: rgba(30, 30, 30, 0.95) !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        border-radius: 16px !important;
        padding: 24px !important;
        box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.3) !important,
            0 2px 8px rgba(0, 0, 0, 0.2) !important,
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
                    opacity: 0 !important;
                    transform: translateY(10px) scale(0.95) !important;
                }
                to {
                    opacity: 1 !important;
                    transform: translateY(0) scale(1) !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Create container for initial content
    const initialContent = document.createElement('div');
    initialContent.id = 'initial-content';

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
            cursor: pointer !important;
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
                z-index: 1000001 !important;
                display: block !important;
                border: 1px solid rgba(255, 255, 255, 0.1) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
                backdrop-filter: blur(10px) !important;
                pointer-events: none !important;
                max-width: 320px !important;
                white-space: pre-wrap !important;
            `;

            // Add hover events with dark theme transitions
            selectedTextDiv.addEventListener('mouseenter', (e) => {
                console.log('Mouse entered selected text div');
                selectedTextDiv.style.setProperty('background', 'rgba(20, 20, 20, 0.8)', 'important');
                selectedTextDiv.style.setProperty('border-color', 'rgba(255, 20, 147, 0.3)', 'important');
                hoverPopup.style.setProperty('opacity', '1', 'important');
                hoverPopup.style.setProperty('visibility', 'visible', 'important');
                console.log('Popup should be visible now');
            });

            selectedTextDiv.addEventListener('mouseleave', (e) => {
                console.log('Mouse left selected text div');
                selectedTextDiv.style.setProperty('background', 'rgba(20, 20, 20, 0.6)', 'important');
                selectedTextDiv.style.setProperty('border-color', 'rgba(255, 255, 255, 0.1)', 'important');
                hoverPopup.style.setProperty('opacity', '0', 'important');
                hoverPopup.style.setProperty('visibility', 'hidden', 'important');
            });

            // Add the popup to the container BEFORE the selected text div
            selectedTextContainer.appendChild(hoverPopup);
            console.log('Hover popup created and added for text:', selectedText.substring(0, 20) + '...');
        }

        selectedTextContainer.appendChild(selectedTextDiv);
        initialContent.appendChild(selectedTextContainer);

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
            summarizeBtn.style.transform = 'translateY(-1px) !important';
            summarizeBtn.style.boxShadow = '0 4px 15px rgba(255, 20, 147, 0.3) !important';
        });
        summarizeBtn.addEventListener('mouseleave', () => {
            summarizeBtn.style.transform = 'translateY(0) !important';
            summarizeBtn.style.boxShadow = 'none !important';
        });
        summarizeBtn.addEventListener('click', async () => {
            try {
                showLoading();
                const response = await onAsk('summarize', selectedText, '');
                showResponse(response);
            } catch (error) {
                console.error('Error getting response:', error);
                showError('Failed to get response. Please try again.');
            }
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
            explainBtn.style.transform = 'translateY(-1px) !important';
            explainBtn.style.boxShadow = '0 4px 15px rgba(255, 69, 0, 0.3) !important';
        });
        explainBtn.addEventListener('mouseleave', () => {
            explainBtn.style.transform = 'translateY(0) !important';
            explainBtn.style.boxShadow = 'none !important';
        });
        explainBtn.addEventListener('click', async () => {
            try {
                showLoading();
                const response = await onAsk('explain', selectedText, '');
                showResponse(response);
            } catch (error) {
                console.error('Error getting response:', error);
                showError('Failed to get response. Please try again.');
            }
        });

        actionsContainer.appendChild(summarizeBtn);
        actionsContainer.appendChild(explainBtn);
        initialContent.appendChild(actionsContainer);
    }

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
        customInput.style.borderColor = 'rgba(255, 20, 147, 0.5) !important';
        customInput.style.background = 'rgba(20, 20, 20, 0.8) !important';
        customInput.style.boxShadow = '0 0 0 3px rgba(255, 20, 147, 0.1), 0 4px 12px rgba(0, 0, 0, 0.2) !important';
        customInput.style.transform = 'translateY(-1px) !important';
    });
    customInput.addEventListener('blur', () => {
        customInput.style.borderColor = 'rgb(255, 255, 255) !important';
        customInput.style.background = 'rgba(20, 20, 20, 0.6) !important';
        customInput.style.boxShadow = 'none !important';
        customInput.style.transform = 'translateY(0) !important';
    });

    customInput.style.setProperty('--placeholder-color', 'rgb(255, 255, 255)')
    const style = document.createElement('style');
    style.textContent = ` textarea { --placeholder-color: rgb(255, 255, 255) !important; } textarea::placeholder { color: var(--placeholder-color) !important; } `; document.head.appendChild(style);
    document.head.appendChild(style);

    initialContent.appendChild(customInput);

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
        askButton.style.transform = 'translateY(-1px) !important';
        askButton.style.boxShadow = '0 4px 15px rgba(255, 20, 147, 0.3), 0 2px 8px rgba(0, 0, 0, 0.1) !important';
    });
    askButton.addEventListener('mouseleave', () => {
        askButton.style.transform = 'translateY(0) !important';
        askButton.style.boxShadow = 'none !important';
    });
    askButton.addEventListener('click', async () => {
        const customQuestion = customInput.value.trim();
        if (customQuestion) {
            try {
                showLoading();
                const response = await onAsk('custom', selectedText, customQuestion);
                showResponse(response);
            } catch (error) {
                console.error('Error getting response:', error);
                showError('Failed to get response. Please try again.');
            }
        }
    });

    initialContent.appendChild(askButton);

    // Create loading container
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'loading-content';
    loadingContainer.style.cssText = `
        display: none !important;
        width: 100% !important;
        text-align: center !important;
        padding: 40px 20px !important;
    `;

    // Create loading spinner
    const loadingSpinner = document.createElement('div');
    loadingSpinner.style.cssText = `
        width: 40px !important;
        height: 40px !important;
        border: 3px solid rgba(255, 255, 255, 0.1) !important;
        border-top: 3px solid #ff1493 !important;
        border-radius: 50% !important;
        animation: spin 1s linear infinite !important;
        margin: 0 auto 20px auto !important;
        display: block !important;
    `;

    // Add spinner animation
    if (!document.getElementById('spinner-animation')) {
        const style = document.createElement('style');
        style.id = 'spinner-animation';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg) !important; }
                100% { transform: rotate(360deg) !important; }
            }
        `;
        document.head.appendChild(style);
    }

    const loadingText = document.createElement('div');
    loadingText.textContent = 'Getting AI response...';
    loadingText.style.cssText = `
        color: #e8e8e8 !important;
        font-size: 16px !important;
        font-weight: 500 !important;
        margin-bottom: 10px !important;
    `;

    const loadingSubtext = document.createElement('div');
    loadingSubtext.textContent = 'Please wait while we process your request';
    loadingSubtext.style.cssText = `
        color: rgba(255, 255, 255, 0.6) !important;
        font-size: 13px !important;
    `;

    loadingContainer.appendChild(loadingSpinner);
    loadingContainer.appendChild(loadingText);
    loadingContainer.appendChild(loadingSubtext);

    // Create response container (initially hidden)
    const responseContainer = document.createElement('div');
    responseContainer.id = 'response-content';
    responseContainer.style.cssText = `
        display: none !important;
        width: 100% !important;
    `;

    // Create large response text area
    const responseTextArea = document.createElement('textarea');
    responseTextArea.style.cssText = `
        width: 100% !important;
        background: rgba(20, 20, 20, 0.6) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
        border-radius: 12px !important;
        padding: 16px !important;
        font-size: 14px !important;
        font-family: inherit !important;
        resize: vertical !important;
        min-height: 300px !important;
        max-height: 500px !important;
        margin-bottom: 16px !important;
        box-sizing: border-box !important;
        outline: none !important;
        color: #e8e8e8 !important;
        display: block !important;
        line-height: 1.5 !important;
        white-space: pre-wrap !important;
        overflow-y: auto !important;
        readonly: true !important;
    `;
    responseTextArea.readOnly = true;

    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy Response';
    copyButton.style.cssText = `
        width: 100% !important;
        background: linear-gradient(135deg, #28a745 0%, #20c997 50%, #17a2b8 100%) !important;
        color: white !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 12px 24px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        letter-spacing: 0.5px !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        display: block !important;
        font-family: inherit !important;
        margin-bottom: 12px !important;
    `;

    copyButton.addEventListener('mouseenter', () => {
        copyButton.style.transform = 'translateY(-1px) !important';
        copyButton.style.boxShadow = '0 4px 15px rgba(40, 167, 69, 0.3) !important';
    });
    copyButton.addEventListener('mouseleave', () => {
        copyButton.style.transform = 'translateY(0) !important';
        copyButton.style.boxShadow = 'none !important';
    });
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(responseTextArea.value).then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        });
    });

    // Create back button
    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.style.cssText = `
        width: 100% !important;
        background: rgba(60, 60, 60, 0.8) !important;
        color: #e8e8e8 !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
        border-radius: 12px !important;
        padding: 12px 24px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        letter-spacing: 0.5px !important;
        cursor: pointer !important;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        display: block !important;
        font-family: inherit !important;
    `;

    backButton.addEventListener('mouseenter', () => {
        backButton.style.background = 'rgba(80, 80, 80, 0.8) !important';
        backButton.style.transform = 'translateY(-1px) !important';
    });
    backButton.addEventListener('mouseleave', () => {
        backButton.style.background = 'rgba(60, 60, 60, 0.8) !important';
        backButton.style.transform = 'translateY(0) !important';
    });
    backButton.addEventListener('click', () => {
        console.log('Back button clicked');
        responseContainer.style.display = 'none';
        loadingContainer.style.display = 'none';
        initialContent.style.display = 'block';
        bubble.style.maxWidth = '380px';
        bubble.style.minWidth = '320px';
        console.log('Back to initial state');
    });

    responseContainer.appendChild(responseTextArea);
    responseContainer.appendChild(copyButton);
    responseContainer.appendChild(backButton);

    // Function to show loading
    function showLoading() {
        console.log('showLoading called');
        console.log('initialContent:', initialContent);
        console.log('loadingContainer:', loadingContainer);
        console.log('responseContainer:', responseContainer);
        
        initialContent.style.display = 'none';
        responseContainer.style.display = 'none';
        loadingContainer.style.display = 'block';
        
        console.log('Loading state should be visible now');
    }

    // Function to show response
    function showResponse(response) {
        console.log('showResponse called with:', response);
        
        if (!response) {
            console.log('No response received, showing error');
            showError('No response received');
            return;
        }
        
        console.log('Setting response text and switching views');
        responseTextArea.value = response;
        
        loadingContainer.style.display = 'none';
        initialContent.style.display = 'none';
        responseContainer.style.display = 'block';
        
        // Make bubble larger for response
        bubble.style.maxWidth = '600px';
        bubble.style.minWidth = '500px';
        
        console.log('Response should be visible now');
    }

    // Function to show error
    function showError(errorMessage) {
        console.log('showError called with:', errorMessage);
        
        loadingContainer.style.display = 'none';
        responseContainer.style.display = 'none';
        initialContent.style.display = 'block';
        
        // Show error message temporarily
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            background: linear-gradient(135deg, #dc3545, #c82333) !important;
            color: white !important;
            padding: 12px 20px !important;
            border-radius: 8px !important;
            font-size: 14px !important;
            z-index: 1000000 !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
        `;
        errorDiv.textContent = errorMessage;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 3000);
        
        console.log('Error message shown, back to initial state');
    }

    // Add both containers to bubble
    bubble.appendChild(initialContent);
    bubble.appendChild(loadingContainer);
    bubble.appendChild(responseContainer);

    // Add close functionality (click outside to close)
    const closeHandler = (event) => {
        if (!bubble.contains(event.target)) {
            bubble.style.animation = 'slideOut 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards !important';
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
                    opacity: 1 !important;
                    transform: translateY(0) scale(1) !important;
                }
                to {
                    opacity: 0 !important;
                    transform: translateY(-10px) scale(0.95) !important;
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
            bubble.style.animation = 'slideOut 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards !important';
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
