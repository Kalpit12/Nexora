# Fixing Gemini API 404 Error

## The Problem
You're getting a 404 error because the model name might not be available with your API key, or the API needs to be enabled.

## Solution Steps

### Option 1: Enable Generative Language API (Recommended)

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Select or Create a Project**
3. **Enable the API**:
   - Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com
   - Click "Enable"
4. **Restart your server**

### Option 2: Get a New API Key

1. **Go to Google AI Studio**: https://makersuite.google.com/app/apikey
2. **Create a new API key** (make sure you're logged in with the same Google account)
3. **Update your `.env` file** with the new key
4. **Restart your server**

### Option 3: Check Model Availability

The code now tries multiple model names automatically:
- `gemini-pro` (standard model)
- `models/gemini-pro` (alternative format)

If both fail, check the server console for detailed error messages.

## Verify Your Setup

After making changes:
1. Restart your server: `npm start`
2. Check the console output - you should see "Successfully initialized model: ..."
3. Try sending a message in the chatbot
4. Check for any error messages in the server console

## Still Having Issues?

If you continue to get 404 errors:
- Verify your API key is correct
- Make sure you're using the latest version of `@google/generative-ai`
- Check Google's status page: https://status.cloud.google.com/

