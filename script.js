// ===== GLOBAL O'ZGARUVCHILAR =====
let cart = JSON.parse(localStorage.getItem('kents_cart')) || [];

// ===== MOBIL MENYU =====
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    
    if (!mobileMenuBtn || !navMenu) return;
    
    // Tugma bosilganda
    mobileMenuBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navMenu.classList.toggle('active');
        this.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    // Link bosilganda yopish
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Tashqariga bosilganda
    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });
    
    // Ekran o'lchamiga qarab
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

// ===== SAVAT FUNKSIYALARI =====
function addToCart(product) {
    // Savatda borligini tekshirish
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
    // Savat soni
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
    
    // Savat modali
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
    showNotification('Mahsulot savatdan o\'chirildi!');
}

function saveCart() {
    localStorage.setItem('kents_cart', JSON.stringify(cart));
}

// ===== SAVAT MODALI =====
function initCartModal() {
    const cartIcon = document.getElementById('cartIcon');
    const cartModal = document.querySelector('.cart-modal');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!cartIcon || !cartModal) return;
    
    // Savat ikonkasi
    cartIcon.addEventListener('click', function() {
        cartModal.style.display = 'flex';
        updateCart();
    });
    
    // Yopish
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }
    
    // Tashqariga bosilganda
    window.addEventListener('click', function(e) {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Buyurtma berish
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Savat bo\'sh!', 'error');
                return;
            }
            
            const orderMessage = generateOrderMessage();
            const telegramUrl = `https://t.me/kentservice_support?text=${encodeURIComponent(orderMessage)}`;
            window.open(telegramUrl, '_blank');
            
            // Savatni tozalash
            cart = [];
            saveCart();
            updateCart();
            
            // Modalni yopish
            cartModal.style.display = 'none';
            
            showNotification('Buyurtma Telegramga yuborildi!');
        });
    }
}

function generateOrderMessage() {
    let message = `🛒 KENTS SERVICE - Yangi Buyurtma\n\n`;
    message += `Sana: ${new Date().toLocaleDateString('uz-UZ')}\n`;
    message += `Vaqt: ${new Date().toLocaleTimeString('uz-UZ')}\n\n`;
    message += `📦 Buyurtma Tarkibi:\n`;
    
    let total = 0;
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. ${item.name} - ${item.quantity} × ${item.price.toLocaleString()} = ${itemTotal.toLocaleString()} UZS\n`;
    });
    
    message += `\n💰 Jami: ${total.toLocaleString()} UZS\n`;
    message += `\n👤 Mijoz: (Ismingiz va telefon raqamingizni yozing)`;
    
    return message;
}

// ===== KRIPTOVALYUTA =====
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
            
            const telegramUrl = `https://t.me/kentservice_support?text=${encodeURIComponent(message)}`;
            window.open(telegramUrl, '_blank');
            
            showNotification(`${cryptoName} uchun so'rov yuborildi!`);
        });
    });
}

// ===== XABARNOMA =====
function showNotification(message, type = 'success') {
    // Eski xabarnomani o'chirish
    const oldNotif = document.querySelector('.notification');
    if (oldNotif) oldNotif.remove();
    
    // Yangi xabarnoma
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Stil
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4cc9f0' : '#ffd166'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // 3 sekunddan so'ng o'chirish
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== YUKLASH =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('KENTS SERVICE yuklanmoqda...');
    
    // 1. Mobil menyu
    initMobileMenu();
    
    // 2. Savatni yangilash
    updateCart();
    
    // 3. Savat modalini ishga tushirish
    initCartModal();
    
    // 4. Kriptovalyuta tugmalari
    initCryptoButtons();
    
    // 5. Smooth scroll
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
    
    console.log('KENTS SERVICE to\'liq yuklandi!');
});

// ===== BUYURTMA KUZATISH FORMASI =====
function addOrderTrackingForm() {
    // Savat modaliga buyurtma formasi qo'shish
    const cartFooter = document.querySelector('.cart-footer');
    if (!cartFooter) return;
    
    const trackingForm = `
        <div class="order-track-form" style="display: none;" id="orderForm">
            <h3 style="margin-bottom: 20px; color: #333;"><i class="fas fa-user-check"></i> Buyurtma ma'lumotlari</h3>
            
            <div class="form-group">
                <label for="customerName"><i class="fas fa-user"></i> Ismingiz</label>
                <input type="text" id="customerName" placeholder="Ismingizni kiriting" required>
            </div>
            
            <div class="form-group">
                <label for="customerPhone"><i class="fas fa-phone"></i> Telegram username yoki telefon</label>
                <input type="text" id="customerPhone" placeholder="@username yoki +998901234567" required>
            </div>
            
            <div class="form-group">
                <label for="orderNotes"><i class="fas fa-sticky-note"></i> Qo'shimcha izoh (ixtiyoriy)</label>
                <textarea id="orderNotes" placeholder="Qo'shimcha izohlar..."></textarea>
            </div>
            
            <button class="btn-submit" id="submitOrder">
                <i class="fab fa-telegram"></i> Buyurtmani yuborish
            </button>
            
            <p style="margin-top: 15px; font-size: 0.9rem; color: #666; text-align: center;">
                <i class="fas fa-shield-alt"></i> Ma'lumotlaringiz maxfiy saqlanadi
            </p>
        </div>
    `;
    
    // Eski checkout tugmasini o'rniga yangi tuzilma
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.outerHTML = trackingForm + checkoutBtn.outerHTML;
        
        // Tugma funksiyasini yangilash
        document.getElementById('checkoutBtn').addEventListener('click', function() {
            const orderForm = document.getElementById('orderForm');
            orderForm.style.display = orderForm.style.display === 'none' ? 'block' : 'none';
        });
        
        // Buyurtma yuborish
        document.getElementById('submitOrder').addEventListener('click', submitOrder);
    }
}

