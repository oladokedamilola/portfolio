// ===== FILTERS.JS - PORTFOLIO FILTER BAR =====

document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterButtons.length === 0 || projectCards.length === 0) {
        console.log('Filter bar not found on this page');
        return;
    }
    
    /**
     * Filter projects based on selected category
     * @param {string} category - Category to filter by ('all', 'backend', 'ai-ml', 'pwa', 'django', 'flask')
     */
    function filterProjects(category) {
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
            const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
            
            let shouldShow = false;
            
            switch(category) {
                case 'all':
                    shouldShow = true;
                    break;
                case 'backend':
                    shouldShow = techTags.some(tag => ['python', 'django', 'flask', 'fastapi', 'api'].includes(tag));
                    break;
                case 'ai-ml':
                    shouldShow = techTags.some(tag => ['tensorflow', 'scikit-learn', 'ai', 'ml', 'machine learning', 'openai'].includes(tag));
                    break;
                case 'pwa':
                    shouldShow = techTags.includes('pwa') || title.includes('pwa') || description.includes('progressive web app');
                    break;
                case 'django':
                    shouldShow = techTags.includes('django');
                    break;
                case 'flask':
                    shouldShow = techTags.includes('flask');
                    break;
                default:
                    shouldShow = true;
            }
            
            if (shouldShow) {
                card.style.display = '';
                visibleCount++;
                // Add animation class
                card.style.animation = 'slideInUp 0.4s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show/hide no results message
        updateNoResultsMessage(visibleCount);
    }
    
    /**
     * Show/hide "no results" message when filtering
     * @param {number} visibleCount - Number of visible projects
     */
    function updateNoResultsMessage(visibleCount) {
        let noResultsMsg = document.querySelector('.no-results-message');
        const projectsGrid = document.querySelector('.projects-grid');
        
        if (visibleCount === 0) {
            if (!noResultsMsg && projectsGrid) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message glass';
                noResultsMsg.style.cssText = 'text-align: center; padding: 3rem; grid-column: 1 / -1;';
                noResultsMsg.innerHTML = `
                    <i class="fas fa-filter" style="font-size: 2rem; color: var(--orange); margin-bottom: 1rem; display: block;"></i>
                    <h3>No projects match this filter</h3>
                    <p style="color: var(--gray-300); margin-top: 0.5rem;">Try selecting a different category</p>
                `;
                projectsGrid.appendChild(noResultsMsg);
            }
        } else {
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
        }
    }
    
    // Add click event to filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter category from data-filter attribute or text
            const category = this.getAttribute('data-filter') || this.textContent.toLowerCase().replace(/\s+/g, '-');
            filterProjects(category);
        });
    });
    
    // Initialize with 'all' filter active
    const activeFilter = document.querySelector('.filter-btn.active');
    if (activeFilter) {
        const category = activeFilter.getAttribute('data-filter') || 'all';
        filterProjects(category);
    } else if (filterButtons[0]) {
        filterButtons[0].classList.add('active');
        filterProjects('all');
    }
    
    console.log('Filters.js initialized');
});


// ===== COUNTER ANIMATION FOR STATS NUMBERS =====

document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.portfolio-stat-number, .stat-number');
    
    if (statNumbers.length === 0) return;
    
    // Store original text and target values
    const stats = [];
    
    statNumbers.forEach(stat => {
        const text = stat.textContent;
        const target = parseFloat(text);
        
        if (!isNaN(target)) {
            stats.push({
                element: stat,
                target: target,
                originalText: text,
                hasPlus: text.includes('+'),
                hasPercent: text.includes('%'),
                hasHours: text.includes('hrs'),
                isSuffix: text.includes('hrs') || text.includes('%'),
                animated: false
            });
            
            // Set initial value to 0
            stat.textContent = '0' + (stats[stats.length - 1].hasPlus ? '+' : '') + 
                              (stats[stats.length - 1].hasPercent ? '%' : '') +
                              (stats[stats.length - 1].hasHours ? 'hrs' : '');
        }
    });
    
    if (stats.length === 0) return;
    
    // Animation function
    function animateNumber(stat, start, end, duration = 1500) {
        const step = (end - start) / (duration / 16); // 60fps
        let current = start;
        const suffix = stat.hasPlus ? '+' : (stat.hasPercent ? '%' : (stat.hasHours ? 'hrs' : ''));
        const isSuffix = stat.hasHours || stat.hasPercent;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= end) {
                current = end;
                clearInterval(timer);
            }
            
            // Format number (remove decimals for integers)
            const displayValue = Math.floor(current);
            stat.element.textContent = displayValue + suffix;
        }, 16);
    }
    
    // Intersection Observer to trigger counting when section is visible
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElements = entry.target.querySelectorAll('.portfolio-stat-number, .stat-number');
                
                statElements.forEach(statEl => {
                    const stat = stats.find(s => s.element === statEl);
                    if (stat && !stat.animated) {
                        stat.animated = true;
                        animateNumber(stat, 0, stat.target, 1500);
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe the stats section container
    const statsSection = document.querySelector('.portfolio-stats-section, .stats-section');
    if (statsSection) {
        observer.observe(statsSection);
    }
    
    // Also check for individual stat items in case they're not in a section
    stats.forEach(stat => {
        if (!stat.animated && isElementInViewport(stat.element)) {
            stat.animated = true;
            animateNumber(stat, 0, stat.target, 1500);
        }
    });
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    console.log('Counter animation initialized');
});