// ===== Main JavaScript for The Cafe Website =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== Active Page Highlight  =====
    function highlightActivePage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        const isInPagesFolder = currentPath.includes('/pages/');
        
        const navLinks = document.querySelectorAll('.nav-link, .nav-menu a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (!linkHref) return;
            
            // Remove existing active classes
            link.classList.remove('active');
            
            // Skip dropdown toggles and anchors
            if (linkHref === '#' || linkHref.startsWith('#')) return;
            
            // Normalize paths for comparison
            let normalizedLink = linkHref;
            let normalizedCurrent = currentPage;
            
            // Handle paths from root (index.html)
            if (!isInPagesFolder) {
                // Convert ./pages/page.html to page.html for comparison
                if (normalizedLink.startsWith('./pages/')) {
                    normalizedLink = normalizedLink.replace('./pages/', '');
                } else if (normalizedLink.startsWith('pages/')) {
                    normalizedLink = normalizedLink.replace('pages/', '');
                }
                // Handle ./index.html
                if (normalizedLink === './index.html') {
                    normalizedLink = 'index.html';
                }
            } 
            // Handle paths from /pages/ folder
            else {
                // Convert ../index.html to index.html for comparison
                if (normalizedLink === '../index.html') {
                    normalizedLink = 'index.html';
                }
                // Keep ./page.html as page.html
                else if (normalizedLink.startsWith('./')) {
                    normalizedLink = normalizedLink.replace('./', '');
                }
            }
            
            // Remove leading slashes for comparison
            normalizedLink = normalizedLink.replace(/^\/+/, '');
            normalizedCurrent = normalizedCurrent.replace(/^\/+/, '');
            
            // Check for match
            let isMatch = false;
            
            if (normalizedLink === normalizedCurrent) {
                isMatch = true;
            }
            // Handle index.html variations
            else if ((normalizedCurrent === '' || normalizedCurrent === 'index.html') && 
                     (normalizedLink === 'index.html' || normalizedLink === './index.html' || normalizedLink === '../index.html')) {
                isMatch = true;
            }
            
            if (isMatch) {
                link.classList.add('active');
                
                // If this is a dropdown item, also highlight parent
                const dropdown = link.closest('.dropdown');
                if (dropdown) {
                    const parentLink = dropdown.querySelector('.nav-link:not(.dropdown-link)');
                    if (parentLink) {
                        parentLink.classList.add('active');
                    }
                }
            }
        });
    }

    // Call on load
    highlightActivePage();

    // ===== Mobile Menu Toggle =====
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle mobile menu
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Add overlay effect
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Update active highlight after navigation
            setTimeout(highlightActivePage, 100);
        });
    });

    // ===== Dropdown Menu Toggle for Mobile =====
    navItems.forEach(item => {
        const chevron = item.querySelector('.fa-chevron-down, .dropdown-toggle');
        const dropdown = item.querySelector('.dropdown');
        
        if (chevron && dropdown) {
            // Click event for chevron on mobile
            chevron.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Only toggle on mobile (when hamburger menu is visible)
                if (window.innerWidth <= 920) {
                    item.classList.toggle('active');
                    
                    // Close other dropdowns
                    navItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                }
            });
        }
    });

    // ===== Smooth Scroll for Anchor Links =====
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                }
            }
        });
    });

    // ===== Active Navigation Link on Scroll =====
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            const navLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });
                
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);

    // ===== Cart Functionality =====
    const cartIcon = document.querySelector('.fa-shopping-cart');
    const cartCountBadge = document.querySelector('.cart-count');

    if (cartIcon) {
        // Update cart count from localStorage
        function updateCartCount() {
            if (cartCountBadge) {
                const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                cartCountBadge.textContent = totalItems;
                cartCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
            }
        }
        
        // Initial update
        updateCartCount();
        
        // Listen for cart updates
        window.addEventListener('storage', updateCartCount);
        window.addEventListener('cartUpdated', updateCartCount);

        cartIcon.parentElement.addEventListener('click', function(e) {
            // Allow default navigation to cart page
            // Don't prevent default - let the link work normally
            updateCartCount();
        });
    }

    // ===== Window Resize Handler =====
    function handleResize() {
        if (window.innerWidth > 920) {
            if (mobileMenuToggle) {
                mobileMenuToggle.classList.remove('active');
            }
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            document.body.style.overflow = '';
            
            // Reset dropdowns
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        }
        
        // Re-highlight active page on resize
        highlightActivePage();
    }

    window.addEventListener('resize', handleResize);

    // ===== Handle Browser Navigation (Back/Forward buttons) =====
    window.addEventListener('popstate', function() {
        highlightActivePage();
    });

    // ===== Loading Animation =====
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        highlightActivePage();
    });

    // ===== Initialize =====
    updateActiveLink();
    highlightActivePage();
});

// ===== Additional CSS for Active Page Highlighting =====
const additionalStyles = `
    /* Active page highlight styles */
    .nav-link.active,
    .nav-menu a.active {
        color: var(--accent-color, #FF6B35) !important;
        font-weight: 600;
        position: relative;
    }

    .nav-link.active::after,
    .nav-menu a.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--accent-color, #FF6B35);
        border-radius: 2px;
    }

    /* Dropdown parent active when child is active */
    .nav-item:has(.dropdown-link.active) > .nav-link,
    .dropdown:has(.active) > .nav-link {
        color: var(--accent-color, #FF6B35) !important;
    }

    /* Mobile active page styles */
    @media (max-width: 920px) {
        .nav-link.active,
        .nav-menu a.active {
            background: rgba(255, 107, 53, 0.1);
            border-radius: 5px;
            padding: 0.5rem 1rem;
        }
        
        .nav-link.active::after,
        .nav-menu a.active::after {
            display: none;
        }
        
        /* Show underline on mobile for active state */
        .nav-link.active {
            border-left: 3px solid var(--accent-color, #FF6B35);
            padding-left: 0.8rem !important;
        }
    }

    /* Dropdown active state */
    .dropdown-link.active {
        color: var(--accent-color, #FF6B35);
        background: rgba(255, 107, 53, 0.1);
    }

    /* Loading animation */
    body.loaded {
        animation: fadeIn 0.5s ease;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    /* Cart count badge */
    .cart-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--accent-color, #FF6B35);
        color: white;
        font-size: 0.7rem;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        font-weight: bold;
    }

    .cart-icon {
        position: relative;
    }

    /* Smooth transitions */
    .nav-link {
        transition: color 0.3s ease, background 0.3s ease;
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

//Cart badge on all pages
document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart badge on every page
    if (typeof CartManager !== 'undefined') {
        CartManager.updateBadgeGlobally();
    }
});

// Standalone badge updater for pages without cart.js
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcon = document.querySelector('.fa-shopping-cart');
    
    if (cartIcon) {
        const cartLink = cartIcon.closest('a') || cartIcon.parentElement;
        
        // Remove existing badge
        const existingBadge = cartLink.querySelector('.cart-badge');
        if (existingBadge) existingBadge.remove();

        if (totalItems > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = totalItems;
            badge.style.cssText = `
                position: absolute;
                top: -10px;
                right: -10px;
                background-color: #D4A574;
                color: white;
                font-size: 0.7rem;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                z-index: 1000;
                pointer-events: none;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                border: 2px solid white;
            `;
            cartLink.style.position = 'relative';
            cartLink.style.display = 'inline-block';
            cartLink.appendChild(badge);
        }
    }
}

// Run on every page
document.addEventListener('DOMContentLoaded', updateCartBadge);