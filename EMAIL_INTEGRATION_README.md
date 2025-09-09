# Email Integration Setup Guide

## Overview
This guide explains how to set up SMTP email functionality for the Contact Us form using Gmail and Next.js API routes.

## Prerequisites
- Gmail account with 2-factor authentication enabled
- Gmail App Password generated
- Next.js application with API routes support

## Setup Steps

### 1. Gmail App Password Setup
1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. At the bottom, click "App passwords"
4. Select "Mail" and "Other (Custom name)"
5. Enter "Aspire Property Management" as the name
6. Copy the generated 16-character password (e.g., `dbko ucnd nlut nkbu`)

### 2. Environment Variables
Create a `.env.local` file in your project root:

```env
# Email Configuration
SMTP_USER=princekumarshah12@gmail.com
SMTP_PASS=dbko ucnd nlut nkbu
SMTP_FROM=princekumarshah12@gmail.com
SMTP_TO=princekumarshah12@gmail.com

# App Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Dependencies Installed
```bash
npm install nodemailer @types/nodemailer
```

### 4. Files Created/Modified

#### API Route: `src/app/api/contact/route.ts`
- Handles POST requests from the contact form
- Sends emails using nodemailer with Gmail SMTP
- Sends both notification email to admin and confirmation email to user
- Includes proper error handling and validation

#### Contact Page: `src/app/contact/page.tsx`
- Updated to integrate with the API route
- Sends form data via fetch to `/api/contact`
- Handles success/error states properly

## Features

### Email Notifications
1. **Admin Notification Email**: Sent to `princekumarshah12@gmail.com`
   - Contains all form data in a professional HTML format
   - Includes user's email as reply-to address
   - Subject line includes the form subject

2. **User Confirmation Email**: Sent to the user's email
   - Professional thank you message
   - Includes their message details
   - Links to property listings and services
   - Automated response notice

### Form Validation
- Client-side validation for required fields
- Server-side validation in API route
- Proper error handling and user feedback

### Security
- Environment variables for sensitive data
- Input validation and sanitization
- Rate limiting considerations (can be added)

## Testing

### Test the Email Functionality
Run the test script:
```bash
node test-email.js
```

### Test the Contact Form
1. Start the development server: `npm run dev`
2. Navigate to `/contact`
3. Fill out and submit the form
4. Check both your email and the user's email for notifications

## Troubleshooting

### Common Issues

1. **"Invalid login" error**
   - Verify the app password is correct
   - Ensure 2-factor authentication is enabled
   - Check that the email address is correct

2. **"Connection timeout" error**
   - Check your internet connection
   - Verify Gmail SMTP settings
   - Try using a different network

3. **"Rate limit exceeded" error**
   - Gmail has daily sending limits
   - Consider implementing rate limiting
   - Use a different email service for high volume

### Debug Mode
Add console.log statements in the API route to debug:
```javascript
console.log('SMTP Config:', {
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS ? '***' : 'Not set'
});
```

## Production Considerations

1. **Environment Variables**: Use your hosting platform's environment variable settings
2. **Rate Limiting**: Implement rate limiting to prevent abuse
3. **Email Templates**: Consider using a template engine for better email formatting
4. **Monitoring**: Add logging and monitoring for email delivery
5. **Backup Email Service**: Consider having a backup email service provider

## Email Templates

The current implementation includes:
- Professional HTML email templates
- Responsive design for mobile devices
- Branded styling with orange theme
- Clear call-to-action buttons
- Proper email headers and metadata

## Support

For issues with this implementation:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Test the SMTP connection using the test script
4. Check Gmail's security settings and app passwords

## Security Notes

- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Consider implementing CAPTCHA for spam protection
- Monitor for unusual email sending patterns
- Regularly rotate app passwords