function submitOrder() {
    const customerName = document.getElementById('customerName').value.trim();
    const customerPhone = document.getElementById('customerPhone').value.trim();
    const orderNotes = document.getElementById('orderNotes').value.trim();
    
    if (!customerName || !customerPhone) {
        showNotification('Iltimos, ism va telefon raqamingizni kiriting!', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Savat bo\'sh!', 'error');
        return;
    }
    
    // Buyurtma yaratish
    const order = window.orderTracker.createOrder(
        customerName,
        customerPhone,
        cart,
        calculateTotal(),
        orderNotes
    );
    
    // Telegramga yuborish
    const message = `🆕 *YANGI BUYURTMA* #${order.id}\n\n`;
    message += `👤 *Mijoz:* ${customerName}\n`;
    message += `📞 *Aloqa:* ${customerPhone}\n`;
    message += `💰 *Jami:* ${calculateTotal().toLocaleString()} UZS\n\n`;
    message += `📦 *Mahsulotlar:*\n`;
    
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.quantity} dona\n`;
    });
    
    if (orderNotes) {
        message += `\n📝 *Izoh:* ${orderNotes}`;
    }
    
    const telegramUrl = `https://t.me/kentservice_support?text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
    
    // Savatni tozalash
    cart = [];
    saveCart();
    updateCart();
    
    // Formani tozalash
    document.getElementById('customerName').value = '';
    document.getElementById('customerPhone').value = '';
    document.getElementById('orderNotes').value = '';
    document.getElementById('orderForm').style.display = 'none';
    
    // Modalni yopish
    document.querySelector('.cart-modal').style.display = 'none';
    
    showNotification(`Buyurtma #${order.id} qabul qilindi! Tez orada bog'lanamiz.`);
    
    // Mijozga holatni kuzatish haqida xabar
    if (customerPhone.startsWith('@')) {
        const trackMessage = `✅ Buyurtmangiz qabul qilindi!\n\n`;
        trackMessage += `📋 *Buyurtma ID:* #${order.id}\n`;
        trackMessage += `📊 *Holatni kuzatish:* index.html?track=${order.id}\n`;
        trackMessage += `⏱ *Tayyor bo'lish vaqti:* 5-15 daqiqa\n\n`;
        trackMessage += `📞 *Qo'llab-quvvatlash:* @kentservice_support`;
        
        const customerUrl = `https://t.me/${customerPhone.slice(1)}?text=${encodeURIComponent(trackMessage)}`;
        setTimeout(() => {
            window.open(customerUrl, '_blank');
        }, 2000);
    }
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// ===== BUYURTMA BERISH (YANGI VERSIYA) =====
function submitOrder() {
    const customerName = document.getElementById('customerName')?.value.trim() || '';
    const customerPhone = document.getElementById('customerPhone')?.value.trim() || '';
    const orderNotes = document.getElementById('orderNotes')?.value.trim() || '';
    
    // Validatsiya
    if (!customerName || !customerPhone) {
        showNotification('Iltimos, ism va telefon raqamingizni kiriting!', 'error');
        return;
    }
    
    if (cart.length === 0) {
        showNotification('Savat bo\'sh!', 'error');
        return;
    }
    
    // Buyurtma yaratish
    const orderId = 'KENT-' + Date.now().toString().slice(-6);
    const total = calculateTotal();
    
    // Buyurtma ma'lumotlari
    const orderData = {
        id: orderId,
        customerName: customerName,
        customerPhone: customerPhone,
        items: cart,
        total: total,
        notes: orderNotes,
        date: new Date().toISOString()
    };
    
    // LocalStorage ga saqlash
    saveOrderToLocal(orderData);
    
    // Telegram xabarini tayyorlash
    const message = generateOrderMessage(customerName, customerPhone, orderNotes);
    
    // Universal Telegram ochish
    window.telegramOpener.openTelegram(message, customerPhone);
    
    // Savatni tozalash
    cart = [];
    saveCart();
    updateCart();
    
    // Formani tozalash
    if (document.getElementById('customerName')) {
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('orderNotes').value = '';
    }
    
    // Modalni yopish
    const cartModal = document.querySelector('.cart-modal');
    if (cartModal) cartModal.style.display = 'none';
    
    // Xabarnoma
    showNotification(`Buyurtma #${orderId} yuborildi! Telegramda javob beramiz.`);
    
    // 5 soniyadan keyin modalni yopish (iOS uchun)
    setTimeout(() => {
        const iosModal = document.getElementById('iosTelegramModal');
        if (iosModal) iosModal.remove();
    }, 5000);
}

