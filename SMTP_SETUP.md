# SMTP Email Setup Guide

This guide will help you configure SMTP email functionality for the enquiry form.

## Gmail Setup (Recommended)

### 1. Enable 2-Factor Authentication
- Go to your Google Account settings
- Navigate to Security → 2-Step Verification
- Enable 2-Factor Authentication

### 2. Generate App Password
- Go to Security → App passwords
- Select "Mail" and "Other (custom name)"
- Enter "NewAspireProp Enquiry Form"
- Copy the generated 16-character password

### 3. Environment Variables
Add these variables to your `.env.local` file:

```env
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_app_password
ADMIN_EMAIL=admin@newaspireprop.com
```

## Alternative SMTP Providers

### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
```

### Yahoo Mail
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@yahoo.com
SMTP_PASS=your_app_password
```

### Custom SMTP Server
```env
SMTP_HOST=your_smtp_server.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_username
SMTP_PASS=your_password
```

## Testing the Configuration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the home page
3. Scroll down to the enquiry form (below rental properties)
4. Fill out and submit the form
5. Check your email for confirmation

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Verify your email and password are correct
   - For Gmail, ensure you're using an App Password, not your regular password
   - Check if 2FA is enabled

2. **Connection Timeout**
   - Verify SMTP_HOST and SMTP_PORT are correct
   - Check firewall settings
   - Try different ports (465 for SSL, 587 for TLS)

3. **Emails Not Received**
   - Check spam/junk folder
   - Verify ADMIN_EMAIL is correct
   - Check SMTP server logs

### Testing SMTP Connection

You can test your SMTP configuration by creating a simple test script:

```javascript
// test-smtp.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log('SMTP Error:', error);
  } else {
    console.log('SMTP Server is ready to take our messages');
  }
});
```

Run with: `node test-smtp.js`

## Security Notes

- Never commit your `.env.local` file to version control
- Use App Passwords instead of regular passwords
- Consider using environment-specific SMTP configurations
- Regularly rotate your SMTP credentials
