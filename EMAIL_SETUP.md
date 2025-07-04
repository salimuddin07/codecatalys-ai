# Email Configuration Setup Guide

## EmailJS Setup Instructions

To make the contact form work with your email (salim@theautomagichub.com), follow these steps:

### Step 1: Create EmailJS Account
1. Go to https://www.emailjs.com/
2. Sign up with your email
3. Verify your email address

### Step 2: Add Email Service
1. Go to "Email Services" in your EmailJS dashboard
2. Click "Add New Service"
3. Choose "Gmail" (recommended)
4. Connect your Gmail account or use SMTP
5. Note down the Service ID (e.g., "service_abc123")

### Step 3: Create Email Template
1. Go to "Email Templates"
2. Click "Create New Template"
3. Use this template:

```
Subject: New Contact Form Submission - {{service_type}}

Hello,

You have received a new contact form submission:

Name: {{from_name}}
Email: {{from_email}}
Service: {{service_type}}

Message:
{{message}}

---
Reply directly to: {{reply_to}}
```

4. Note down the Template ID (e.g., "template_xyz789")

### Step 4: Get Public Key
1. Go to "Account" → "General"
2. Copy your Public Key (e.g., "user_abc123xyz")

### Step 5: Update JavaScript
Replace the placeholders in main.js:

```javascript
// Line 8: Replace with your Public Key
emailjs.init("YOUR_ACTUAL_PUBLIC_KEY");

// Line 24-25: Replace with your IDs
'service_gmail', // Replace with your Service ID
'template_contact', // Replace with your Template ID
```

### Step 6: Test
1. Fill out the contact form
2. Check your email (salim@theautomagichub.com)
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
3. Create form pointing to salim@theautomagichub.com
4. Replace the form action with Formspree endpoint

---
Note: Remember to replace the placeholder values with your actual EmailJS credentials!
