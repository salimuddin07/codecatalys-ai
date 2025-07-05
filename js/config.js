// Configuration file for EmailJS
// Replace these values with your actual EmailJS credentials

const EMAIL_CONFIG = {
    // Get these from your EmailJS dashboard
    PUBLIC_KEY: 'YOUR_EMAILJS_PUBLIC_KEY',
    SERVICE_ID: 'YOUR_SERVICE_ID',
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID',
    
    // Email settings
    RECIPIENT_EMAIL: 'salimuddinsaiyed5@gmail.com',

    // Form settings
    TIMEOUT: 10000, // 10 seconds timeout
    
    // Default subject templates
    SUBJECT_TEMPLATES: {
        'ai-automation': 'AI Automation Inquiry',
        'web-development': 'Web Development Request',
        'chatbot-integration': 'Chatbot Integration Inquiry',
        'workflow-automation': 'Workflow Automation Request',
        'consultation': 'Consultation Request',
        'other': 'General Inquiry'
    }
};

// Initialize EmailJS with the public key
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAIL_CONFIG.PUBLIC_KEY);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EMAIL_CONFIG;
}
