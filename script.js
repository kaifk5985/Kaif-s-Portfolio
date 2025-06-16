// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeBtn = document.getElementById('theme-btn');
        this.init();
    }

    init() {
        // Set initial theme
        document.documentElement.setAttribute('data-theme', this.theme);
        
        // Add event listener
        this.themeBtn.addEventListener('click', () => this.toggleTheme());
        
        // Update button appearance
        this.updateThemeButton();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
        this.updateThemeButton();
    }

    updateThemeButton() {
        const sunIcon = this.themeBtn.querySelector('.sun-icon');
        const moonIcon = this.themeBtn.querySelector('.moon-icon');
        
        if (this.theme === 'dark') {
            sunIcon.style.opacity = '0.3';
            moonIcon.style.opacity = '1';
        } else {
            sunIcon.style.opacity = '1';
            moonIcon.style.opacity = '0.3';
        }
    }
}

// Navigation Management
class NavigationManager {
    constructor() {
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });
        
        // Active link highlighting
        this.updateActiveLink();
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
    }

    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                // Remove active class from all links
                this.navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current link
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
}

// Smooth Scrolling
class SmoothScrollManager {
    constructor() {
        this.init();
    }

    init() {
        // Add smooth scrolling to all anchor links
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Form Validation
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.init();
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const message = formData.get('message').trim();
        
        let isValid = true;
        
        // Validate name
        if (!this.validateName(name)) {
            isValid = false;
        }
        
        // Validate email
        if (!this.validateEmail(email)) {
            isValid = false;
        }
        
        // Validate message
        if (!this.validateMessage(message)) {
            isValid = false;
        }
        
        if (isValid) {
            this.submitForm(name, email, message);
        }
    }

    validateField(field) {
        const value = field.value.trim();
        
        switch (field.name) {
            case 'name':
                return this.validateName(value);
            case 'email':
                return this.validateEmail(value);
            case 'message':
                return this.validateMessage(value);
            default:
                return true;
        }
    }

    validateName(name) {
        const nameField = document.getElementById('name');
        const errorElement = document.getElementById('name-error');
        
        if (name.length < 2) {
            this.showError(nameField, errorElement, 'Name must be at least 2 characters long');
            return false;
        }
        
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            this.showError(nameField, errorElement, 'Name can only contain letters and spaces');
            return false;
        }
        
        this.clearError(nameField);
        return true;
    }

    validateEmail(email) {
        const emailField = document.getElementById('email');
        const errorElement = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError(emailField, errorElement, 'Email is required');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError(emailField, errorElement, 'Please enter a valid email address');
            return false;
        }
        
        this.clearError(emailField);
        return true;
    }

    validateMessage(message) {
        const messageField = document.getElementById('message');
        const errorElement = document.getElementById('message-error');
        
        if (message.length < 10) {
            this.showError(messageField, errorElement, 'Message must be at least 10 characters long');
            return false;
        }
        
        if (message.length > 1000) {
            this.showError(messageField, errorElement, 'Message must be less than 1000 characters');
            return false;
        }
        
        this.clearError(messageField);
        return true;
    }

    showError(field, errorElement, message) {
        field.parentElement.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    clearError(field) {
        field.parentElement.classList.remove('error');
        const errorElement = field.parentElement.querySelector('.error-message');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    submitForm(name, email, message) {
        // Simulate form submission
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            alert(`Thank you, ${name}! Your message has been sent successfully. I'll get back to you soon.`);
            this.form.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }
}

// Skills Animation
class SkillsAnimationManager {
    constructor() {
        this.skillsSection = document.querySelector('.skills');
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.animationTriggered = false;
        this.init();
    }

    init() {
        // Set up intersection observer for skills animation
        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            { threshold: 0.5 }
        );
        
        if (this.skillsSection) {
            observer.observe(this.skillsSection);
        }
        
        // Set the width data attribute for each skill bar
        this.skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.setProperty('--skill-width', width);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !this.animationTriggered) {
                this.animateSkills();
                this.animationTriggered = true;
            }
        });
    }

    animateSkills() {
        this.skillBars.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
            }, index * 100);
        });
    }
}

// Scroll Effects
class ScrollEffectsManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const scrollTop = window.pageYOffset;
        
        // Navbar background opacity based on scroll
        if (scrollTop > 50) {
            this.navbar.style.background = this.navbar.dataset.theme === 'dark' 
                ? 'rgba(15, 23, 42, 0.95)' 
                : 'rgba(255, 255, 255, 0.95)';
        } else {
            this.navbar.style.background = this.navbar.dataset.theme === 'dark'
                ? 'rgba(15, 23, 42, 0.9)'
                : 'rgba(255, 255, 255, 0.9)';
        }
    }
}

// Performance optimization - Lazy loading for images
class LazyLoadManager {
    constructor() {
        this.images = document.querySelectorAll('img[src]');
        this.init();
    }

    init() {
        // Use Intersection Observer for lazy loading if needed
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        this.images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all functionality
    new ThemeManager();
    new NavigationManager();
    new SmoothScrollManager();
    new ContactFormManager();
    new SkillsAnimationManager();
    new ScrollEffectsManager();
    new LazyLoadManager();

    // Add loading animation completion
    document.body.classList.add('loaded');
    
    // Console welcome message
    console.log('%c👋 Welcome to my portfolio!', 'color: #3b82f6; font-size: 16px; font-weight: bold;');
    console.log('%cFeel free to explore the code and reach out if you have any questions!', 'color: #64748b; font-size: 14px;');
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Page is hidden, pause any animations or intensive operations
        console.log('Page hidden - pausing animations');
    } else {
        // Page is visible again, resume operations
        console.log('Page visible - resuming animations');
    }
});

// Handle window resize for responsive adjustments
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate any position-dependent elements
        console.log('Window resized - recalculating layouts');
    }, 250);
});

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker would be registered here in a production app
        console.log('Service Worker support detected');
    });
}

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
});

// Add custom cursor effects (optional enhancement)
class CursorEffects {
    constructor() {
        this.init();
    }

    init() {
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .certification-card');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                document.body.style.cursor = 'pointer';
            });
            
            element.addEventListener('mouseleave', () => {
                document.body.style.cursor = 'auto';
            });
        });
    }
}

// Initialize cursor effects
new CursorEffects();
