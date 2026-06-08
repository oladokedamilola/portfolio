// ===== MAIN.JS - CORE FUNCTIONALITY =====
// Navbar, scroll animations, smooth scrolling, page load

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVBAR SCROLL EFFECTS =====
    const navbar = document.getElementById('navbar');
    
    function updateNavbarScroll() {
        if (!navbar) return;
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', throttle(updateNavbarScroll, 50));
    updateNavbarScroll();
    
    // ===== ACTIVE NAVIGATION HIGHLIGHTING =====
    const sections = document.querySelectorAll('section[id]');
    
    function updateActiveNav() {
        const scrollPosition = window.pageYOffset + 100;
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}` || (href === 'home.html' && currentSection === 'home')) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveNav, 100));
    updateActiveNav();
    
    // ===== MOBILE NAVIGATION TOGGLE =====
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    function closeMobileMenu() {
        if (!navLinks || !menuToggle) return;
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.style.overflow = '';
        
        const backdrop = document.querySelector('.nav-backdrop');
        if (backdrop) backdrop.remove();
    }
    
    function openMobileMenu() {
        if (!navLinks || !menuToggle) return;
        navLinks.classList.add('active');
        menuToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        const backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.addEventListener('click', closeMobileMenu);
        document.body.appendChild(backdrop);
    }
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            if (navLinks.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
        
        // Close mobile menu when clicking a nav link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });
        
        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
        
        // Close on window resize (if switching to desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }
    
    // Set staggered delays for mobile nav items
    setNavItemDelays();
    
    // ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only smooth scroll for same-page anchors
            if (href && href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    const navbarHeight = navbar ? navbar.offsetHeight : 70;
                    const targetPosition = target.offsetTop - navbarHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, href);
                    closeMobileMenu();
                }
            }
        });
    });
    
    // ===== SCROLL ANIMATIONS WITH INTERSECTION OBSERVER =====
    const animatedElements = document.querySelectorAll(
        '.project-card, .service-card, .skill-card, .contact-card, .social-card, .tech-card, .section-scroll-animation'
    );
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                if (entry.target.style) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        if (el.classList && !el.classList.contains('animated')) {
            if (el.style) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(20px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
            observer.observe(el);
        }
    });
    
    // ===== PAGE LOAD FADE-IN =====
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
        document.body.classList.add('loaded');
    }, 100);
    
    // ===== SCROLL PROGRESS & BACK TO TOP =====
    initScrollProgress();
    initBackToTop();
    
    window.addEventListener('scroll', throttle(() => {
        updateScrollProgress();
        updateBackToTop();
    }, 50));
    
    // ===== RESIZE HANDLER =====
    let resizeTimeout;
    window.addEventListener('resize', debounce(() => {
        // Recalculate any layout-dependent values
        setNavItemDelays();
    }, 250));
    
    console.log('Main.js initialized');
});

// Helper for keyboard navigation (Home/End keys)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
});