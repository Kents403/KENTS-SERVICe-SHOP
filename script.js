let cart = JSON.parse(localStorage.getItem('kents_cart')) || [];

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

function addCryptoToCart(cryptoName, quantity) {
    const cryptoId = cryptoName === 'TON' ? 1000 : 1001;
    
    const cryptoItem = {
        id: cryptoId,
        name: `${cryptoName} Coin`,
        price: 0,
        quantity: quantity,
        category: 'crypto',
        cryptoType: cryptoName,
        notes: `Miqdor: ${quantity}`
    };

    cart.push(cryptoItem);
    updateCart();
    saveCart();
    showNotification(`${quantity} ${cryptoName} Coin savatga qo'shildi!`);
}

function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (!cartItems || !cartTotal) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Savat bo\'sh</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        
        if (item.category === 'crypto') {
            return `
                <div class="cart-item">
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.notes || ''}</p>
                        <p style="color: #4cc9f0; font-style: italic;">Narx kelishiladi</p>
                    </div>
                    <div>
                        <button onclick="removeFromCart(${item.id})" 
                                style="background: #ef476f; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        } else {
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
        }
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
            showCryptoQuantityModal(cryptoName); 
        });
    });
}

function showCryptoQuantityModal(cryptoName) {
    const oldModal = document.getElementById('cryptoQuantityModal');
    if (oldModal) oldModal.remove();
    
    const modal = document.createElement('div');
    modal.id = 'cryptoQuantityModal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 3000;
        display: flex;
        justify-content: center;
        align-items: center;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            border-radius: 15px;
            padding: 30px;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        ">
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-coins" style="font-size: 3rem; color: #4361ee; margin-bottom: 15px;"></i>
                <h2 style="color: #333; margin-bottom: 10px;">${cryptoName} Coin Miqdorini Tanlang</h2>
                <p style="color: #666; margin-bottom: 25px;">Narx kelishiladi. Miqdorni tanlang:</p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                    ${[1, 5, 10, 50, 100, 500].map(qty => `
                        <button class="crypto-qty-btn" data-qty="${qty}" style="
                            padding: 15px;
                            border: 2px solid #e0e0e0;
                            background: white;
                            border-radius: 10px;
                            font-size: 1.1rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s;
                        " onmouseover="this.style.borderColor='#4361ee'; this.style.backgroundColor='#f0f4ff';"
                        onmouseout="this.style.borderColor='#e0e0e0'; this.style.backgroundColor='white';">
                            ${qty}
                        </button>
                    `).join('')}
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">
                        Yoki o'zingiz kiriting:
                    </label>
                    <input type="number" id="customCryptoQty" min="1" max="10000" 
                           placeholder="Miqdor" 
                           style="
                                width: 100%;
                                padding: 12px;
                                border: 2px solid #e0e0e0;
                                border-radius: 8px;
                                font-size: 16px;
                                text-align: center;
                           ">
                </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button onclick="document.getElementById('cryptoQuantityModal').remove()" 
                        style="
                            flex: 1;
                            padding: 15px;
                            background: #6c757d;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: 0.3s;
                        "
                        onmouseover="this.style.backgroundColor='#5a6268';"
                        onmouseout="this.style.backgroundColor='#6c757d';">
                    Bekor qilish
                </button>
                
                <button onclick="addSelectedCrypto('${cryptoName}')" 
                        style="
                            flex: 1;
                            padding: 15px;
                            background: #4361ee;
                            color: white;
                            border: none;
                            border-radius: 8px;
                            font-weight: 600;
                            cursor: pointer;
                            transition: 0.3s;
                        "
                        onmouseover="this.style.backgroundColor='#3a56d4';"
                        onmouseout="this.style.backgroundColor='#4361ee';">
                    <i class="fas fa-cart-plus"></i> Savatga Qo'shish
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelectorAll('.crypto-qty-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const qty = parseInt(this.dataset.qty);
            document.getElementById('customCryptoQty').value = qty;
        });
    });
}

window.addSelectedCrypto = function(cryptoName) {
    const customInput = document.getElementById('customCryptoQty');
    let quantity = parseInt(customInput.value);
    
    if (!quantity || quantity < 1) {
        showNotification('Iltimos, miqdorni kiriting!', 'warning');
        return;
    }
    
    if (quantity > 10000) {
        showNotification('Miqdor 10,000 dan oshmasligi kerak!', 'warning');
        return;
    }
    
    addCryptoToCart(cryptoName, quantity);
    
    const modal = document.getElementById('cryptoQuantityModal');
    if (modal) modal.remove();
    
    showNotification(`${quantity} ${cryptoName} Coin savatga qo'shildi!`);
};

function showNotification(message, type = 'success') {
    const oldNotif = document.querySelector('.notification');
    if (oldNotif) oldNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4cc9f0' : type === 'warning' ? '#ffd166' : '#ef476f'};
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