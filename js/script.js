// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // PWA Installation and Service Worker Registration
    initializePWA();
    
    // Professional Navigation Toggle for Mobile
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');

    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a navigation link
    const navAnchors = document.querySelectorAll('.nav-anchor, .brand-link');
    navAnchors.forEach(link => {
        link.addEventListener('click', function() {
            if (mainMenu) {
                mainMenu.classList.remove('active');
            }
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
        });
    });

    // Enhanced smooth scrolling for navigation links
    navAnchors.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active navigation state
                updateActiveNavigation(targetId);
            }
        });
    });

    // Update active navigation state
    function updateActiveNavigation(targetId) {
        navAnchors.forEach(anchor => {
            anchor.classList.remove('active');
            if (anchor.getAttribute('href') === targetId) {
                anchor.classList.add('active');
            }
        });
    }

    // Navigation scroll spy - highlight current section
    const sections = document.querySelectorAll('section[id]');
    
    function updateNavigationOnScroll() {
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos <= sectionTop + sectionHeight) {
                updateActiveNavigation(sectionId);
            }
        });
    }

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

    // Professional Navbar Scroll Effects
    const header = document.querySelector('.main-header');
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update navigation on scroll
        updateNavigationOnScroll();
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

    // Professional Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeLabel = themeToggle.querySelector('.theme-label');
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update toggle appearance based on current theme
    function updateThemeToggle(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun theme-icon';
            if (themeLabel) themeLabel.textContent = 'Light';
        } else {
            themeIcon.className = 'fas fa-moon theme-icon';
            if (themeLabel) themeLabel.textContent = 'Dark';
        }
    }
    
    // Initialize theme toggle appearance
    updateThemeToggle(currentTheme);
    
    // Handle theme toggle
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Update the theme
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update toggle appearance
        updateThemeToggle(newTheme);
        
        // Add smooth transition effect
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
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

// PWA Functions
let deferredPrompt; // Global variable for install prompt
let installPromptShown = false;

function initializePWA() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('🔧 ServiceWorker registered successfully:', registration.scope);
                    
                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                showUpdateAvailable();
                            }
                        });
                    });
                })
                .catch(error => {
                    console.log('❌ ServiceWorker registration failed:', error);
                });
        });
    }

    // PWA Install Prompt
    
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('💾 PWA Install prompt triggered');
        e.preventDefault();
        deferredPrompt = e;
        
        // Show the install button in the hero section
        showMobileInstallButton();
        
        // Don't show immediately on mobile, wait for user interaction
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                if (!installPromptShown) {
                    showMobileInstallBanner();
                }
            }, 3000);
        } else {
            showInstallPrompt();
        }
    });

    // Handle successful PWA installation
    window.addEventListener('appinstalled', (evt) => {
        console.log('📱 PWA was installed successfully');
        showNotification('CodeCatalyst AI app installed successfully!', 'success');
        hideInstallPrompt();
        hideMobileInstallBanner();
    });

    // Detect if app is running in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
        console.log('📱 Running in PWA mode');
        document.body.classList.add('pwa-mode');
        // Hide browser UI elements when in standalone mode
        addStandaloneStyles();
    } else {
        // Show install button for mobile users even if beforeinstallprompt hasn't fired yet
        setTimeout(() => {
            if (isMobileDevice() && !document.getElementById('mobile-install-btn').style.display) {
                showMobileInstallButton();
                // Also show a floating notification for mobile users
                showFloatingInstallNotification();
            }
        }, 2000);
    }
}

