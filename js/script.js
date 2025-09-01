/* ========================================
   CODECATALYST AI - ENHANCED PORTFOLIO
   Updated: 2025-08-29
   Version: v2025.08.29
======================================== */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all features
    initializePWA();
    initializeNavigation();
    initializeTheme();
    initializeAnimations();
    initializeContactForm();
    initializeProjectModals();
    initializeSkillBars();
    initializeCounters();
    initializeAccessibility();
    initializeWhatsApp();
    
    // Update current year in footer
    updateCurrentYear();
});

/* ========================================
   NAVIGATION SYSTEM
======================================== */

function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mainMenu = document.getElementById('mainMenu');
    const navAnchors = document.querySelectorAll('.nav-anchor, .brand-link');
    const header = document.querySelector('.main-header');

    // Mobile menu toggle
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            const isActive = mainMenu.classList.contains('active');
            
            mainMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', !isActive);
            
            // Trap focus in mobile menu when open
            if (!isActive) {
                trapFocus(mainMenu);
            }
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (mainMenu && !mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            mainMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Enhanced smooth scrolling for navigation links
    navAnchors.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active navigation state
                    updateActiveNavigation(targetId);
                    
                    // Close mobile menu
                    if (mainMenu) {
                        mainMenu.classList.remove('active');
                        menuToggle.classList.remove('active');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });

    // Navigation scroll spy and header effects
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                const scrollY = window.scrollY;
                
                // Header scroll effects
                if (scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Update active navigation
                updateNavigationOnScroll();
                
                // Reveal animations
                revealOnScroll();
                
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    function updateActiveNavigation(targetId) {
        navAnchors.forEach(anchor => {
            anchor.classList.remove('active');
            anchor.removeAttribute('aria-current');
            if (anchor.getAttribute('href') === targetId) {
                anchor.classList.add('active');
                anchor.setAttribute('aria-current', 'page');
            }
        });
    }

    function updateNavigationOnScroll() {
        const sections = document.querySelectorAll('section[id]');
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
}

/* ========================================
   THEME MANAGEMENT
======================================== */

function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    
    // Check if theme toggle button exists
    if (!themeToggle) {
        console.warn('Theme toggle button not found');
        return;
    }
    
    const themeIcon = themeToggle.querySelector('.theme-icon');
    const themeLabel = themeToggle.querySelector('.theme-label');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);
        
        // Add animation class
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    });
    
    function updateThemeButton(theme) {
        const isDark = theme === 'dark';
        
        // Safely update theme icon if it exists
        if (themeIcon) {
            themeIcon.className = isDark ? 'fas fa-sun theme-icon' : 'fas fa-moon theme-icon';
        }
        
        // Safely update theme label if it exists
        if (themeLabel) {
            themeLabel.textContent = isDark ? 'Light' : 'Dark';
        }
        
        // Update button aria attribute
        themeToggle.setAttribute('aria-pressed', isDark.toString());
    }
}

/* ========================================
   ANIMATIONS AND SCROLL EFFECTS
======================================== */

function initializeAnimations() {
    // Animate main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        // Add typing animation
        const text = mainTitle.textContent;
        mainTitle.textContent = '';
        mainTitle.style.opacity = '1';
        
        let index = 0;
        function typeWriter() {
            if (index < text.length) {
                mainTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing after a delay
        setTimeout(typeWriter, 500);
    }
    
    // Initialize intersection observer for reveal animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, observerOptions);
    
    // Observe elements for reveal animation
    const revealElements = document.querySelectorAll('.service-card, .project-card, .skill-category, .stat-item');
    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
        observer.observe(el);
    });
}

function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal:not(.revealed)');
    
    reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('revealed');
        }
    });
}

/* ========================================
   CONTACT FORM WITH VALIDATION
======================================== */

