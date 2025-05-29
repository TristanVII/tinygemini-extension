document.addEventListener('DOMContentLoaded', function() {
    const apiKeyInput = document.getElementById('apiKey');
    const toggleBtn = document.getElementById('toggleKey');
    const saveBtn = document.getElementById('saveKey');
    const status = document.getElementById('status');

    // Load saved API key
    loadSavedApiKey();

    // Toggle password visibility
    toggleBtn.addEventListener('click', function() {
        const isPassword = apiKeyInput.type === 'password';
        apiKeyInput.type = isPassword ? 'text' : 'password';
        
        // Update icon
        const svg = toggleBtn.querySelector('svg');
        if (isPassword) {
            // Show eye-off icon when text is visible
            svg.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L17.94 17.94z" stroke="currentColor" stroke-width="2"/>
                <path d="M1 1l22 22" stroke="currentColor" stroke-width="2"/>
                <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19l-6.72-6.72a3 3 0 1 0-4.24-4.24z" stroke="currentColor" stroke-width="2"/>
            `;
        } else {
            // Show eye icon when text is hidden
            svg.innerHTML = `
                <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" stroke-width="2"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
            `;
        }
    });

    // Save API key
    saveBtn.addEventListener('click', function() {
        const apiKey = apiKeyInput.value.trim();
        
        if (!apiKey) {
            showStatus('Please enter an API key', 'error');
            return;
        }
        
        if (!isValidApiKey(apiKey)) {
            showStatus('Please enter a valid Gemini API key', 'error');
            return;
        }

        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';
        
        chrome.storage.sync.set({ geminiApiKey: apiKey }, function() {
            if (chrome.runtime.lastError) {
                showStatus('Error saving API key', 'error');
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save API Key';
            } else {
                showStatus('API key saved successfully!', 'success');
                saveBtn.classList.add('success');
                saveBtn.textContent = '✓ Saved';
                
                setTimeout(() => {
                    saveBtn.disabled = false;
                    saveBtn.textContent = 'Save API Key';
                    saveBtn.classList.remove('success');
                }, 2000);
            }
        });
    });

    // Handle Enter key in input
    apiKeyInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
    });

    // Load saved API key
    function loadSavedApiKey() {
        chrome.storage.sync.get(['geminiApiKey'], function(result) {
            if (result.geminiApiKey) {
                apiKeyInput.value = result.geminiApiKey;
            }
        });
    }

    // Validate API key format
    function isValidApiKey(apiKey) {
        // Basic validation for Gemini API key format
        return apiKey.length > 20 && apiKey.startsWith('AIza');
    }

    // Show status message
    function showStatus(message, type) {
        status.textContent = message;
        status.className = `status ${type} show`;
        
        setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    }
}); 