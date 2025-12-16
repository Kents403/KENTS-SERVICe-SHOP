// ===== GLOBAL O'ZGARUVCHILAR =====
let cart = JSON.parse(localStorage.getItem('kents_cart')) || [];

// ===== MOBIL MENYU =====
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    function checkScreenSize() {
        if (window.innerWidth > 768) {
            navMenu.classList.add('active');
            mobileMenuBtn.style.display = 'none';
        } else {
            navMenu.classList.remove('active');
            mobileMenuBtn.style.display = 'block';
        }
    }
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            category: product.category
        });
    }
    
    updateCart();
    saveCart();
    showNotification(`${product.name} savatga qo'shildi!`);
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
    
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Savat bo\'sh</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div>
                    <h4>${item.name}</h4>
                    <p>${item.price.toLocaleString()} UZS × ${item.quantity}</p>
                </div>
                <div>
                    <p style="font-weight: 600; color: #f72585;">${itemTotal.toLocaleString()} UZS</p>
                    <button onclick="removeFromCart(${item.id})" 
                            style="background: #ef476f; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    cartTotal.textContent = total.toLocaleString();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCart();
    showNotification('Mahsulot savatdan ochirildi!');
}

function saveCart() {
    localStorage.setItem('kents_cart', JSON.stringify(cart));
}

function initCartModal() {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.querySelector('.close-cart');
    
    if (!cartIcon || !cartModal) return;
    
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'flex';
        updateCart();
        
        if (window.orderForm) {
            window.orderForm.loadCart();
            window.orderForm.updateCartPreview();
            window.orderForm.updateOrderSummary();
        }
    });
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

function initCryptoButtons() {
    document.querySelectorAll('.btn-crypto').forEach(btn => {
        btn.addEventListener('click', function() {
            const cryptoName = this.dataset.crypto;
            const message = `🪙 KENTS SERVICE - ${cryptoName} Sotib Olish\n\n`;
            message += `Mahsulot: ${cryptoName}\n`;
            message += `Sana: ${new Date().toLocaleDateString('uz-UZ')}\n`;
            message += `Vaqt: ${new Date().toLocaleTimeString('uz-UZ')}\n\n`;
            message += `Narxni kelishish uchun muloqot qilamiz.\n\n`;
            message += `👤 Mijoz: (Ismingiz va telefon raqamingizni yozing)`;
            const telegramUrl = `https://t.me/kentservice_admin?text=${encodeURIComponent(message)}`;
            window.open(telegramUrl, '_blank');
            
            showNotification(`${cryptoName} uchun so'rov yuborildi!`);
        });
    });
}

// ===== XABARNOMA =====
function showNotification(message, type = 'success') {
    const oldNotif = document.querySelector('.notification');
    if (oldNotif) oldNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4cc9f0' : '#ffd166'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== YUKLASH =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('KENTS SERVICE yuklanmoqda...');
    
    initMobileMenu();
    updateCart();
    initCartModal();
    initCryptoButtons();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    console.log('KENTS SERVICE toliq yuklandi!');
});