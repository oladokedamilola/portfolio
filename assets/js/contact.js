// ===== CONTACT.JS - FORM HANDLING, EMAILJS, MODAL =====

// Wait for DOM and EmailJS to be ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize EmailJS with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init("YlhPUX71mc8jPQ1js");
        console.log('EmailJS initialized with public key');
    } else {
        console.error('EmailJS not loaded - check script order');
    }
    
    const contactForm = document.getElementById('contact-form');
    const successModal = document.getElementById('successModal');
    const modalClose = document.getElementById('modalClose');
    const modalOk = document.getElementById('modalOk');
    
    // ===== MODAL FUNCTIONS =====
    function showSuccessModal() {
        if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            alert('Thank you! Your message has been sent successfully. I\'ll get back to you within 24 hours.');
        }
    }
    
    function hideSuccessModal() {
        if (successModal) {
            successModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Modal event listeners
    if (modalClose) modalClose.addEventListener('click', hideSuccessModal);
    if (modalOk) modalOk.addEventListener('click', hideSuccessModal);
    
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) hideSuccessModal();
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal && successModal.classList.contains('active')) {
            hideSuccessModal();
        }
    });
    
    // ===== FORM SUBMISSION =====
if (contactForm) {
    console.log('Contact form found, attaching submit listener');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted!');
        
        // Get form values
        const firstName = document.getElementById('firstName')?.value || '';
        const lastName = document.getElementById('lastName')?.value || '';
        const email = document.getElementById('email')?.value || '';
        const phone = document.getElementById('phone')?.value || '';
        const company = document.getElementById('company')?.value || '';
        const projectType = document.getElementById('projectType')?.value || '';
        const budget = document.getElementById('budget')?.value || '';
        const timeline = document.getElementById('timeline')?.value || '';
        const message = document.getElementById('message')?.value || '';
        const newsletter = document.getElementById('newsletter')?.checked || false;
        
        console.log('Form data collected:', { firstName, lastName, email, projectType });
        
        // Validation
        if (!firstName.trim()) {
            console.log('Validation failed: first name missing');
            showStatusMessage('form-status', 'Please enter your first name', 'error');
            return;
        }
        if (!lastName.trim()) {
            console.log('Validation failed: last name missing');
            showStatusMessage('form-status', 'Please enter your last name', 'error');
            return;
        }
        if (!email.trim()) {
            console.log('Validation failed: email missing');
            showStatusMessage('form-status', 'Please enter your email address', 'error');
            return;
        }
        if (!isValidEmail(email)) {
            console.log('Validation failed: invalid email');
            showStatusMessage('form-status', 'Please enter a valid email address', 'error');
            return;
        }
        if (!message.trim()) {
            console.log('Validation failed: message missing');
            showStatusMessage('form-status', 'Please tell me about your project', 'error');
            return;
        }
        
        console.log('Validation passed!');
        
        // Prepare email data
        const templateParams = {
            from_name: `${firstName} ${lastName}`,
            from_email: email,
            phone: phone || 'Not provided',
            company: company || 'Not provided',
            project_type: projectType || 'Not specified',
            budget: budget || 'Not specified',
            timeline: timeline || 'Not specified',
            message: message,
            newsletter: newsletter ? 'Yes' : 'No',
            to_email: "oladokedamilola7@gmail.com",
            subject: `New Project Inquiry from ${firstName} ${lastName}`,
            reply_to: email,
            date: new Date().toLocaleString()
        };
        
        console.log('Template params prepared:', templateParams);
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        console.log('Calling emailjs.send...');
        
        // Send email via EmailJS
        emailjs.send("service_d2q1dpg", "template_wvgmzzd", templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showSuccessModal();
                contactForm.reset();
            })
            .catch(function(error) {
                console.error('FAILED:', error);
                let errorMsg = 'Sorry, there was an error sending your message. Please try again or contact me directly at oladokedamilola7@gmail.com';
                showStatusMessage('form-status', errorMsg, 'error');
            })
            .finally(function() {
                console.log('Email send attempt completed');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            });
    });
}
    
    // ===== FAQ ACCORDION =====
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                item.classList.toggle('active');
            });
        }
    });
    
    console.log('Contact.js initialized');
});

// Helper functions (if not in utils.js)
function showStatusMessage(elementId, message, type) {
    const statusDiv = document.getElementById(elementId);
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

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}