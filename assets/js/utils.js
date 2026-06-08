// ===== UTILS.JS - HELPER FUNCTIONS & SHARED UTILITIES =====

/**
 * Throttle function to limit how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Debounce function to delay execution until after pause
 * @param {Function} func - Function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Get element by ID with error handling
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null if not found
 */
function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element with ID "${id}" not found`);
    }
    return element;
}

/**
 * Show a status message (for forms, etc.)
 * @param {string} elementId - Element ID to show message in
 * @param {string} message - Message text
 * @param {string} type - 'success' or 'error'
 */
function showStatusMessage(elementId, message, type) {
    const statusDiv = getElement(elementId);
    if (statusDiv) {
        statusDiv.className = `form-status ${type}`;
        statusDiv.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i> ${message}`;
        statusDiv.style.display = 'block';
        
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    } else {
        alert(message);
    }
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Create and show modal (generic)
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {string} iconClass - Icon class (e.g., 'fa-check-circle')
 * @param {string} iconColor - Icon color class
 */
function showModal(title, message, iconClass, iconColor) {
    // Check if modal already exists
    let modal = document.getElementById('genericModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'genericModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <button class="modal-close" id="genericModalClose"><i class="fas fa-times"></i></button>
                    <div class="modal-icon">
                        <i class="fas ${iconClass}" style="color: ${iconColor}"></i>
                    </div>
                    <h3 class="modal-title">${title}</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn" id="genericModalOk">Got It!</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add event listeners
        const closeBtn = document.getElementById('genericModalClose');
        const okBtn = document.getElementById('genericModalOk');
        
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        if (okBtn) okBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    } else {
        // Update existing modal content
        const icon = modal.querySelector('.modal-icon i');
        const titleEl = modal.querySelector('.modal-title');
        const bodyEl = modal.querySelector('.modal-body p');
        
        if (icon) icon.className = `fas ${iconClass}`;
        if (icon) icon.style.color = iconColor;
        if (titleEl) titleEl.textContent = title;
        if (bodyEl) bodyEl.textContent = message;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close modal by ID
 * @param {string} modalId - Modal element ID
 */
function closeModal(modalId) {
    const modal = getElement(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Update scroll progress bar
 */
function updateScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) return;
    
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrollTop = window.pageYOffset;
    const progress = (scrollTop / documentHeight) * 100;
    
    progressBar.style.width = progress + '%';
}

/**
 * Show/hide back to top button
 */
function updateBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (!backToTop) return;
    
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
}

/**
 * Initialize scroll progress bar
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    updateScrollProgress();
}

/**
 * Initialize back to top button
 */
function initBackToTop() {
    const backToTop = document.createElement('a');
    backToTop.href = '#';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    updateBackToTop();
}

/**
 * Set staggered transition delays for mobile nav items
 */
function setNavItemDelays() {
    const navItems = document.querySelectorAll('#navLinks .nav-link');
    navItems.forEach((item, index) => {
        item.style.setProperty('--i', index);
    });
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        throttle,
        debounce,
        getElement,
        showStatusMessage,
        isValidEmail,
        showModal,
        closeModal,
        updateScrollProgress,
        updateBackToTop,
        initScrollProgress,
        initBackToTop,
        setNavItemDelays
    };
}