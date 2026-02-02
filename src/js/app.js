
// Portfolio App - Optimized for Performance and Mobile Experience
(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        THEME_KEY: 'theme',
        SCROLL_THRESHOLD: 100,
        NAVBAR_OFFSET: 80,
        ANIMATION_DURATION: 300,
        DEBOUNCE_DELAY: 16, // ~60fps
        INTERSECTION_THRESHOLD: 0.1
    };

    // State management
    const state = {
        isMenuOpen: false,
        currentTheme: localStorage.getItem(CONFIG.THEME_KEY) || 'light',
        scrollPosition: 0,
        isScrolling: false
    };

    // Utility functions
    const utils = {
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        throttle(func, limit) {
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

        smoothScrollTo(element, offset = 0) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        },

        addClass(element, className) {
            if (element && !element.classList.contains(className)) {
                element.classList.add(className);
            }
        },

        removeClass(element, className) {
            if (element && element.classList.contains(className)) {
                element.classList.remove(className);
            }
        },

        toggleClass(element, className) {
            if (element) {
                element.classList.toggle(className);
            }
        }
    };

    // Theme management
    const themeManager = {
        init() {
            this.applyTheme(state.currentTheme);
            this.bindEvents();
        },

        applyTheme(theme) {
            const html = document.documentElement;
            const themeToggle = document.getElementById('theme-toggle');
            const themeToggleMobile = document.getElementById('theme-toggle-mobile');
            const themeIcon = themeToggle?.querySelector('i');
            const themeIconMobile = document.getElementById('theme-icon-mobile');
            const themeTextMobile = document.getElementById('theme-text-mobile');

            if (theme === 'dark') {
                utils.addClass(html, 'dark');
                if (themeIcon) {
                    themeIcon.className = 'fas fa-sun mr-2 theme-toggle-icon';
                }
                if (themeIconMobile) {
                    themeIconMobile.className = 'fas fa-sun mr-2 theme-toggle-icon';
                }
                if (themeTextMobile) {
                    themeTextMobile.textContent = 'Light Mode';
                }
            } else {
                utils.removeClass(html, 'dark');
                if (themeIcon) {
                    themeIcon.className = 'fas fa-moon mr-2 theme-toggle-icon';
                }
                if (themeIconMobile) {
                    themeIconMobile.className = 'fas fa-moon mr-2 theme-toggle-icon';
                }
                if (themeTextMobile) {
                    themeTextMobile.textContent = 'Dark Mode';
                }
            }

            state.currentTheme = theme;
            localStorage.setItem(CONFIG.THEME_KEY, theme);
        },

        toggle() {
            const newTheme = state.currentTheme === 'light' ? 'dark' : 'light';
            this.applyTheme(newTheme);
        },

        bindEvents() {
            const themeToggle = document.getElementById('theme-toggle');
            const themeToggleMobile = document.getElementById('theme-toggle-mobile');
            
            if (themeToggle) {
                themeToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            }
            
            if (themeToggleMobile) {
                themeToggleMobile.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            }
        }
    };

    // Mobile navigation
    const mobileNav = {
        init() {
            this.bindEvents();
        },

        toggle() {
            const mobileMenu = document.getElementById('mobile-menu');
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const hamburger = document.querySelector('.hamburger');
            
            state.isMenuOpen = !state.isMenuOpen;
            
            if (mobileMenu) {
                utils.toggleClass(mobileMenu, 'hidden');
                
                // Add show class for animation
                if (state.isMenuOpen) {
                    setTimeout(() => utils.addClass(mobileMenu, 'show'), 10);
                } else {
                    utils.removeClass(mobileMenu, 'show');
                }
                
                // Update aria-expanded for accessibility
                if (mobileMenuToggle) {
                    mobileMenuToggle.setAttribute('aria-expanded', state.isMenuOpen.toString());
                }
                
                // Prevent body scroll when menu is open (but allow bottom nav to remain functional)
                if (state.isMenuOpen) {
                    document.body.style.overflow = 'hidden';
                    utils.addClass(hamburger, 'active');
                } else {
                    document.body.style.overflow = '';
                    utils.removeClass(hamburger, 'active');
                }
            }
        },

        close() {
            if (state.isMenuOpen) {
                this.toggle();
            }
        },

        bindEvents() {
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (mobileMenuToggle) {
                mobileMenuToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });
            }

            // Close menu when clicking on links
            if (mobileMenu) {
                mobileMenu.addEventListener('click', (e) => {
                    if (e.target.tagName === 'A') {
                        this.close();
                    }
                });
            }

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (state.isMenuOpen && 
                    !mobileMenu?.contains(e.target) && 
                    !mobileMenuToggle?.contains(e.target)) {
                    this.close();
                }
            });

            // Close menu on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && state.isMenuOpen) {
                    this.close();
                }
            });
        }
    };

    // Scroll animations with Intersection Observer
    const scrollAnimations = {
        observer: null,

        init() {
            this.createObserver();
            this.observeElements();
        },

        createObserver() {
            const options = {
                threshold: CONFIG.INTERSECTION_THRESHOLD,
                rootMargin: '0px 0px -50px 0px'
            };

            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        utils.addClass(entry.target, 'visible');
                        this.observer.unobserve(entry.target);
                    }
                });
            }, options);
        },

        observeElements() {
            const elements = document.querySelectorAll('.section-fade');
            elements.forEach(element => {
                if (this.observer) {
                    this.observer.observe(element);
                }
            });
        }
    };

    // Navbar management (scroll behavior disabled to keep navbar always visible)
    const navbar = {
        topNavbar: null,
        mainNavbar: null,

        init() {
            this.topNavbar = document.querySelector('#top-navbar');
            this.mainNavbar = document.querySelector('nav');
            // No scroll event binding - navbar stays visible
        }
    };

    // Back to top button
    const backToTop = {
        button: null,

        init() {
            this.button = document.getElementById('back-to-top');
            if (this.button) {
                this.bindEvents();
            }
        },

        show() {
            if (this.button) {
                utils.removeClass(this.button, 'opacity-0');
                utils.removeClass(this.button, 'pointer-events-none');
            }
        },

        hide() {
            if (this.button) {
                utils.addClass(this.button, 'opacity-0');
                utils.addClass(this.button, 'pointer-events-none');
            }
        },

        handleScroll() {
            if (window.scrollY > CONFIG.SCROLL_THRESHOLD) {
                this.show();
            } else {
                this.hide();
            }
        },

        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },

        bindEvents() {
            const throttledScroll = utils.throttle(() => this.handleScroll(), CONFIG.DEBOUNCE_DELAY);
            window.addEventListener('scroll', throttledScroll, { passive: true });

            if (this.button) {
                this.button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.scrollToTop();
                });
            }
        }
    };

    // Smooth scrolling for anchor links
    const smoothScroll = {
        init() {
            this.bindEvents();
        },

        bindEvents() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href^="#"]');
                if (!link) return;

                const href = link.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    utils.smoothScrollTo(target, CONFIG.NAVBAR_OFFSET);
                    
                    // Close mobile menu if open
                    mobileNav.close();
                }
            });
        }
    };

    // Enhanced contact form handling
    const contactForm = {
        form: null,
        submitButton: null,

        init() {
            this.form = document.getElementById('contact-form');
            this.submitButton = this.form?.querySelector('button[type="submit"]');
            if (this.form) {
                this.bindEvents();
                this.initScheduleMeeting();
            }
        },

        showMessage(message, type = 'success') {
            const messageEl = document.getElementById('form-message');
            if (messageEl) {
                messageEl.innerHTML = message;
                messageEl.className = `mt-6 p-4 rounded-lg text-center ${
                    type === 'success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                }`;
                utils.removeClass(messageEl, 'hidden');

                // Auto-hide message after 8 seconds
                setTimeout(() => {
                    if (messageEl) {
                        utils.addClass(messageEl, 'hidden');
                    }
                }, 8000);
            }
        },

        validateForm(data) {
            const errors = [];

            // Required fields validation
            if (!data.name?.trim()) {
                errors.push('Full name is required');
            }

            if (!data.email?.trim()) {
                errors.push('Email address is required');
            } else {
                // Email validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    errors.push('Please enter a valid email address');
                }
            }

            if (!data['project-type']) {
                errors.push('Please select a project type');
            }

            if (!data.subject?.trim()) {
                errors.push('Subject is required');
            }

            if (!data.message?.trim()) {
                errors.push('Project details are required');
            } else if (data.message.trim().length < 20) {
                errors.push('Please provide more detailed project information (minimum 20 characters)');
            }

            // Phone validation (if provided)
            if (data.phone?.trim()) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
                    errors.push('Please enter a valid phone number');
                }
            }

            return errors;
        },

        setLoading(isLoading) {
            if (this.submitButton) {
                if (isLoading) {
                    this.submitButton.disabled = true;
                    this.submitButton.innerHTML = `
                        <span class="flex items-center justify-center">
                            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                        </span>
                    `;
                } else {
                    this.submitButton.disabled = false;
                    this.submitButton.innerHTML = `
                        <span class="flex items-center justify-center">
                            <i class="fas fa-paper-plane mr-2"></i>
                            Send Project Inquiry
                        </span>
                    `;
                }
            }
        },

        generateEmailBody(data) {
            const contactMethod = data['contact-method'] || 'email';
            const priority = data.priority || 'normal';
            const timeline = data.timeline || 'not specified';
            const budget = data.budget || 'not specified';

            return `
New Project Inquiry from ${data.name}

CONTACT INFORMATION:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone || 'Not provided'}
- Company: ${data.company || 'Not provided'}

PROJECT DETAILS:
- Type: ${data['project-type']}
- Subject: ${data.subject}
- Timeline: ${timeline}
- Budget Range: ${budget}
- Priority: ${priority}
- Preferred Contact: ${contactMethod}

PROJECT DESCRIPTION:
${data.message}

---
This inquiry was submitted through the portfolio contact form.
Response time commitment: Within 24 hours
            `.trim();
        },

        async handleSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData);

            // Validate form
            const errors = this.validateForm(data);
            if (errors.length > 0) {
                this.showMessage(`
                    <i class="fas fa-exclamation-triangle mr-2"></i>
                    Please fix the following errors:<br>
                    <ul class="mt-2 text-left list-disc list-inside">
                        ${errors.map(error => `<li>${error}</li>`).join('')}
                    </ul>
                `, 'error');
                return;
            }

            this.setLoading(true);

            try {
                // Simulate API call (replace with actual implementation)
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Generate email body for manual sending
                const emailBody = this.generateEmailBody(data);
                console.log('Project Inquiry Details:', emailBody);

                // Show success message
                this.showMessage(`
                    <i class="fas fa-check-circle mr-2"></i>
                    Thank you! Your project inquiry has been sent successfully. I'll get back to you within 24 hours.
                `);

                // Reset form
                this.form.reset();

                // Optional: Open email client with pre-filled data
                const subject = encodeURIComponent(`Project Inquiry: ${data.subject}`);
                const body = encodeURIComponent(emailBody);
                const mailtoLink = `mailto:apudeb2000@gmail.com?subject=${subject}&body=${body}`;
                
                // Uncomment to auto-open email client
                // window.open(mailtoLink);

            } catch (error) {
                console.error('Form submission error:', error);
                this.showMessage(`
                    <i class="fas fa-exclamation-circle mr-2"></i>
                    Sorry, there was an error sending your message. Please try again or contact me directly at apudeb2000@gmail.com.
                `, 'error');
            } finally {
                this.setLoading(false);
            }
        },

        initScheduleMeeting() {
            const scheduleMeetingBtn = document.getElementById('schedule-meeting');
            if (scheduleMeetingBtn) {
                scheduleMeetingBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleScheduleMeeting();
                });
            }
        },

        handleScheduleMeeting() {
            // Create a simple modal for scheduling
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
            modal.innerHTML = `
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-semibold">Schedule a Meeting</h3>
                        <button id="close-modal" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    
                    <div class="space-y-4">
                        <p class="text-gray-600 dark:text-gray-400">
                            I'd love to discuss your project! Choose your preferred way to schedule a meeting:
                        </p>
                        
                        <div class="space-y-3">
                            <a href="https://wa.me/8801725291718?text=Hi! I'd like to schedule a consultation meeting to discuss my project." 
                               target="_blank"
                               class="flex items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors">
                                <i class="fab fa-whatsapp text-green-600 dark:text-green-400 text-xl mr-3"></i>
                                <div>
                                    <div class="font-medium">WhatsApp</div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400">Quick scheduling via chat</div>
                                </div>
                            </a>
                            
                            <a href="mailto:apudeb2000@gmail.com?subject=Meeting Request&body=Hi Apu,%0D%0A%0D%0AI'd like to schedule a consultation meeting to discuss my project.%0D%0A%0D%0APreferred dates/times:%0D%0A- %0D%0A- %0D%0A%0D%0AProject type:%0D%0A%0D%0ABest regards" 
                               class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors">
                                <i class="fas fa-envelope text-blue-600 dark:text-blue-400 text-xl mr-3"></i>
                                <div>
                                    <div class="font-medium">Email</div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400">Detailed scheduling via email</div>
                                </div>
                            </a>
                            
                            <a href="tel:+8801725291718" 
                               class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors">
                                <i class="fas fa-phone text-purple-600 dark:text-purple-400 text-xl mr-3"></i>
                                <div>
                                    <div class="font-medium">Phone Call</div>
                                    <div class="text-sm text-gray-600 dark:text-gray-400">Direct call (9 AM - 6 PM GMT+6)</div>
                                </div>
                            </a>
                        </div>
                        
                        <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div class="text-sm text-gray-600 dark:text-gray-400">
                                <i class="fas fa-info-circle mr-2"></i>
                                <strong>Free 30-minute consultation</strong><br>
                                Available Monday-Friday, 9 AM - 6 PM (GMT+6)
                            </div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // Close modal functionality
            const closeModal = () => {
                document.body.removeChild(modal);
            };

            modal.querySelector('#close-modal').addEventListener('click', closeModal);
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });

            // Close on escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeModal();
                    document.removeEventListener('keydown', handleEscape);
                }
            };
            document.addEventListener('keydown', handleEscape);
        },

        bindEvents() {
            if (this.form) {
                this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            }
        }
    };

    // Resume download notification
    const resumeDownload = {
        init() {
            this.bindEvents();
        },

        showMessage() {
            // Show download message
            const message = document.createElement('div');
            message.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
            message.textContent = 'Resume download started!';
            document.body.appendChild(message);

            setTimeout(() => {
                message.remove();
            }, 3000);
        },

        bindEvents() {
            const downloadBtn = document.getElementById('download-resume');
            if (downloadBtn) {
                downloadBtn.addEventListener('click', () => {
                    this.showMessage();
                });
            }
        }
    };

    // Performance optimizations
    const performance = {
        init() {
            this.optimizeImages();
            this.preloadCriticalResources();
        },

        optimizeImages() {
            // Lazy load images that are not in viewport
            const images = document.querySelectorAll('img[data-src]');
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            }
        },

        preloadCriticalResources() {
            // Preload critical fonts and images
            const criticalResources = [
                { href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap', as: 'style' }
            ];

            criticalResources.forEach(resource => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.href = resource.href;
                link.as = resource.as;
                document.head.appendChild(link);
            });
        }
    };

    // Initialize app
    const app = {
        init() {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.start());
            } else {
                this.start();
            }
        },

        start() {
            try {
                // Initialize all modules
                themeManager.init();
                mobileNav.init();
                scrollAnimations.init();
                navbar.init();
                backToTop.init();
                smoothScroll.init();
                contactForm.init();
                resumeDownload.init();
                performance.init();

                console.log('Portfolio app initialized successfully');
            } catch (error) {
                console.error('Error initializing portfolio app:', error);
            }
        }
    };

    // Start the app
    app.init();

})();


    // Fire animation managers removed to eliminate fire emoji display



    // Mobile Bottom Navigation Manager
    const bottomNavigationManager = {
        bottomNav: null,
        navLinks: [],
        sections: [],
        
        init() {
            this.bottomNav = document.querySelector('.mobile-bottom-nav');
            if (!this.bottomNav) return;
            
            this.navLinks = Array.from(this.bottomNav.querySelectorAll('.bottom-nav-link'));
            this.sections = this.navLinks.map(link => {
                const href = link.getAttribute('href');
                if (href && href.startsWith('#')) {
                    if (href === '#hero') {
                        // For hero section, use the first section or body
                        return document.querySelector('section') || document.body;
                    }
                    return document.querySelector(href);
                }
                return null;
            }).filter(Boolean);
            
            this.bindEvents();
            this.setupIntersectionObserver();
        },
        
        bindEvents() {
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    // Handle external page links (blog, services)
                    if (href && !href.startsWith('#')) {
                        // Allow default navigation to external pages
                        return;
                    }
                    
                    // Handle internal navigation
                    e.preventDefault();
                    
                    if (href === '#hero') {
                        // Scroll to top for hero section
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        this.setActiveLink(link);
                    } else if (href && href.startsWith('#')) {
                        const targetSection = document.querySelector(href);
                        if (targetSection) {
                            this.scrollToSection(targetSection);
                            this.setActiveLink(link);
                        }
                    }
                });
            });
        },
        
        scrollToSection(section) {
            const offsetTop = section.offsetTop - CONFIG.NAVBAR_OFFSET;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        },
        
        setActiveLink(activeLink) {
            this.navLinks.forEach(link => {
                link.classList.remove('active');
            });
            activeLink.classList.add('active');
        },
        
        setupIntersectionObserver() {
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -70% 0px',
                threshold: 0
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        let correspondingLink;
                        
                        if (sectionId) {
                            correspondingLink = this.navLinks.find(link => 
                                link.getAttribute('href') === `#${sectionId}`
                            );
                        } else if (entry.target === document.querySelector('section')) {
                            // If it's the first section without id, treat as hero
                            correspondingLink = this.navLinks.find(link => 
                                link.getAttribute('href') === '#hero'
                            );
                        }
                        
                        if (correspondingLink) {
                            this.setActiveLink(correspondingLink);
                        }
                    }
                });
            }, observerOptions);
            
            this.sections.forEach(section => {
                if (section) {
                    observer.observe(section);
                }
            });
        }
    };
    
    // Initialize bottom navigation when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        bottomNavigationManager.init();
    });
