# Email Configuration Setup Guide

## Quick Setup Instructions

Your project now has a modern, organized structure with proper EmailJS integration. Here's how to configure it:

### File Structure
```
📁 project/
├── index.html                    # Main HTML file
├── README.md                     # Project documentation
├── 📁 assets/                    # Additional assets (empty for now)
├── 📁 css/
│   └── style.css                 # Main stylesheet
├── 📁 docs/
│   └── EMAIL_SETUP.md           # This file
├── 📁 images/
│   ├── profile-photo.jpg        # Your professional photo
│   └── animated-logo.svg        # Logo animation
└── 📁 js/
    ├── config.js                # EmailJS configuration
    ├── email-service.js         # Email service handler
    ├── script.js                # Main JavaScript file
    └── contact-form-backup.js   # Backup email solution
```

### Step 1: Configure EmailJS
1. Go to https://www.emailjs.com/
2. Sign up with your email
3. Verify your email address

### Step 2: Add Email Service
1. Go to "Email Services" in your EmailJS dashboard
2. Click "Add New Service"
3. Choose "Gmail" (recommended)
4. Connect your Gmail account
5. Note down the Service ID (e.g., "service_abc123")

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```
Subject: New Contact Form - {{service_type}}

Hello Salim,

You have received a new contact form submission:

Name: {{from_name}}
Email: {{from_email}}
Service: {{service_type}}

Message:
{{message}}

---
Reply to: {{from_email}}
```

4. Note down the Template ID (e.g., "template_xyz789")

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your Public Key (e.g., "user_abc123xyz")

### Step 5: Update Configuration
Edit `js/config.js` and replace the placeholder values:

```javascript
const EMAIL_CONFIG = {
    PUBLIC_KEY: 'your_actual_public_key_here',
    SERVICE_ID: 'your_service_id_here',
    TEMPLATE_ID: 'your_template_id_here',
    // ... rest of config
};
```

### Step 6: Test
1. Fill out the contact form
2. Check your email (salimuddinsaiyed5@gmail.com)
3. Check EmailJS dashboard for delivery status

### Security Features
- ✅ Email address not exposed in client code
- ✅ Uses secure EmailJS API
- ✅ No backend server required
- ✅ Rate limiting built-in
- ✅ Spam protection

### Troubleshooting
- Check browser console for errors
- Verify all IDs are correct
- Check EmailJS dashboard for failed sends
- Ensure Gmail allows less secure apps (if using Gmail SMTP)

### Alternative: Formspree (Easier Setup)
If EmailJS seems complex, you can use Formspree:
1. Go to https://formspree.io/
2. Create account
3. Create form pointing to salimuddinsaiyed5@gmail.com
4. Replace the form action with Formspree endpoint

---
Note: Remember to replace the placeholder values with your actual EmailJS credentials!
