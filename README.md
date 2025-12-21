# Nexor-Digital

A modern web development agency website with an integrated AI chatbot.

## Features

- 🎨 Modern, responsive design
- 💬 AI-powered chatbot (ChatGPT-like)
- 📱 Mobile-friendly interface
- ⚡ Fast and optimized
- 🎯 Portfolio showcase
- 📧 Contact form

## Chatbot Setup

The website includes a fully functional AI chatbot powered by Google's Gemini AI (FREE tier available). To enable the chatbot:

### 1. Get Free Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account (or create one for free)
3. Click "Create API Key"
4. Copy the API key (it will look like: `AIza...`)

**Note**: Google Gemini offers a generous free tier with 60 requests per minute!

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with your actual Gemini API key.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### 5. Access the Website

Open your browser and navigate to:
- `http://localhost:4000`

The chatbot button will appear in the bottom-right corner of the page.

## Chatbot Features

- ✅ Real-time AI responses
- ✅ Conversation history
- ✅ Typing indicators
- ✅ Modern, responsive UI
- ✅ Mobile-friendly design
- ✅ Context-aware conversations

## Project Structure

```
Nexor-Digital-main/
├── css/
│   └── style.css          # Main stylesheet
├── js/
│   ├── script.js          # Main JavaScript
│   └── chatbot.js         # Chatbot functionality
├── images/                # Image assets
├── index.html             # Main HTML file
├── server.js              # Express server
├── package.json           # Dependencies
└── .env                   # Environment variables (create this)
```

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **AI**: Google Gemini Pro (Free tier)
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins)

## API Endpoints

- `POST /api/chat` - Chatbot endpoint
- `POST /api/contact` - Contact form submission
- `GET /api/projects` - Get projects list

## Notes

- The chatbot uses Google Gemini AI which offers a **FREE tier** (60 requests/minute)
- No credit card required for the free tier
- The chatbot maintains conversation context for better responses
- All API keys should be kept secure and never committed to version control
- For production use, consider upgrading to Gemini Pro for higher rate limits

## License

This project is proprietary and confidential.
