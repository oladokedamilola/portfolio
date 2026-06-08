// ===== GALLERY.JS - PORTFOLIO GALLERY & LIGHTBOX =====

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== GALLERY MODAL FUNCTIONS =====
    window.openGallery = function(galleryId) {
        console.log('Opening gallery:', galleryId);
        
        const gallery = document.getElementById(galleryId);
        if (gallery) {
            gallery.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Gallery opened successfully');
        } else {
            console.error('Gallery not found:', galleryId);
        }
    };
    
    window.closeGallery = function() {
        const galleries = document.querySelectorAll('.gallery-modal');
        galleries.forEach(gallery => {
            gallery.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
        closeLightbox(); // Also close lightbox if open
    };
    
    // Close gallery when clicking outside content
    document.addEventListener('click', (e) => {
        if (e.target.classList && e.target.classList.contains('gallery-modal')) {
            closeGallery();
        }
    });
    
    // ===== LIGHTBOX FUNCTIONALITY =====
    let currentLightboxIndex = 0;
    let currentLightboxImages = [];
    let isAnimating = false;
    
    window.openLightbox = function(imageElement, title, description) {
        if (isAnimating) return;
        
        const lightbox = document.getElementById('lightbox-modal');
        if (!lightbox) {
            console.error('Lightbox modal not found');
            return;
        }
        
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDescription = document.getElementById('lightbox-description');
        
        if (!lightboxImage || !lightboxTitle || !lightboxDescription) return;
        
        // Set lightbox content
        lightboxImage.src = imageElement.src;
        lightboxImage.alt = imageElement.alt;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        
        // Find all images in the current gallery
        const gallery = imageElement.closest('.gallery-modal');
        if (gallery) {
            currentLightboxImages = Array.from(gallery.querySelectorAll('.gallery-image'));
            currentLightboxIndex = currentLightboxImages.indexOf(imageElement);
            console.log('Found', currentLightboxImages.length, 'images in gallery');
        }
        
        // Open lightbox
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        updateLightboxNav();
        updateLightboxCounter();
    };
    
    window.closeLightbox = function() {
        if (isAnimating) return;
        
        const lightbox = document.getElementById('lightbox-modal');
        if (lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = 'auto';
            currentLightboxImages = [];
            currentLightboxIndex = 0;
        }
    };
    
    window.navigateLightbox = function(direction) {
        if (isAnimating || currentLightboxImages.length === 0) return;
        
        isAnimating = true;
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxDescription = document.getElementById('lightbox-description');
        
        if (!lightboxImage || !lightboxTitle || !lightboxDescription) {
            isAnimating = false;
            return;
        }
        
        // Fade out
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            // Calculate new index
            currentLightboxIndex += direction;
            
            if (currentLightboxIndex < 0) {
                currentLightboxIndex = currentLightboxImages.length - 1;
            } else if (currentLightboxIndex >= currentLightboxImages.length) {
                currentLightboxIndex = 0;
            }
            
            const imageElement = currentLightboxImages[currentLightboxIndex];
            const galleryItem = imageElement.closest('.gallery-item');
            const title = galleryItem?.querySelector('.gallery-item-title')?.textContent || '';
            const description = galleryItem?.querySelector('.gallery-item-description')?.textContent || '';
            
            // Update lightbox content
            lightboxImage.src = imageElement.src;
            lightboxImage.alt = imageElement.alt;
            lightboxTitle.textContent = title;
            lightboxDescription.textContent = description;
            
            // Fade in
            lightboxImage.style.opacity = '1';
            
            setTimeout(() => {
                isAnimating = false;
            }, 100);
            
            updateLightboxCounter();
        }, 150);
    };
    
    function updateLightboxNav() {
        const prevBtn = document.querySelector('.lightbox-prev');
        const nextBtn = document.querySelector('.lightbox-next');
        
        if (!prevBtn || !nextBtn) return;
        
        if (currentLightboxImages.length <= 1) {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        }
    }
    
    function updateLightboxCounter() {
        let counter = document.querySelector('.lightbox-counter');
        if (!counter) {
            const lightboxContent = document.querySelector('.lightbox-content');
            if (lightboxContent) {
                counter = document.createElement('div');
                counter.className = 'lightbox-counter';
                lightboxContent.appendChild(counter);
            }
        }
        if (counter && currentLightboxImages.length > 0) {
            counter.textContent = `${currentLightboxIndex + 1} / ${currentLightboxImages.length}`;
        }
    }
    
    // Add click event to all gallery images (delegation for dynamically loaded images)
    document.body.addEventListener('click', function(e) {
        const galleryImage = e.target.closest('.gallery-image');
        if (galleryImage) {
            e.preventDefault();
            const galleryItem = galleryImage.closest('.gallery-item');
            const title = galleryItem?.querySelector('.gallery-item-title')?.textContent || '';
            const description = galleryItem?.querySelector('.gallery-item-description')?.textContent || '';
            openLightbox(galleryImage, title, description);
        }
    });
    
    // Make gallery images keyboard accessible (delegation)
    document.body.addEventListener('keydown', function(e) {
        const galleryImage = e.target.closest('.gallery-image');
        if (galleryImage && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            const galleryItem = galleryImage.closest('.gallery-item');
            const title = galleryItem?.querySelector('.gallery-item-title')?.textContent || '';
            const description = galleryItem?.querySelector('.gallery-item-description')?.textContent || '';
            openLightbox(galleryImage, title, description);
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeGallery();
            closeLightbox();
        }
        
        // Keyboard navigation for lightbox
        const lightbox = document.getElementById('lightbox-modal');
        if (lightbox && lightbox.classList.contains('active') && !isAnimating && currentLightboxImages.length > 1) {
            if (e.key === 'ArrowLeft') {
                navigateLightbox(-1);
            } else if (e.key === 'ArrowRight') {
                navigateLightbox(1);
            }
        }
    });
    
    console.log('Gallery.js initialized');
});