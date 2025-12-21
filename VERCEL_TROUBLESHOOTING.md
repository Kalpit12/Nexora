# Vercel 500 Error Troubleshooting Guide

## Most Common Cause: Missing Environment Variables

The 500 error is **most likely** because the `GEMINI_API_KEY` environment variable is not set in Vercel.

## Step-by-Step Fix:

### 1. Add Environment Variables in Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your project: **nexora-chi-liart**
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

#### Required:
```
GEMINI_API_KEY = AIzaSyD0GZp1HKUNtyebhV23BxrSS1b7sKdyr2c
```

#### Optional (for email features):
```
EMAIL_HOST = smtp.gmail.com
EMAIL_PORT = 587
EMAIL_SECURE = false
EMAIL_USER = kalpitpatel751@gmail.com
EMAIL_PASS = awiorywxflqqmioy
ADMIN_EMAIL = kalpitpatel751@gmail.com
```

5. **IMPORTANT**: Make sure to add them for all environments:
   - ✅ Production
   - ✅ Preview
   - ✅ Development

### 2. Redeploy After Adding Variables

After adding environment variables:
1. Go to **Deployments** tab
2. Click the **three dots (⋯)** on the latest deployment
3. Click **Redeploy**
4. Or wait for Vercel to auto-deploy from GitHub

### 3. Check Function Logs

If still getting errors:
1. Go to **Deployments** tab
2. Click on the failed deployment
3. Click on **Functions** tab
4. Click on the failed function (e.g., `/api/chat`)
5. Check the **Logs** section for specific error messages

## Common Error Messages:

### "Gemini API key not configured"
- **Fix**: Add `GEMINI_API_KEY` environment variable

### "Module not found" or "Cannot find module"
- **Fix**: All dependencies should be in `package.json` (they are ✅)

### "Function timeout"
- **Fix**: Already set to 30 seconds in `vercel.json`

### "Internal server error"
- **Fix**: Check function logs for specific error

## Test Your API Endpoints:

After deployment, test these URLs:

1. **Health Check**: `https://nexora-chi-liart.vercel.app/api`
2. **Chat API**: `https://nexora-chi-liart.vercel.app/api/chat` (POST)
3. **Contact API**: `https://nexora-chi-liart.vercel.app/api/contact` (POST)
4. **Projects API**: `https://nexora-chi-liart.vercel.app/api/projects` (GET)

## Quick Test Command:

You can test the API from command line:
```bash
curl https://nexora-chi-liart.vercel.app/api
```

Should return: `{"status":"ok","message":"API is working",...}`

## Still Having Issues?

1. Check Vercel function logs (most important!)
2. Verify environment variables are set correctly
3. Make sure you redeployed after adding variables
4. Check that the GitHub repository has the latest code
5. Try redeploying manually

## Files Changed:

- ✅ `vercel.json` - Simplified configuration
- ✅ `api/chat.js` - Fixed error handling
- ✅ `api/contact.js` - Added error handling
- ✅ `api/projects.js` - Added error handling
- ✅ `api/lead-magnet.js` - Fixed error handling
- ✅ `api/index.js` - Health check endpoint

All changes have been pushed to GitHub and should auto-deploy on Vercel.

