// ===== CART MANAGEMENT SYSTEM =====
// Cart data structure
let cart = [];
const cartKey = 'ashmaa_techs_cart';

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem(cartKey);
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();
}

// Add item to cart
function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    showNotification(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            saveCart();
        }
    }
}

// Calculate cart totals
function calculateTotals() {
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
    const shipping = 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    return {
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        total: total.toFixed(2)
    };
}

// Update cart display
function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
                <a href="products.html" class="btn">Browse Products</a>
            </div>
        `;
        cartCountElement.textContent = '0';
        
        // Update totals
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('tax').textContent = '$0.00';
        document.getElementById('total').textContent = '$9.99';
        return;
    }
    
    // Create cart items HTML
    let cartItemsHTML = '';
    cart.forEach(item => {
        cartItemsHTML += `
            <div class="cart-item" data-id="${item.id}">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                    <div class="item-quantity">
                        <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartItemQuantity('${item.id}', 1)">+</button>
                    </div>
                </div>
                <div class="item-price">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
                <button class="remove-item" onclick="removeCartItem('${item.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartItemsHTML;
    
    // Update totals
    const totals = calculateTotals();
    document.getElementById('subtotal').textContent = `$${totals.subtotal}`;
    document.getElementById('tax').textContent = `$${totals.tax}`;
    document.getElementById('total').textContent = `$${totals.total}`;
    
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// Update cart item quantity (public function for buttons)
function updateCartItemQuantity(productId, change) {
    updateQuantity(productId, change);
    updateCartDisplay();
}

// Remove cart item (public function for buttons)
function removeCartItem(productId) {
    removeFromCart(productId);
    updateCartDisplay();
}

// Update cart count in header
function updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

// ===== PAGE INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    // Initialize cart
    initCart();
    
    // Update cart display on order page
    if (document.getElementById('cart-items-container')) {
        updateCartDisplay();
    }
    
    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.innerHTML = navMenu.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        const themeIcon = themeToggle.querySelector('i');
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            if (document.body.classList.contains('light-theme')) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            } else {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
        });
    }
    
    // Payment Method Selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    if (paymentMethods.length > 0) {
        paymentMethods.forEach(method => {
            method.addEventListener('click', () => {
                paymentMethods.forEach(m => m.classList.remove('active'));
                method.classList.add('active');
            });
        });
    }
    
    // Order Form Submission
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get selected payment method
            let paymentMethod = 'Credit Card';
            const activeMethod = document.querySelector('.payment-method.active');
            if (activeMethod) {
                paymentMethod = activeMethod.querySelector('span').textContent;
            }
            
            // Show success message
            showNotification(`Order placed successfully! Payment method: ${paymentMethod}`);
            
            // Clear cart
            cart = [];
            saveCart();
            updateCartDisplay();
            
            // Reset form
            this.reset();
        });
    }
    
    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for your message! We will get back to you soon.');
            this.reset();
        });
    }
    
    // Newsletter Form Submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    if (newsletterForms.length > 0) {
        newsletterForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                showNotification('Thank you for subscribing to our newsletter!');
                this.reset();
            });
        });
    }
    
    // Add to Cart Buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const product = {
                id: productCard.dataset.id,
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
                image: productCard.querySelector('img').src
            };
            addToCart(product);
            
            // Animation effect
            this.innerHTML = '<i class="fas fa-check"></i>';
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            }, 1000);
        });
    });
    
    // Product Category Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const category = button.dataset.category;
                filterProducts(category);
            });
        });
    }
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (mobileToggle) mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        });
    });
});

// ===== HELPER FUNCTIONS =====
// Filter Products
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    products.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
            product.style.display = 'block';
            product.style.animation = 'slideUp 0.5s ease-out';
        } else {
            product.style.display = 'none';
        }
    });
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize notification styles
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--gold);
        color: var(--black);
        padding: 15px 30px;
        border-radius: 30px;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 10000;
    }
    
    .notification.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
`;
document.head.appendChild(notificationStyles);