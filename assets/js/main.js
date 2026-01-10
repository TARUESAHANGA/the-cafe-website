// ===== Main JavaScript for Cafe Website =====

document.addEventListener('DOMContentLoaded', function() {
    // ===== Active Page Highlight =====
    function highlightActivePage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Remove existing active classes
            link.classList.remove('active');
            
            // Highlight based on current page
            if (linkHref === currentPage || 
                (currentPage === 'index.html' && linkHref === '/') ||
                (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            }
            
            // Special handling for dropdown items
            if (link.closest('.dropdown')) {
                const parentNavItem = link.closest('.nav-item');
                const parentLink = parentNavItem.querySelector('.nav-link:not(.dropdown-link)');
                
                if (parentLink && linkHref === currentPage) {
                    parentLink.classList.add('active');
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

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Update active highlight after navigation
            setTimeout(highlightActivePage, 100);
        });
    });

    // ===== Dropdown Menu Toggle for Mobile =====
    navItems.forEach(item => {
        const chevron = item.querySelector('.fa-chevron-down');
        const dropdown = item.querySelector('.dropdown');
        
        if (chevron && dropdown) {
            // Click event for chevron on mobile
            chevron.addEventListener('click', function(e) {
                e.preventDefault();
                
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
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
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
            const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

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

    // ===== Enhanced Search Functionality =====
    const searchIcon = document.querySelector('.fa-search');
    
    if (searchIcon) {
        searchIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create search modal or redirect to search page
            const searchModal = document.createElement('div');
            searchModal.className = 'search-modal';
            searchModal.innerHTML = `
                <div class="search-modal-content">
                    <span class="close-search">&times;</span>
                    <h3>Search our menu</h3>
                    <input type="text" placeholder="Search for coffee, pastries, etc..." class="search-input">
                    <div class="search-results"></div>
                </div>
            `;
            
            document.body.appendChild(searchModal);
            
            // Close search modal
            const closeSearch = searchModal.querySelector('.close-search');
            closeSearch.addEventListener('click', function() {
                document.body.removeChild(searchModal);
            });
            
            // Close on outside click
            searchModal.addEventListener('click', function(e) {
                if (e.target === searchModal) {
                    document.body.removeChild(searchModal);
                }
            });
            
            // Search functionality
            const searchInput = searchModal.querySelector('.search-input');
            const searchResults = searchModal.querySelector('.search-results');
            
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase();
                
                if (query.length > 2) {
                    // Simulate search results
                    const results = [
                        'Espresso - $3.50',
                        'Cappuccino - $4.25',
                        'Croissant - $3.00',
                        'Blueberry Muffin - $2.75'
                    ].filter(item => item.toLowerCase().includes(query));
                    
                    searchResults.innerHTML = results.map(result => 
                        `<div class="search-result-item">${result}</div>`
                    ).join('');
                } else {
                    searchResults.innerHTML = '';
                }
            });
        });
    }

    // ===== Cart Functionality =====
    const cartIcon = document.querySelector('.fa-shopping-cart');
    let cartCount = 0;

    if (cartIcon) {
        cartIcon.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show cart notification or redirect to cart page
            const cartNotification = document.createElement('div');
            cartNotification.className = 'cart-notification';
            cartNotification.innerHTML = `
                <div class="cart-notification-content">
                    <p>Cart is empty</p>
                    <a href="cart.html">View Cart</a>
                </div>
            `;
            
            document.body.appendChild(cartNotification);
            
            setTimeout(() => {
                if (document.body.contains(cartNotification)) {
                    document.body.removeChild(cartNotification);
                }
            }, 3000);
        });
    }

    // ===== Menu Navigation Integration =====
    // Update active page highlight when showing menu sections
    const originalShowSection = window.showSection;
    if (originalShowSection) {
        window.showSection = function(sectionId) {
            originalShowSection(sectionId);
            
            // Update URL hash without jumping
            history.pushState(null, null, sectionId);
            
            // Update active states for menu navigation
            const menuTabs = document.querySelectorAll('.menu-tab');
            menuTabs.forEach(tab => {
                if (tab.getAttribute('onclick').includes(sectionId)) {
                    tab.classList.add('active');
                } else {
                    tab.classList.remove('active');
                }
            });
        };
    }

    // ===== Window Resize Handler =====
    function handleResize() {
        if (window.innerWidth > 920) {
            mobileMenuToggle.classList.remove('active');
            navMenu.classList.remove('active');
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

    // ===== Handle Browser Navigation =====
    window.addEventListener('popstate', function() {
        highlightActivePage();
        
        // Handle menu section navigation
        const hash = window.location.hash;
        if (hash && window.showSection) {
            window.showSection(hash);
        }
    });

    // ===== Loading Animation =====
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        highlightActivePage(); // Ensure active page is highlighted after load
    });

    // ===== Utility Functions =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ===== Initialize =====
    updateActiveLink();
    highlightActivePage();
});

// ===== Additional CSS for Active Page Highlighting =====
const additionalStyles = `
    .search-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2000;
        backdrop-filter: blur(5px);
    }

    .search-modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        width: 90%;
        max-width: 500px;
        position: relative;
    }

    .close-search {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 2rem;
        cursor: pointer;
        color: #666;
    }

    .search-input {
        width: 100%;
        padding: 1rem;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 1rem;
        margin: 1rem 0;
    }

    .search-result-item {
        padding: 0.5rem;
        border-bottom: 1px solid #eee;
        cursor: pointer;
    }

    .search-result-item:hover {
        background-color: #f5f5f5;
    }

    .cart-notification {
        position: fixed;
        top: 100px;
        right: 20px;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 1500;
        animation: slideInRight 0.3s ease;
    }

    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .cart-notification a {
        color: #FF6B35;
        font-weight: bold;
    }

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

    /* Active page highlight styles */
    .nav-link.active {
        color: var(--accent-color) !important;
        font-weight: 600;
        position: relative;
    }

    .nav-link.active::after {
        content: '';
        position: absolute;
        bottom: -5px;
        left: 0;
        width: 100%;
        height: 2px;
        background: var(--accent-color);
        border-radius: 2px;
    }

    .nav-item.active .nav-link {
        color: var(--accent-color) !important;
    }

    /* Mobile active page styles */
    @media (max-width: 920px) {
        .nav-link.active {
            background: rgba(255, 107, 53, 0.1);
            border-radius: 5px;
            padding: 0.5rem 1rem;
        }
        
        .nav-link.active::after {
            display: none;
        }
    }

    /* Dropdown active state */
    .dropdown-link.active {
        color: var(--accent-color);
        background: rgba(255, 107, 53, 0.1);
    }

    /* Menu tab active state (for menu page) */
    .menu-tab.active {
        background: var(--primary-brown) !important;
        color: white !important;
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(139, 69, 19, 0.3);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);