function showInstallPrompt() {
    // Create install button
    const installContainer = document.createElement('div');
    installContainer.id = 'pwa-install-container';
    installContainer.innerHTML = `
        <div class="pwa-install-prompt">
            <div class="pwa-install-content">
                <div class="pwa-install-icon">
                    <i class="fas fa-download"></i>
                </div>
                <div class="pwa-install-text">
                    <h3>Install CodeCatalyst AI</h3>
                    <p>Get quick access to our AI automation services</p>
                </div>
                <div class="pwa-install-actions">
                    <button id="pwa-install-btn" class="pwa-btn pwa-btn-primary">
                        <i class="fas fa-plus"></i> Install App
                    </button>
                    <button id="pwa-dismiss-btn" class="pwa-btn pwa-btn-secondary">
                        <i class="fas fa-times"></i> Later
                    </button>
                </div>
            </div>
        </div>
    `;

    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #pwa-install-container {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            z-index: 10000;
            pointer-events: none;
        }

        .pwa-install-prompt {
            background: linear-gradient(135deg, rgba(167, 164, 89, 0.98), rgba(52, 152, 219, 0.98));
            color: white;
            padding: 1rem;
            border-radius: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            transform: translateY(100px);
            transition: transform 0.3s ease;
            pointer-events: all;
            max-width: 400px;
            margin: 0 auto;
        }

        .pwa-install-prompt.show {
            transform: translateY(0);
        }

        .pwa-install-content {
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .pwa-install-icon {
            font-size: 2rem;
            color: rgba(255, 255, 255, 0.9);
        }

        .pwa-install-text h3 {
            margin: 0 0 0.25rem 0;
            font-size: 1.1rem;
            font-weight: 600;
        }

        .pwa-install-text p {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .pwa-install-actions {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            margin-left: auto;
        }

        .pwa-btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 8px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            white-space: nowrap;
        }

        .pwa-btn-primary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .pwa-btn-primary:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }

        .pwa-btn-secondary {
            background: transparent;
            color: rgba(255, 255, 255, 0.8);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .pwa-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 480px) {
            #pwa-install-container {
                left: 10px;
                right: 10px;
                bottom: 10px;
            }
            
            .pwa-install-content {
                flex-direction: column;
                text-align: center;
            }
            
            .pwa-install-actions {
                flex-direction: row;
                margin-left: 0;
                width: 100%;
            }
            
            .pwa-btn {
                flex: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to DOM
    document.body.appendChild(installContainer);

    // Trigger animation
    setTimeout(() => {
        installContainer.querySelector('.pwa-install-prompt').classList.add('show');
    }, 500);

    // Handle install button click
    document.getElementById('pwa-install-btn').addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('💾 User accepted PWA install');
                showNotification('Installing CodeCatalyst AI app...', 'info');
            } else {
                console.log('❌ User declined PWA install');
            }
            
            deferredPrompt = null;
            hideInstallPrompt();
        }
    });

    // Handle dismiss button click
    document.getElementById('pwa-dismiss-btn').addEventListener('click', () => {
        hideInstallPrompt();
        localStorage.setItem('pwa-install-dismissed', Date.now());
    });

    // Auto-hide after 10 seconds
    setTimeout(() => {
        if (document.getElementById('pwa-install-container')) {
            hideInstallPrompt();
        }
    }, 10000);
}

function hideInstallPrompt() {
    const container = document.getElementById('pwa-install-container');
    if (container) {
        const prompt = container.querySelector('.pwa-install-prompt');
        prompt.classList.remove('show');
        setTimeout(() => {
            container.remove();
        }, 300);
    }
}

