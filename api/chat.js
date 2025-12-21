const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '') {
      console.error('Gemini API key is missing or empty');
      return res.status(500).json({ 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in your .env file. Get a free API key at: https://makersuite.google.com/app/apikey' 
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Get the generative model
    let model;
    const modelNames = ['gemini-pro', 'models/gemini-pro', 'gemini-1.5-flash', 'models/gemini-1.5-flash'];
    
    for (const modelName of modelNames) {
      try {
        model = genAI.getGenerativeModel({ model: modelName });
        console.log(`Successfully initialized model: ${modelName}`);
        break;
      } catch (initError) {
        console.log(`Failed to initialize ${modelName}, trying next...`);
        if (modelNames.indexOf(modelName) === modelNames.length - 1) {
          throw new Error(`Unable to initialize any Gemini model. Error: ${initError.message}`);
        }
      }
    }

    // Build conversation context
    let conversationContext = 'You are a helpful AI assistant for NEXORA DIGITAL, a web development agency. You help answer questions about web development, digital services, and the company. Be friendly, professional, and concise.\n\n';
    
    // Add conversation history if available
    if (history && Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6); // Last 6 messages for context
      conversationContext += 'Previous conversation:\n';
      recentHistory.forEach(msg => {
        if (msg.role === 'user') {
          conversationContext += `User: ${msg.content}\n`;
        } else if (msg.role === 'assistant') {
          conversationContext += `Assistant: ${msg.content}\n`;
        }
      });
      conversationContext += '\n';
    }

    // Add current message
    const fullPrompt = conversationContext + `User: ${message}\nAssistant:`;

    console.log('Sending request to Gemini API...');
    
    // Call Gemini API
    const result = await model.generateContent(fullPrompt);
    const response = result.response;
    const text = response.text();
    console.log('Successfully received response from Gemini API');

    res.json({ 
      success: true, 
      response: text 
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Handle Gemini API errors
    if (error.status) {
      const errorMessage = error.message || 'Gemini API error occurred';
      console.error('Gemini API Error (status):', errorMessage);
      return res.status(error.status || 500).json({ 
        error: errorMessage
      });
    }
    
    // Handle errors with response property
    if (error.response) {
      const errorData = error.response.data || error.response;
      const errorMessage = errorData?.error?.message || error.message || 'Gemini API error occurred';
      const statusCode = error.response.status || error.status || 500;
      console.error('Gemini API Error (response):', errorMessage);
      return res.status(statusCode).json({ 
        error: errorMessage
      });
    }

    // Handle other errors
    const errorMessage = error.message || 'An error occurred while processing your message. Please try again.';
    console.error('General Error:', errorMessage);
    
    res.status(500).json({ 
      error: errorMessage
    });
  }
};

