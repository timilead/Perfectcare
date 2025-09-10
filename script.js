// Mobile Menu Functions
document.getElementById('mobileMenuBtn').addEventListener('click', openMobileMenu);
document.getElementById('mobileMenuClose').addEventListener('click', closeMobileMenu);
document.getElementById('mobileMenuOverlay').addEventListener('click', closeMobileMenu);

function openMobileMenu() {
    document.getElementById('mobileMenu').classList.add('active');
    document.getElementById('mobileMenuOverlay').classList.add('active');
}

function closeMobileMenu() {
    document.getElementById('mobileMenu').classList.remove('active');
    document.getElementById('mobileMenuOverlay').classList.remove('active');
}

// Search Toggle
document.getElementById('searchBtnMobile').addEventListener('click', toggleSearch);

function toggleSearch() {
    document.getElementById('searchBarMobile').classList.toggle('active');
}
// Product Modal
let currentImageIndex = 0;
let autoSlideInterval;

document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', function() {
        const image = this.dataset.image;
        const title = this.dataset.title;
        const price = this.dataset.price;
        const sold = this.dataset.sold;
        openModal(image, title, price, sold);
    });
});

document.getElementById('productModalClose').addEventListener('click', closeModal);
document.getElementById('productModalOverlay').addEventListener('click', closeModal);
document.getElementById('nextImageBtn').addEventListener('click', nextImage);
document.getElementById('prevImageBtn').addEventListener('click', prevImage);
document.getElementById('increaseQtyBtn').addEventListener('click', increaseQty);
document.getElementById('decreaseQtyBtn').addEventListener('click', decreaseQty);
document.getElementById('addToCartBtn').addEventListener('click', addToCart);

function openModal(image, title, price, sold, images = []) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalPrice').textContent = price;
    document.getElementById('modalSold').textContent = sold;
    document.getElementById('qtyInput').value = 1;
    
    const carousel = document.getElementById('carouselImages');
    carousel.innerHTML = '';
    (images.length ? images : [image]).forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        carousel.appendChild(img);
    });
    
    currentImageIndex = 0;
    updateCarousel();
    startAutoSlide();
    
    const btn = document.getElementById('addToCartBtn');
    btn.dataset.title = title;
    btn.dataset.price = price.replace(/[^\d.]/g, '');
    btn.dataset.image = image;
    
    document.getElementById('productModal').style.display = 'flex';
}

function updateCarousel() {
    const carousel = document.getElementById('carouselImages');
    const imgs = carousel.querySelectorAll('img');
    
    imgs.forEach((img, i) => {
        img.classList.remove('active');
        if (i === currentImageIndex) img.classList.add('active');
    });
    
    const offset = -currentImageIndex * 100;
    carousel.style.transform = `translateX(${offset}%)`;
}

function nextImage() {
    const carousel = document.getElementById('carouselImages');
    const total = carousel.children.length;
    currentImageIndex = (currentImageIndex + 1) % total;
    updateCarousel();
}

function prevImage() {
    const carousel = document.getElementById('carouselImages');
    const total = carousel.children.length;
    currentImageIndex = (currentImageIndex - 1 + total) % total;
    updateCarousel();
}

function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextImage, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    stopAutoSlide();
}

function increaseQty() {
    const input = document.getElementById('qtyInput');
    input.value = parseInt(input.value) + 1;
}

function decreaseQty() {
    const input = document.getElementById('qtyInput');
    if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
}

// Auth Modal
document.getElementById('authModalBtn').addEventListener('click', openAuthModal);
document.getElementById('bottomAuthBtn').addEventListener('click', openAuthModal);
document.getElementById('authModalClose').addEventListener('click', closeAuthModal);
document.getElementById('authModalOverlay').addEventListener('click', closeAuthModal);
document.getElementById('signInTab').addEventListener('click', showSignIn);
document.getElementById('signUpTab').addEventListener('click', showSignUp);

function openAuthModal() {
    document.getElementById("authModal").style.display = "flex";
    showSignIn();
}

function closeAuthModal() {
    document.getElementById("authModal").style.display = "none";
}