// Mobile-specific install functions
function showMobileInstallBanner() {
    if (installPromptShown) return;
    installPromptShown = true;
    
    const banner = document.createElement('div');
    banner.id = 'mobile-install-banner';
    banner.innerHTML = `
        <div class="mobile-install-content">
            <div class="mobile-install-icon">📱</div>
            <div class="mobile-install-text">
                <strong>Install CodeCatalyst AI</strong>
                <span>Add to your home screen for better experience</span>
            </div>
            <div class="mobile-install-actions">
                <button id="mobile-install-btn" class="mobile-install-button">Install</button>
                <button id="mobile-dismiss-btn" class="mobile-dismiss-button">×</button>
            </div>
        </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        #mobile-install-banner {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #a7a459, #8b8746);
            color: white;
            padding: 15px;
            box-shadow: 0 -4px 20px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideUp 0.3s ease-out;
        }
        
        @keyframes slideUp {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        
        .mobile-install-content {
            display: flex;
            align-items: center;
            max-width: 400px;
            margin: 0 auto;
            gap: 12px;
        }
        
        .mobile-install-icon {
            font-size: 24px;
        }
        
        .mobile-install-text {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        .mobile-install-text strong {
            font-size: 16px;
            margin-bottom: 2px;
        }
        
        .mobile-install-text span {
            font-size: 12px;
            opacity: 0.9;
        }
        
        .mobile-install-actions {
            display: flex;
            gap: 8px;
        }
        
        .mobile-install-button {
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            cursor: pointer;
        }
        
        .mobile-dismiss-button {
            background: none;
            color: white;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(banner);
    
    // Handle install button
    document.getElementById('mobile-install-btn').onclick = () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted mobile install');
                }
                deferredPrompt = null;
                hideMobileInstallBanner();
            });
        } else {
            // Show manual instructions
            showMobileInstructions();
        }
    };
    
    // Handle dismiss button
    document.getElementById('mobile-dismiss-btn').onclick = () => {
        hideMobileInstallBanner();
        localStorage.setItem('mobile-install-dismissed', Date.now());
    };
    
    // Auto-hide after 15 seconds
    setTimeout(() => {
        hideMobileInstallBanner();
    }, 15000);
}

function hideMobileInstallBanner() {
    const banner = document.getElementById('mobile-install-banner');
    if (banner) {
        banner.style.animation = 'slideDown 0.3s ease-in forwards';
        setTimeout(() => banner.remove(), 300);
    }
}

function showMobileInstructions() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let instructions = '';
    if (isIOS) {
        instructions = `
            <h3>📱 Install on iPhone/iPad:</h3>
            <ol>
                <li>Tap the <strong>Share button</strong> (⬆️) at the bottom</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                <li>Tap <strong>"Add"</strong> to install</li>
            </ol>
        `;
    } else if (isAndroid) {
        instructions = `
            <h3>🤖 Install on Android:</h3>
            <ol>
                <li>Tap the <strong>menu (⋮)</strong> in your browser</li>
                <li>Look for <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong></li>
                <li>Tap <strong>"Install"</strong> or <strong>"Add"</strong></li>
            </ol>
        `;
    } else {
        instructions = `
            <h3>💻 Install Instructions:</h3>
            <p>Look for the install button in your browser's address bar or menu.</p>
        `;
    }
    
    showNotification(instructions, 'info', 8000);
}

function addStandaloneStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .pwa-mode {
            padding-top: env(safe-area-inset-top);
            padding-bottom: env(safe-area-inset-bottom);
        }
        
        .pwa-mode .navbar {
            padding-top: calc(1rem + env(safe-area-inset-top));
        }
    `;
    document.head.appendChild(style);
}

