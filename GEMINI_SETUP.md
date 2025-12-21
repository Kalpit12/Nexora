# How to Get a FREE Gemini API Key

## Step 1: Get Your Free API Key

1. **Visit Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Sign in** with your Google account (or create one - it's free!)
3. **Click "Create API Key"** button
4. **Copy the API key** (it will start with `AIza...`)

## Step 2: Update Your .env File

Open your `.env` file and replace the OpenAI key with your Gemini key:

```env
PORT=4000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with the key you copied.

## Step 3: Restart Your Server

After updating the `.env` file:

1. Stop the server (Ctrl + C)
2. Start it again:
   ```bash
   npm start
   ```

## Free Tier Limits

- ✅ **60 requests per minute** (FREE)
- ✅ **No credit card required**
- ✅ **No expiration** (as long as you have a Google account)
- ✅ **Same quality as ChatGPT**

## That's It!

Your chatbot will now work with the free Gemini API! 🎉