function showSignIn() {
    document.getElementById("signInTab").classList.add("active");
    document.getElementById("signUpTab").classList.remove("active");
    document.getElementById("authContent").innerHTML = `
        <form onsubmit="event.preventDefault(); alert('Login successful!')">
            <input type="email" placeholder="Email" required>
            <input type="password" placeholder="Password" required>
            <button type="submit">Sign In</button>
            <div class="social-login">
                <p>Or sign in with</p>
                <div class="social-icons">
                    <button class="social-btn google"><i class="fab fa-google"></i></button>
                    <button class="social-btn facebook"><i class="fab fa-facebook-f"></i></button>
                    <button class="social-btn github"><i class="fab fa-github"></i></button>
                </div>
            </div>
            <small>Don't have an account? Click Sign Up above</small>
        </form>
    `;
}

function showSignUp() {
    document.getElementById("signUpTab").classList.add("active");
    document.getElementById("signInTab").classList.remove("active");
    document.getElementById("authContent").innerHTML = `
        <form onsubmit="event.preventDefault(); alert('Registration successful!')">
            <input type="text" placeholder="Full Name" required>
            <input type="email" placeholder="Email" required>
            <input type="password" placeholder="Password" required>
            <button type="submit">Sign Up</button>
            <div class="social-login">
                <p>Or sign up with</p>
                <div class="social-icons">
                    <button class="social-btn google"><i class="fab fa-google"></i></button>
                    <button class="social-btn facebook"><i class="fab fa-facebook-f"></i></button>
                    <button class="social-btn github"><i class="fab fa-github"></i></button>
                </div>
            </div>
            <small>Already have an account? Click Sign In above</small>
        </form>
    `;
}

// Cart Functions
let cart = [];

document.getElementById('cartModalBtn').addEventListener('click', openCartModal);
document.getElementById('bottomCartBtn').addEventListener('click', openCartModal);
document.getElementById('cartModalClose').addEventListener('click', closeCartModal);
document.getElementById('cartModalOverlay').addEventListener('click', closeCartModal);
document.getElementById('checkoutBtn').addEventListener('click', checkoutCart);

function addToCart() {
    const title = document.getElementById('addToCartBtn').dataset.title;
    const price = parseFloat(document.getElementById('addToCartBtn').dataset.price);
    const qty = parseInt(document.getElementById('qtyInput').value);
    const image = document.getElementById('addToCartBtn').dataset.image;
    
    const existing = cart.find(item => item.title === title);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ title, price, qty, image });
    }
    
    updateCartCount();
    showToast(`"${title}" (${qty} item) added to cart!`);
    closeModal();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    openCartModal();
    updateCartCount();
    showToast("Item removed from cart!");
}

function openCartModal() {
    const container = document.getElementById('cartItems');
    container.innerHTML = '';
    let total = 0;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 20px;">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            container.innerHTML += `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">GHS ${item.price.toFixed(2)} × ${item.qty}</div>
                        <button class="remove-item-btn" onclick="removeFromCart(${index})">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            total += item.price * item.qty;
        });
    }
    
    document.getElementById('cartTotal').textContent = `GHS ${total.toFixed(2)}`;
    document.getElementById('cartModal').style.display = 'flex';
}

function closeCartModal() {
    document.getElementById('cartModal').style.display = 'none';
}

function checkoutCart() {
    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }
    
    const phoneNumber = "233546427295"; // Your WhatsApp number
    let message = "🛒 *Hello, I'd like to order the following items:*\n\n";
    
    let total = 0;
    cart.forEach((item, index) => {
        message += `*${index + 1}. ${item.title}*\n- Qty: ${item.qty}\n- Price: GHS ${item.price.toFixed(2)}\n\n`;
        total += item.price * item.qty;
    });
    
    message += `*Total Price:* GHS ${total.toFixed(2)}\n\nPlease confirm availability.`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, "_blank");
    
    cart = [];
    updateCartCount();
    closeCartModal();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('mobileCartCount').textContent = count;
    document.getElementById('bottomCartCount').textContent = count;
}

// Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}