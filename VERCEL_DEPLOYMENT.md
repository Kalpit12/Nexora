# Vercel Deployment Guide

## Environment Variables Setup

To deploy successfully on Vercel, you need to add the following environment variables in your Vercel project settings:

### Required Variables:

1. **GEMINI_API_KEY**
   - Your Google Gemini API key
   - Get it from: https://makersuite.google.com/app/apikey

### Optional Variables (for Email):

2. **EMAIL_HOST**
   - SMTP server host (e.g., `smtp.gmail.com`)

3. **EMAIL_PORT**
   - SMTP port (usually `587`)

4. **EMAIL_SECURE**
   - Set to `true` for port 465, `false` for other ports

5. **EMAIL_USER**
   - Your email address

6. **EMAIL_PASS**
   - Your email password or app password

7. **ADMIN_EMAIL**
   - Email address to receive lead notifications

## How to Add Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with its value
4. Make sure to add them for **Production**, **Preview**, and **Development** environments
5. Redeploy your application after adding variables

## Deployment Steps:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel will automatically detect the project
4. Add environment variables (see above)
5. Deploy!

## Important Notes:

- The API routes are now in the `/api` folder as serverless functions
- Static files (HTML, CSS, JS, images) are served directly
- The chatbot and lead magnet features require the environment variables to be set
- PDF generation happens in memory (no file system needed)

## Troubleshooting:

If you see a 500 error:
1. Check that all environment variables are set correctly
2. Verify the GEMINI_API_KEY is valid
3. Check Vercel function logs in the dashboard
4. Make sure all dependencies are in `package.json`