function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    const successMessage = document.getElementById('form-success');
    
    if (!form) return;
    
    const fields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        service: document.getElementById('service'),
        message: document.getElementById('message')
    };
    
    // Real-time validation
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName, field));
            field.addEventListener('input', () => clearFieldError(fieldName, field));
        }
    });
    
    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual implementation)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            successMessage.style.display = 'block';
            form.reset();
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    function validateForm() {
        let isValid = true;
        
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            if (field && !validateField(fieldName, field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    function validateField(fieldName, field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required field validation
        if (!value) {
            errorMessage = 'This field is required';
            isValid = false;
        } else {
            // Specific field validations
            switch (fieldName) {
                case 'name':
                    if (value.length < 2) {
                        errorMessage = 'Name must be at least 2 characters';
                        isValid = false;
                    }
                    break;
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(value)) {
                        errorMessage = 'Please enter a valid email address';
                        isValid = false;
                    }
                    break;
                    
                case 'message':
                    if (value.length < 10) {
                        errorMessage = 'Message must be at least 10 characters';
                        isValid = false;
                    }
                    break;
            }
        }
        
        showFieldError(fieldName, field, errorMessage, isValid);
        return isValid;
    }
    
    function showFieldError(fieldName, field, message, isValid) {
        const formGroup = field.closest('.form-group');
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (isValid) {
            formGroup.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        } else {
            formGroup.classList.add('error');
            if (errorElement) {
                errorElement.textContent = message;
                errorElement.classList.add('show');
            }
        }
    }
    
    function clearFieldError(fieldName, field) {
        const formGroup = field.closest('.form-group');
        const errorElement = document.getElementById(`${fieldName}-error`);
        
        if (formGroup.classList.contains('error') && field.value.trim()) {
            formGroup.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.classList.remove('show');
            }
        }
    }
}
// end initializeContactForm

/* ========================================
   ADDITIONAL INITIALIZERS (SAFE STUBS)
======================================== */

