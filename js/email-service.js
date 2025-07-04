// EmailJS Integration - Modern Implementation
// This file provides a clean EmailJS integration with proper error handling

class EmailService {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    // Initialize EmailJS
    init() {
        if (typeof emailjs === 'undefined') {
            console.error('EmailJS library not loaded');
            return;
        }

        if (!EMAIL_CONFIG.PUBLIC_KEY || EMAIL_CONFIG.PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
            console.warn('EmailJS not configured. Please update config.js with your credentials.');
            return;
        }

        try {
            emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
            this.isInitialized = true;
            console.log('EmailJS initialized successfully');
        } catch (error) {
            console.error('Failed to initialize EmailJS:', error);
        }
    }

    // Send email using EmailJS
    async sendEmail(formData) {
        if (!this.isInitialized) {
            throw new Error('EmailJS not initialized');
        }

        const templateParams = {
            from_name: formData.get('name'),
            from_email: formData.get('email'),
            service_type: formData.get('service'),
            message: formData.get('message'),
            to_email: EMAIL_CONFIG.RECIPIENT_EMAIL,
            subject: EMAIL_CONFIG.SUBJECT_TEMPLATES[formData.get('service')] || 'New Contact Form Submission'
        };

        try {
            const response = await emailjs.send(
                EMAIL_CONFIG.SERVICE_ID,
                EMAIL_CONFIG.TEMPLATE_ID,
                templateParams
            );

            if (response.status === 200) {
                return { success: true, message: 'Email sent successfully' };
            } else {
                throw new Error('Email sending failed with status: ' + response.status);
            }
        } catch (error) {
            console.error('EmailJS error:', error);
            throw new Error('Failed to send email: ' + error.message);
        }
    }

    // Fallback method using mailto
    openMailtoFallback(formData) {
        const name = formData.get('name');
        const email = formData.get('email');
        const service = formData.get('service');
        const message = formData.get('message');

        const subject = encodeURIComponent(`Contact Form: ${service}`);
        const body = encodeURIComponent(
            `Name: ${name}\n` +
            `Email: ${email}\n` +
            `Service: ${service}\n\n` +
            `Message:\n${message}`
        );

        const mailtoUrl = `mailto:${EMAIL_CONFIG.RECIPIENT_EMAIL}?subject=${subject}&body=${body}`;
        window.open(mailtoUrl);
    }

    // Check if EmailJS is properly configured
    isConfigured() {
        return this.isInitialized && 
               EMAIL_CONFIG.PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
               EMAIL_CONFIG.SERVICE_ID !== 'YOUR_SERVICE_ID' &&
               EMAIL_CONFIG.TEMPLATE_ID !== 'YOUR_TEMPLATE_ID';
    }
}

// Create global instance
const emailService = new EmailService();
