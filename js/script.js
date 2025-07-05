// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Navigation Toggle for Mobile
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link, .nav-logo-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced Title Animation
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        // Add a subtle fade-in animation
        mainTitle.style.opacity = '0';
        mainTitle.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            mainTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            mainTitle.style.opacity = '1';
            mainTitle.style.transform = 'translateY(0)';
        }, 500);
    }

    // Navbar Background on Scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Scroll Animation for Elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all service cards and other animated elements
    const animatedElements = document.querySelectorAll('.service-card, .contact-method, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Counter Animation for Statistics
    function animateCounter(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const current = Math.floor(progress * (end - start) + start);
            
            if (element.textContent.includes('%')) {
                element.textContent = current + '%';
            } else if (element.textContent.includes('+')) {
                element.textContent = current + '+';
            } else {
                element.textContent = current;
            }
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Observe stats for counter animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const text = element.textContent;
                
                if (text.includes('50+')) {
                    animateCounter(element, 0, 50, 2000);
                } else if (text.includes('100%')) {
                    animateCounter(element, 0, 100, 2000);
                } else if (text.includes('24/7')) {
                    element.textContent = '24/7';
                }
                
                statsObserver.unobserve(element);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Contact Form Handling with EmailJS
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const service = formData.get('service');
            const message = formData.get('message');

            // Simple validation
            if (!name || !email || !service || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;

            try {
                // Try EmailJS first if configured
                if (typeof emailService !== 'undefined' && emailService.isConfigured()) {
                    const result = await emailService.sendEmail(formData);
                    if (result.success) {
                        showNotification('Thank you! Your message has been sent successfully. I\'ll get back to you soon!', 'success');
                        contactForm.reset();
                    } else {
                        throw new Error(result.message);
                    }
                } else {
                    // Fallback to mailto if EmailJS not configured
                    if (typeof emailService !== 'undefined') {
                        emailService.openMailtoFallback(formData);
                    } else {
                        // Direct mailto fallback
                        const subject = encodeURIComponent(`Contact Form: ${service}`);
                        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`);
                        window.open(`mailto:${EMAIL_CONFIG.RECIPIENT_EMAIL}?subject=${subject}&body=${body}`);
                    }
                    showNotification('Opening your email client. Please send the pre-filled message.', 'info');
                }
            } catch (error) {
                console.error('Email sending failed:', error);
                // Fallback: Open email client
                const subject = encodeURIComponent(`Contact Form: ${service}`);
                const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nService: ${service}\n\nMessage:\n${message}`);
                const recipient = typeof EMAIL_CONFIG !== 'undefined' ? EMAIL_CONFIG.RECIPIENT_EMAIL : 'salimuddinsaiyed5@gmail.com';
                window.open(`mailto:${recipient}?subject=${subject}&body=${body}`);
                showNotification('There was an issue sending your message. Opening your email client as backup.', 'error');
            } finally {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        // Set icon based on type
        let icon = '⚠';
        if (type === 'success') icon = '✓';
        else if (type === 'info') icon = 'ℹ';
        
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${icon}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Set background color based on type
        let backgroundColor = '#EF4444'; // default error red
        if (type === 'success') backgroundColor = '#10B981'; // green
        else if (type === 'info') backgroundColor = '#3B82F6'; // blue

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: ${backgroundColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;

        // Add to page
        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);

        // Close button functionality
        const closeButton = notification.querySelector('.notification-close');
        closeButton.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Service Card Hover Effects
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Parallax Effect for Hero Section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroGif = document.querySelector('.hero-gif');
        const profilePic = document.querySelector('.profile-pic');
        
        if (heroGif && scrolled < window.innerHeight) {
            heroGif.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        if (profilePic && scrolled < window.innerHeight) {
            profilePic.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });

    // Copy Code Functionality
    const redeemCode = document.querySelector('.code-value');
    if (redeemCode) {
        redeemCode.style.cursor = 'pointer';
        redeemCode.title = 'Click to copy';
        
        redeemCode.addEventListener('click', function() {
            const code = this.textContent;
            navigator.clipboard.writeText(code).then(() => {
                showNotification('Redeem code copied to clipboard!', 'success');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = code;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showNotification('Redeem code copied to clipboard!', 'success');
            });
        });
    }

    // Dynamic skill progress animation
    const skillItems = document.querySelectorAll('.skill-item');
    const skillsObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.transform = 'translateX(10px)';
                    entry.target.style.background = 'var(--primary-color)';
                    entry.target.style.color = 'white';
                    
                    setTimeout(() => {
                        entry.target.style.transform = 'translateX(0)';
                        entry.target.style.background = 'var(--bg-light)';
                        entry.target.style.color = 'var(--text-dark)';
                    }, 1000);
                }, index * 200);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(skill => {
        skillsObserver.observe(skill);
    });

    // Loading screen (optional)
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Performance optimization: Lazy loading for images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    // Check for saved dark mode preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update toggle text based on current theme
    if (currentTheme === 'dark') {
        darkModeToggle.textContent = 'Light Mode';
    } else {
        darkModeToggle.textContent = 'Dark Mode';
    }
    
    // Handle dark mode toggle
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update the theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle text
        this.textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        
        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        // Remove transition after animation completes
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });

    // WhatsApp Auto-Message Functionality
    const whatsappBtn = document.getElementById('whatsapp-contact');
    const whatsappNumber = '+919638603155'; // Hidden from UI
    const autoMessage = "Hello! My business needs AI automation NOW. I'm ready to invest in solutions that will streamline my operations and boost my bottom line. Can we talk about your services?";
    
    if (whatsappBtn) {
        // Remove any default title/tooltip attributes
        whatsappBtn.removeAttribute('title');
        whatsappBtn.removeAttribute('data-tooltip');
        
        whatsappBtn.addEventListener('click', function() {
            // Encode the message for URL
            const encodedMessage = encodeURIComponent(autoMessage);
            
            // Create WhatsApp URL with pre-filled message
            const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            // Open WhatsApp with the pre-filled message
            window.open(whatsappURL, '_blank');
            
            // Show notification that message is ready to send
            showNotification('WhatsApp opened with your message ready to send!', 'success');
        });
        
        // Add hover effect without showing any sensitive information
        whatsappBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 6px 25px rgba(37, 211, 102, 0.6)';
        });
        
        whatsappBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
        });
    }

    console.log('🚀 AI Automation Website Loaded Successfully!');
});

// Utility functions
const utils = {
    // Debounce function for performance
    debounce: function(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Throttle function for scroll events
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Format text for display
    formatText: function(text) {
        return text.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
};

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { utils };
}