# EmailJS Setup Guide

## Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account

## Step 2: Create Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the authentication steps
5. Copy the **Service ID**

## Step 3: Create Email Template
1. Go to "Email Templates" in your dashboard
2. Click "Create New Template"
3. Design your email template with variables like:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{service_type}}` - Type of service requested
   - `{{message}}` - Message content
4. Copy the **Template ID**

## Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your **Public Key**

## Step 5: Update config.js
Replace the placeholder values in `js/config.js`:

```javascript
const EMAIL_CONFIG = {
    PUBLIC_KEY: 'your_actual_public_key_here',
    SERVICE_ID: 'your_service_id_here', 
    TEMPLATE_ID: 'your_template_id_here',
    RECIPIENT_EMAIL: 'salimuddinsaiyed5@gmail.com',
    // ... rest of config
};
```

## Step 6: Test Contact Form
1. Refresh your website
2. Fill out the contact form
3. Check if emails are being sent properly

## Troubleshooting
- Make sure all IDs are correct
- Check browser console for error messages
- Verify EmailJS service is active
- Test template in EmailJS dashboard first