function showUpdateAvailable() {
    const updateNotification = document.createElement('div');
    updateNotification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            left: 20px;
            right: 20px;
            z-index: 10001;
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 400px;
            margin: 0 auto;
        ">
            <div>
                <strong>🔄 Update Available</strong>
                <br>
                <small>A new version of CodeCatalyst AI is ready</small>
            </div>
            <button id="update-btn" style="
                background: rgba(255, 255, 255, 0.2);
                color: white;
                border: 1px solid rgba(255, 255, 255, 0.3);
                padding: 0.5rem 1rem;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
            ">Update</button>
        </div>
    `;
    
    document.body.appendChild(updateNotification);
    
    document.getElementById('update-btn').addEventListener('click', () => {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
            window.location.reload();
        }
    });
}

// Mobile Install Button Functions
function showMobileInstallButton() {
    const installBtn = document.getElementById('mobile-install-btn');
    if (installBtn) {
        // Show button for mobile users regardless of deferredPrompt availability
        if (isMobileDevice() || deferredPrompt) {
            installBtn.style.display = 'inline-block';
            installBtn.onclick = handleMobileInstall;
            
            // Add extra visibility for mobile devices
            if (isMobileDevice()) {
                installBtn.style.animation = 'pulse 2s infinite';
                console.log('📱 Mobile install button shown');
            }
        }
    }
}

async function handleMobileInstall() {
    const installBtn = document.getElementById('mobile-install-btn');
    
    if (deferredPrompt) {
        // Change button text to show loading
        const originalText = installBtn.innerHTML;
        installBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Installing...';
        installBtn.disabled = true;
        
        try {
            // Show the install prompt
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            console.log(`💾 Install prompt result: ${outcome}`);
            
            if (outcome === 'accepted') {
                showNotification('🎉 CodeCatalyst AI app is being installed!', 'success');
                installBtn.style.display = 'none';
            } else {
                // Reset button if declined
                installBtn.innerHTML = originalText;
                installBtn.disabled = false;
                showInstallInstructions();
            }
            
            deferredPrompt = null;
        } catch (error) {
            console.error('❌ Install error:', error);
            installBtn.innerHTML = originalText;
            installBtn.disabled = false;
            showInstallInstructions();
        }
    } else {
        // Fallback for browsers that don't support beforeinstallprompt
        showInstallInstructions();
    }
}

function showInstallInstructions() {
    const userAgent = navigator.userAgent.toLowerCase();
    let instructions = '';
    
    if (userAgent.includes('android') && userAgent.includes('chrome')) {
        instructions = `
        📱 <strong>Android Chrome Instructions:</strong><br>
        1. Tap the menu (⋮) in the top right<br>
        2. Select "Add to Home screen"<br>
        3. Tap "Add" to install the app
        `;
    } else if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
        instructions = `
        📱 <strong>iOS Safari Instructions:</strong><br>
        1. Tap the share button (□↗)<br>
        2. Scroll down and tap "Add to Home Screen"<br>
        3. Tap "Add" to install the app
        `;
    } else {
        instructions = `
        💻 <strong>Desktop Instructions:</strong><br>
        1. Look for the install icon in your browser's address bar<br>
        2. Click it to install the app<br>
        3. Or check browser menu for "Install" option
        `;
    }
    
    showNotification(instructions, 'info', 8000);
}

function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function showFloatingInstallNotification() {
    // Don't show if already installed or dismissed
    if (localStorage.getItem('install-notification-dismissed') || 
        window.matchMedia('(display-mode: standalone)').matches) {
        return;
    }
    
    setTimeout(() => {
        const notification = document.createElement('div');
        notification.id = 'floating-install-notification';
        notification.innerHTML = `
            <div style="
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                padding: 15px 20px;
                border-radius: 25px;
                box-shadow: 0 4px 20px rgba(40, 167, 69, 0.3);
                z-index: 10000;
                font-weight: 500;
                animation: slideUp 0.5s ease;
                cursor: pointer;
                max-width: 90%;
                text-align: center;
            ">
                📱 Install this app on your home screen! 
                <button onclick="this.parentElement.parentElement.remove(); localStorage.setItem('install-notification-dismissed', Date.now());" 
                        style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 5px 10px; border-radius: 15px; margin-left: 10px; cursor: pointer;">
                    ✕
                </button>
            </div>
            <style>
                @keyframes slideUp {
                    from { transform: translate(-50%, 100px); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            </style>
        `;
        
        notification.onclick = (e) => {
            if (e.target.tagName !== 'BUTTON') {
                handleMobileInstall();
            }
        };
        
        document.body.appendChild(notification);
        
        // Auto-hide after 8 seconds
        setTimeout(() => {
            if (document.getElementById('floating-install-notification')) {
                notification.remove();
            }
        }, 8000);
    }, 3000);
}

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