# Email Setup Guide for Lead Magnet

To enable email automation for the lead magnet feature, you need to configure email settings in your `.env` file.

## Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Step Verification** on your Gmail account
2. **Generate an App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "NEXORA Digital" as the name
   - Copy the generated 16-character password

3. **Add to `.env` file**:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
ADMIN_EMAIL=admin@nexoradigital.com
```

## Option 2: Other Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@outlook.com
EMAIL_PASS=your-password
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@yahoo.com
EMAIL_PASS=your-app-password
```

### Custom SMTP Server
```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=noreply@yourdomain.com
EMAIL_PASS=your-password
ADMIN_EMAIL=admin@yourdomain.com
```

## Testing

After setting up your email configuration:

1. Restart your server: `npm start`
2. Fill out the lead magnet form on your website
3. Check the email inbox for the PDF attachment
4. Check server logs for any errors

## Troubleshooting

- **"Email not configured" warning**: Make sure all EMAIL_* variables are set in `.env`
- **Authentication failed**: Double-check your email and password
- **Connection timeout**: Check your firewall/network settings
- **Gmail "Less secure app" error**: Use App Password instead of regular password

## Notes

- The PDF is generated on-demand when a lead submits the form
- Emails are sent with the PDF attached
- If email is not configured, leads are still captured (logged to console)
- Consider saving leads to a database for backup

