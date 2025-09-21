document.addEventListener('DOMContentLoaded', () => {
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');

  // IMPORTANT: Replace 'YOUR_GEMINI_API_KEY' with your actual Google Gemini API Key.
  // Get your key from Google AI Studio: https://aistudio.google.com/app/apikey
  const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY'; 
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=';

  const displayMessage = (message, type) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${type}-message`);
    messageDiv.innerHTML = `<p>${message}</p>`;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const getGeminiResponse = async (userMessage) => {
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY' || !GEMINI_API_KEY) {
      displayMessage('Please replace "YOUR_GEMINI_API_KEY" in script.js with your actual Gemini API key to start chatting.', 'ai');
      console.error('Gemini API Key is not set. Please update script.js.');
      return;
    }

    try {
      const response = await fetch(`${GEMINI_API_URL}${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: userMessage
            }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        displayMessage(`Sorry, I encountered an API error: ${errorData.error ? errorData.error.message : response.statusText}. Please check your API key and try again later.`, 'ai');
        return;
      }

      const data = await response.json();
      const aiResponse = data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text ?
        data.candidates[0].content.parts[0].text :
        'I could not generate a response at this time. Please try rephrasing your message.';

      displayMessage(aiResponse, 'ai');
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      displayMessage('Sorry, something went wrong while connecting to the AI. Please try again.', 'ai');
    }
  };

  const sendMessage = () => {
    const message = userInput.value.trim();
    if (message) {
      displayMessage(message, 'user');
      userInput.value = '';
      getGeminiResponse(message);
    }
  };

  sendButton.addEventListener('click', sendMessage);

  userInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  });
});