function initializeProjectModals() {
    // Open simple modal when clicking project view buttons
    const buttons = document.querySelectorAll('.project-view-btn');
    if (!buttons.length) return;

    function ensureModalStyles() {
        if (document.getElementById('project-modal-styles')) return;
        const style = document.createElement('style');
        style.id = 'project-modal-styles';
        style.textContent = `
            .project-modal-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.6);display:flex;align-items:center;justify-content:center;z-index:10000;opacity:0;transition:opacity .25s ease}
            .project-modal-backdrop.show{opacity:1}
            .project-modal{background:var(--card-bg, #111);color:var(--text, #fff);max-width:720px;width:92%;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.35);overflow:hidden;transform:translateY(20px);transition:transform .25s ease}
            .project-modal.show{transform:translateY(0)}
            .project-modal header{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid rgba(255,255,255,.08)}
            .project-modal .content{padding:16px 18px}
            .project-modal .close-btn{background:transparent;border:0;color:inherit;font-size:20px;cursor:pointer}
        `;
        document.head.appendChild(style);
    }

    function openModal(card) {
        ensureModalStyles();
        const modal = document.createElement('div');
        modal.className = 'project-modal-backdrop';
        modal.innerHTML = `
            <div class="project-modal">
                <header>
                    <strong>${card?.closest('.project-card')?.querySelector('h3')?.textContent || 'Project'}</strong>
                    <button class="close-btn" aria-label="Close">×</button>
                </header>
                <div class="content">
                    ${card?.closest('.project-card')?.querySelector('.project-content')?.innerHTML || 'Details coming soon.'}
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        requestAnimationFrame(() => modal.classList.add('show'));
        const panel = modal.querySelector('.project-modal');
        requestAnimationFrame(() => panel.classList.add('show'));
        function close() {
            modal.classList.remove('show');
            panel.classList.remove('show');
            setTimeout(() => modal.remove(), 250);
        }
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        modal.querySelector('.close-btn').addEventListener('click', close);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); }, { once: true });
    }

    buttons.forEach(btn => btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(btn);
    }));
}

function initializeSkillBars() {
    // Animate elements with [data-skill] percent value
    const bars = document.querySelectorAll('[data-skill]');
    if (!bars.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const pct = Math.min(100, Math.max(0, parseInt(el.getAttribute('data-skill'), 10) || 0));
            el.style.setProperty('--skill-pct', pct + '%');
            el.classList.add('skill-animate');
            io.unobserve(el);
        });
    }, { threshold: 0.3 });
    bars.forEach(b => io.observe(b));
}

function initializeCounters() {
    // Count up numbers in elements with [data-count]
    const nums = document.querySelectorAll('[data-count]');
    if (!nums.length) return;
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const end = parseInt(el.getAttribute('data-count'), 10) || 0;
            const dur = parseInt(el.getAttribute('data-duration'), 10) || 1500;
            const start = 0;
            let t0 = null;
            function step(t) {
                if (!t0) t0 = t;
                const p = Math.min(1, (t - t0) / dur);
                const cur = Math.floor(start + (end - start) * p);
                el.textContent = el.textContent.includes('%') ? cur + '%' : cur.toString();
                if (p < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
            io.unobserve(el);
        });
    }, { threshold: 0.4 });
    nums.forEach(n => io.observe(n));
}

function initializeAccessibility() {
    // Minimal enhancements: focus-visible polyfill-like class
    document.body.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') document.documentElement.classList.add('user-is-tabbing');
    }, { once: true });
}

function initializeWhatsApp() {
    const btn = document.getElementById('whatsapp-contact');
    if (!btn) return;
    const number = '+919638603155';
    const msg = "Hello! I'm interested in AI automation services.";
    btn.addEventListener('click', () => {
        const url = `https://wa.me/${number}?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    });
}

function updateCurrentYear() {
    const y = document.getElementById('currentYear');
    if (y) y.textContent = new Date().getFullYear();
}

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
    // 1) Scroll progress bar
    if (!document.getElementById('scroll-progress')) {
        const bar = document.createElement('div');
        bar.id = 'scroll-progress';
        bar.setAttribute('aria-hidden', 'true');
        Object.assign(bar.style, {
            position: 'fixed', top: '0', left: '0', height: '3px', width: '0%',
            background: 'linear-gradient(90deg, var(--primary-color), #20c997)', zIndex: '9999', transition: 'width .1s linear'
        });
        document.body.appendChild(bar);
        const onScroll = () => {
            const s = window.scrollY; const h = document.documentElement.scrollHeight - window.innerHeight;
            const p = h > 0 ? (s / h) * 100 : 0; bar.style.width = p + '%';
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // 2) Hero title typing effect (subtle)
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle && !mainTitle.dataset.typed) {
        mainTitle.dataset.typed = '1';
        const text = mainTitle.textContent.trim();
        mainTitle.textContent = '';
        let i = 0;
        (function type() {
            if (i <= text.length) {
                mainTitle.textContent = text.slice(0, i);
                i++;
                setTimeout(type, 35);
            }
        })();
    }

    // 3) Reveal on scroll with stagger
    const targets = document.querySelectorAll('.service-card, .project-card, .skill-category, .stat-item, .section-header');
    const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const t = entry.target;
            t.classList.add('scroll-reveal');
            const delay = parseFloat(t.getAttribute('data-delay') || 0);
            t.style.setProperty('--reveal-delay', `${delay}ms`);
            t.classList.add('revealed');
            io.unobserve(t);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach((el, idx) => { el.setAttribute('data-delay', (idx % 6) * 80); io.observe(el); });

    // 4) Card tilt on pointer move
    const tilts = document.querySelectorAll('.service-card, .project-card');
    tilts.forEach(card => {
        card.classList.add('tiltable');
        let raf = null;
        function onMove(e) {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            const rotX = (y * -8).toFixed(2);
            const rotY = (x * 8).toFixed(2);
            if (!raf) raf = requestAnimationFrame(() => {
                card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-2px)`;
                raf = null;
            });
        }
        function reset() { card.style.transform = ''; }
        card.addEventListener('pointermove', onMove);
        card.addEventListener('pointerleave', reset);
    });

    // 5) Parallax on hero image/profile
    const heroImg = document.querySelector('.profile-pic');
    if (heroImg) {
        const parallax = (e) => {
            const sc = window.scrollY; if (sc < window.innerHeight) {
                heroImg.style.transform = `translateY(${sc * 0.12}px)`;
            }
        };
        window.addEventListener('scroll', parallax, { passive: true });
        parallax();
    }
}

// Add safe-area styles while in PWA standalone mode
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

// Global helpers used across modules
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'info', ttlMs = 5000) {
    // Remove existing
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    const icons = { success: '✓', info: 'ℹ', error: '⚠' };
    const icon = icons[type] || 'ℹ';
    notification.innerHTML = `
        <div class="notification-content" style="display:flex;align-items:center;gap:.5rem;">
            <span class="notification-icon">${icon}</span>
            <span class="notification-message"></span>
            <button class="notification-close" aria-label="Close">&times;</button>
        </div>
    `;
    notification.querySelector('.notification-message').innerHTML = message;

    // Basic styles
    const bg = type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6';
    Object.assign(notification.style, {
        position: 'fixed', top: '20px', right: '20px', zIndex: '10000', color: '#fff',
        padding: '1rem 1.25rem', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,.15)',
        transform: 'translateX(400px)', transition: 'transform .3s ease', maxWidth: '420px', background: bg
    });

    document.body.appendChild(notification);
    requestAnimationFrame(() => { notification.style.transform = 'translateX(0)'; });
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, ttlMs);
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