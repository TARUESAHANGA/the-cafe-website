// Cart functionality for The Cafe website

class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.cartItemsContainer = document.getElementById('cartItems');
        this.cartSummary = document.getElementById('cartSummary');
        this.subtotalElement = document.getElementById('subtotal');
        this.taxElement = document.getElementById('tax');
        this.totalElement = document.getElementById('total');

        this.init();
    }

    init() {
        this.renderCart();
        this.attachEventListeners();
        this.updateCartCount();
    }

    // Load cart from localStorage
    loadCart() {
        const savedCart = localStorage.getItem('cafeCart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cafeCart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Update cart count in navigation
    updateCartCount() {
        const cartIcon = document.querySelector('.fa-shopping-cart');
        if (cartIcon) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);

            // Remove existing badge
            const existingBadge = cartIcon.parentElement.querySelector('.cart-badge');
            if (existingBadge) {
                existingBadge.remove();
            }

            // Add badge if items exist
            if (totalItems > 0) {
                const badge = document.createElement('span');
                badge.className = 'cart-badge';
                badge.textContent = totalItems;
                badge.style.cssText = `
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: var(--secondary-color);
                    color: white;
                    font-size: 0.75rem;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                `;
                cartIcon.parentElement.style.position = 'relative';
                cartIcon.parentElement.appendChild(badge);
            }
        }
    }

    // Add item to cart (static method for use from other pages)
    static addToCart(item) {
        const cart = JSON.parse(localStorage.getItem('cafeCart')) || [];
        const existingItem = cart.find(cartItem => cartItem.id === item.id);

        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image || '../assets/images/default-food.jpg',
                description: item.description || '',
                quantity: item.quantity || 1
            });
        }

        localStorage.setItem('cafeCart', JSON.stringify(cart));

        // Show toast notification
        CartManager.showToast(`${item.name} added to cart!`, 'success');

        // Update cart count if on same page
        if (window.cartManager) {
            window.cartManager.cart = cart;
            window.cartManager.updateCartCount();
        }
    }

    // Remove item from cart
    removeItem(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.saveCart();
        this.renderCart();
        this.showToast('Item removed from cart', 'success');
    }

    // Update item quantity
    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(item => item.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(itemId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.renderCart();
            }
        }
    }

    // Clear entire cart
    clearCart() {
        if (this.cart.length === 0) return;

        if (confirm('Are you sure you want to clear your cart?')) {
            this.cart = [];
            this.saveCart();
            this.renderCart();
            this.showToast('Cart cleared successfully', 'success');
        }
    }

    // Calculate totals
    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = subtotal > 0 ? 2.99 : 0;
        const tax = subtotal * 0.10;
        const total = subtotal + deliveryFee + tax;

        return {
            subtotal: subtotal.toFixed(2),
            deliveryFee: deliveryFee.toFixed(2),
            tax: tax.toFixed(2),
            total: total.toFixed(2)
        };
    }

    // Render cart items
    renderCart() {
        if (this.cart.length === 0) {
            this.showEmptyCart();
            return;
        }

        this.cartSummary.style.display = 'block';
        const totals = this.calculateTotals();

        // Update summary
        this.subtotalElement.textContent = `£${totals.subtotal}`;
        this.taxElement.textContent = `£${totals.tax}`;
        this.totalElement.textContent = `£${totals.total}`;

        // Render items
        this.cartItemsContainer.innerHTML = this.cart.map((item, index) => `
            <div class="cart-item" style="animation-delay: ${index * 0.1}s">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.description || ''}</p>
                </div>
                <div class="cart-item-price">£${item.price.toFixed(2)}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                    <input type="text" class="quantity-input" value="${item.quantity}" readonly aria-label="Quantity">
                    <button class="quantity-btn plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}" aria-label="Remove item">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <div class="cart-item-total">£${(item.price * item.quantity).toFixed(2)}</div>
            </div>
        `).join('');

        this.attachItemEventListeners();
    }

    // Show empty cart message
    showEmptyCart() {
        this.cartSummary.style.display = 'none';
        this.cartItemsContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some delicious items from our menu!</p>
                <a href="./menu.html" class="btn-primary">Browse Menu</a>
            </div>
        `;
    }

    // Attach event listeners
    attachEventListeners() {
        // Clear cart button
        const clearBtn = document.getElementById('clearCartBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }
    }

    // Attach event listeners to cart items
    attachItemEventListeners() {
        // Quantity buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                const item = this.cart.find(item => item.id === itemId);
                if (item) {
                    this.updateQuantity(itemId, item.quantity - 1);
                }
            });
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.dataset.id;
                const item = this.cart.find(item => item.id === itemId);
                if (item) {
                    this.updateQuantity(itemId, item.quantity + 1);
                }
            });
        });

        // Remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.currentTarget.dataset.id;
                this.removeItem(itemId);
            });
        });
    }

    // Handle checkout
    handleCheckout() {
        if (this.cart.length === 0) {
            this.showToast('Your cart is empty!', 'error');
            return;
        }

        // Simulate checkout process
        const checkoutBtn = document.getElementById('checkoutBtn');
        const originalText = checkoutBtn.innerHTML;
        checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        checkoutBtn.disabled = true;

        setTimeout(() => {
            this.showToast('Order placed successfully! Thank you for your order.', 'success');
            this.cart = [];
            this.saveCart();
            this.renderCart();
            checkoutBtn.innerHTML = originalText;
            checkoutBtn.disabled = false;
        }, 2000);
    }

    // Show toast notification
    static showToast(message, type = 'success') {
        // Remove existing toast
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    showToast(message, type) {
        CartManager.showToast(message, type);
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cartManager = new CartManager();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CartManager;
}
