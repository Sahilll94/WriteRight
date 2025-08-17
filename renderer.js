// Wait for DOM to load
document.addEventListener('DOMContentLoaded', async () => {
  const apiKeyInput = document.getElementById('api-key-input');
  const saveButton = document.getElementById('save-button');
  const closeButton = document.getElementById('close-button');
  const statusElement = document.getElementById('status');
  const loaderElement = document.getElementById('loader');
  const statusContainer = document.getElementById('status-container');
  const setupView = document.getElementById('setup-view');
  const successView = document.getElementById('success-view');
  
  // Check if API key is already saved
  try {
    const savedApiKey = await window.api.getApiKey();
    if (savedApiKey) {
      apiKeyInput.value = savedApiKey;
      
      // Show success view directly if API key is already set
      setupView.style.display = 'none';
      successView.style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading API key:', error);
    updateStatus('Failed to load API key.', 'error');
  }
  
  // Save API key button handler
  saveButton.addEventListener('click', async () => {
    const apiKey = apiKeyInput.value.trim();
    
    if (!apiKey) {
      updateStatus('Please enter a valid API key.', 'error');
      return;
    }
    
    try {
      loaderElement.style.display = 'inline-block';
      updateStatus('Saving API key...', 'info');
      
      // Test the API key with a simple request
      const isValid = await testApiKey(apiKey);
      
      if (isValid) {
        await window.api.saveApiKey(apiKey);
        updateStatus('API Key saved successfully!', 'success');
        
        // Show success view
        setupView.style.display = 'none';
        successView.style.display = 'block';
      } else {
        updateStatus('Invalid API key. Please check and try again.', 'error');
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      updateStatus('Failed to save API key: ' + error.message, 'error');
    } finally {
      loaderElement.style.display = 'none';
    }
  });
  
  // Close button handler
  if (closeButton) {
    closeButton.addEventListener('click', async () => {
      // Hide the window instead of closing the app
      await window.api.hideWindow();
    });
  }
  
  // Setup listener for status updates
  window.api.onStatusUpdate((message, type) => {
    updateStatus(message, type);
  });
  
  // Setup listener for text processing
  window.api.onProcessText(async (text) => {
    try {
      if (!text) return;
      
      // Process text correction
      const correctedText = await correctGrammar(text);
      
      if (correctedText) {
        // Write the corrected text to clipboard
        await window.api.writeToClipboard(correctedText);
      }
    } catch (error) {
      console.error('Error processing text:', error);
    }
  });
  
  // Update status message
  function updateStatus(message, type = 'info') {
    statusElement.textContent = message;
    statusContainer.className = 'status-container ' + type;
    statusContainer.style.display = 'block';
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success' && message !== 'API Key saved successfully!') {
      setTimeout(() => {
        statusContainer.style.display = 'none';
      }, 5000);
    }
  }
  
  // Test if API key is valid
  async function testApiKey(apiKey) {
    try {
      // Use direct fetch approach to the Gemini API
      const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
      const url = `${endpoint}?key=${apiKey}`;
      
      const requestData = {
        contents: [
          {
            parts: [
              {
                text: "Hello, please respond with just the word 'valid' if you can read this message."
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 10
        }
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        return false;
      }
      
      const data = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const text = data.candidates[0].content.parts[0].text.toLowerCase();
        return text.includes('valid');
      }
      
      return false;
    } catch (error) {
      console.error('API key validation error:', error);
      return false;
    }
  }
  
  // Function to correct grammar using Gemini API
  async function correctGrammar(text) {
    try {
      const apiKey = await window.api.getApiKey();
      if (!apiKey) throw new Error("API key not set");
      
      // Check if text is valid
      if (!text || text.trim() === "") {
        throw new Error("No text selected");
      }
      
      // Check if text is the API key (additional safety)
      if (text === apiKey) {
        throw new Error("Cannot process API key as input text");
      }
      
      console.log("Processing text:", text); // Debug log
      
      // Use direct fetch approach to the Gemini API
      const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
      const url = `${endpoint}?key=${apiKey}`;
      
      const requestData = {
        contents: [
          {
            parts: [
              {
                text: `You are a grammar and readability correction tool. Fix grammar and improve readability of this text without changing meaning. Respond ONLY with the corrected text, no explanations:\n\n${text}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1,
          topP: 0.8,
          topK: 40,
        }
      };
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data); // Debug log
      
      // Extract the corrected text
      if (data.candidates && data.candidates[0]?.content?.parts) {
        const correctedText = data.candidates[0].content.parts[0].text.trim();
        
        // Make sure we got actual content back
        if (correctedText && correctedText !== text) {
          return correctedText;
        } else {
          console.warn("API returned same text or empty response");
          return text; // Return original if no changes were made
        }
      } else {
        throw new Error("Unexpected API response format");
      }
    } catch (error) {
      console.error('Grammar correction error:', error);
      throw error;
    }
  }
});
