/**
 * Smart Village - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);
    handleNavbarScroll(); // Check on load

    // ============================================
    // MOBILE NAVIGATION
    // ============================================
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // ============================================
    // SCROLL ANIMATIONS
    // ============================================
    const fadeElements = document.querySelectorAll('.fade-in');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => {
        fadeObserver.observe(el);
    });

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // ANIMATED COUNTER
    // ============================================
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        const isDecimal = target.toString().includes('.');

        function updateCounter() {
            start += increment;
            if (start < target) {
                if (isDecimal) {
                    element.textContent = '$' + start.toFixed(2);
                } else {
                    element.textContent = Math.floor(start).toLocaleString();
                }
                requestAnimationFrame(updateCounter);
            } else {
                if (isDecimal) {
                    element.textContent = '$' + target.toFixed(2);
                } else {
                    element.textContent = target.toLocaleString();
                }
            }
        }

        updateCounter();
    }

    // Observe stat numbers and animate when visible
    const statNumbers = document.querySelectorAll('.hero-stat-number, .impact-stat-number, .cost-number');

    const statObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent.replace(/[,$]/g, '');
                const value = parseFloat(text);

                if (!isNaN(value) && !el.classList.contains('animated')) {
                    el.classList.add('animated');
                    animateCounter(el, value);
                }
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });

    // ============================================
    // CONTACT FORM HANDLING
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);

            // Basic validation
            if (!data.name || !data.email || !data.message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Simulate form submission (replace with actual API call)
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                alert('Thank you for your message! We will get back to you soon.');
                this.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // ============================================
    // ACTIVE NAV LINK HIGHLIGHTING
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinksForHighlight = document.querySelectorAll('.nav-link');

    function highlightNavLink() {
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinksForHighlight.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink);

    // ============================================
    // PARALLAX EFFECT FOR HERO
    // ============================================
    const heroBg = document.querySelector('.hero-bg');

    if (heroBg) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }

    // ============================================
    // PRELOADER (Optional)
    // ============================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait = 10) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
