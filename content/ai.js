async function askAi(apiKey, systemPromptText, userPrompt) {
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const userContentParts = [{ text: userPrompt }];
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: userContentParts
            }
        ]
    };

    if (systemPromptText && systemPromptText.trim() !== '') {
        requestBody.system_instruction = {
            parts: [{ text: systemPromptText }]
        };
    }

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error("API Error");
        }

        const data = await response.json();

        if (data.candidates && data.candidates.length > 0 &&
            data.candidates[0].content && data.candidates[0].content.parts &&
            data.candidates[0].content.parts.length > 0) {
            // Assuming the response is primarily text, even for multimodal input
            return data.candidates[0].content.parts[0].text;
        } else {
            throw new Error("No response from Gemini API");
        }

    } catch (error) {
        throw new Error("Error in askAi function", error);
    }
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = { askAi };
}