// ===== LOCALSTORAGE GA BUYURTMA SAQLASH =====
function saveOrderToLocal(orderData) {
    try {
        const orders = JSON.parse(localStorage.getItem('kents_orders')) || [];
        orders.unshift(orderData); // Yangi buyurtma boshiga
        localStorage.setItem('kents_orders', JSON.stringify(orders));
        console.log('Order saved to localStorage:', orderData.id);
    } catch (error) {
        console.error('Error saving order:', error);
    }
}

// ===== XABAR YARATISH =====
function generateOrderMessage(name, phone, notes = '') {
    let message = `🛒 KENTS SERVICE - Yangi Buyurtma\n\n`;
    message += `📋 ID: KENT-${Date.now().toString().slice(-6)}\n`;
    message += `👤 Mijoz: ${name}\n`;
    message += `📞 Aloqa: ${phone}\n`;
    message += `📅 Sana: ${new Date().toLocaleDateString('uz-UZ')}\n`;
    message += `⏰ Vaqt: ${new Date().toLocaleTimeString('uz-UZ')}\n\n`;
    message += `📦 Mahsulotlar:\n`;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        message += `${index + 1}. ${item.name} - ${item.quantity} × ${item.price.toLocaleString()} = ${itemTotal.toLocaleString()} UZS\n`;
    });
    
    message += `\n💰 Jami: ${calculateTotal().toLocaleString()} UZS\n`;
    
    if (notes) {
        message += `\n📝 Izoh: ${notes}\n`;
    }
    
    message += `\n📍 Buyurtma: https://kents403.github.io/KENTS-SERVIC-SHOP/`;
    
    return message;
}

// ===== JAMI HISOBLASH =====
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}
    
 Kiemer-history && order-history.length > 0

const statusHtml = `
<div style="color: #333; margin-bottom: 10px;">Yarick</div>
<div style="max-height: 200px; overflow-y: auto;">
    ${order-history.map(item => 
        `<div style="padding: 10px; border-bottom: 1px solid #eee;">
            <div style="display: flex; justify-content: space-between;">
                <span style="font-weight: 500;">${getStatusText(item.status)}</span>
                <span style="color: #666; font-size: 0.9rem;">
                    ${new Date(item.date).toLocaleDateString('en-US')}
                </span>
            </div>
            ${item.message ? `<div style="color: #666; font-size: 0.9rem; margin-top: 5px;">${item.message}</div>` : ''}
        </div>`
    ).reverse().join('')}
</div>
<button onclick="this.parentElement.parentElement.remove()"
    style="background: #456bef; color: white; border: none; padding: 12px 25px; border-radius: 8px; cursor: pointer;">
    Close
</button>
`;

document.body.insertAdjacentHTML('beforeend', statusHtml);

function getStatusText(status) {
    const statusMap = {
        'pending': 'Pending',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
    };
    return statusMap[status] || 'Unknown';
}

function getStatusText(status) {
    const statusMap = {
        'yangi': '📥 Yangi',
        'qabul_qilindi': '✅ Qabul qilindi',
        'jarayonda': '⚙️ Jarayonda',
        'tayyor': '🎉 Tayyor',
        'yetkazildi': '🚚 Yetkazildi',
        'yakunlandi': '🏁 Yakunlandi'
    };
    return statusMap[status] || status;
}

// ===== YANGI YUKLASH =====
document.addEventListener('DOMContentLoaded', function() {
    // ... avvalgi kodlar ...
    
    // 6. Buyurtma kuzatish formasini qo'shish
    setTimeout(() => {
        addOrderTrackingForm();
    }, 1000);
    
    // 7. Buyurtma kuzatishni ishga tushirish
    initOrderTracking();
    
    // 8. OrderTracker ni global qilish
    if (typeof OrderTracker === 'undefined') {
        // Agar tracker.js alohida fayl bo'lsa
        const script = document.createElement('script');
        script.src = 'tracker.js';
        document.head.appendChild(script);
        
        script.onload = function() {
            window.orderTracker = new OrderTracker();
        };
    }
});