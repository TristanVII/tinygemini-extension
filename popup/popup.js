const NOTIFICATION_DURATION = 3000;
const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error'
}

document.addEventListener('DOMContentLoaded', function () {
    const apiKeyInput = document.getElementById('apiKey');
    const systemPromptInput = document.getElementById('systemPrompt');
    const saveBtn = document.getElementById('saveKey');
    const togglePasswordBtn = document.getElementById('togglePassword');
    const eyeIcon = togglePasswordBtn.querySelector('.eye-icon');
    const notificationList = document.querySelector('.notifications')

    loadSavedApiKey();
    loadSavedSystemPrompt();
    // Password toggle functionality
    togglePasswordBtn.addEventListener('click', function () {
        const isPassword = apiKeyInput.type === 'password';

        if (isPassword) {
            apiKeyInput.type = 'text';
            eyeIcon.className = 'fas fa-eye-slash eye-icon'; // eye-slash icon
            togglePasswordBtn.classList.add('hidden');
        } else {
            apiKeyInput.type = 'password';
            eyeIcon.className = 'fas fa-eye eye-icon'; // eye icon
            togglePasswordBtn.classList.remove('hidden');
        }
    });

    saveBtn.addEventListener('click', function () {
        const apiKey = apiKeyInput.value.trim();
        const systemPrompt = systemPromptInput.value.trim();
        if (!apiKey) {
            addNotification(notificationList, 'Please enter an API key', NOTIFICATION_TYPES.ERROR);
            return;
        }


        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving...';

        chrome.storage.sync.set({ geminiApiKey: apiKey, systemPrompt: systemPrompt }, function () {
            if (chrome.runtime.lastError) {
                addNotification(notificationList, 'Error saving settings', NOTIFICATION_TYPES.ERROR);
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Settings';
            } else {
                addNotification(notificationList, 'Settings saved successfully!', NOTIFICATION_TYPES.SUCCESS);
                saveBtn.disabled = false;
                saveBtn.textContent = 'Save Settings';
            }
        });
    });

    apiKeyInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            saveBtn.click();
        }
    });

    // Load saved API key
    function loadSavedApiKey() {
        chrome.storage.sync.get(['geminiApiKey'], function (result) {
            if (result.geminiApiKey) {
                apiKeyInput.value = result.geminiApiKey;
            }
        });
    }

    function loadSavedSystemPrompt() {
        chrome.storage.sync.get(['systemPrompt'], function (result) {
            if (result.systemPrompt) {
                systemPromptInput.value = result.systemPrompt;
            }
        });
    }
});

function addNotification(notificationList, message, type) {
    const notificationItem = document.createElement('div');
    notificationItem.classList.add('notification', type);
    notificationItem.textContent = message;
    for (const child of notificationList.children) {
        child.remove();
    }
    notificationList.appendChild(notificationItem);
    setTimeout(() => {
        notificationItem.remove();
    }, NOTIFICATION_DURATION);
}