// products.js - TO'LIQ YANGILANGAN VERSIYA

const products = {
    standoff: [
        { id: 1, name: "100 Gold", price: 13000, icon: "fas fa-coins" },
        { id: 2, name: "500 Gold", price: 63000, icon: "fas fa-coins" },
        { id: 3, name: "1000 Gold", price: 125000, icon: "fas fa-coins" },
        { id: 4, name: "2000 Gold", price: 250000, icon: "fas fa-coins" },
        { id: 5, name: "3000 Gold", price: 375000, icon: "fas fa-coins" }
    ],
    
    pubg: [
        { id: 6, name: "30 UC", price: 7500, icon: "fas fa-gamepad" },
        { id: 7, name: "60 UC", price: 13000, icon: "fas fa-gamepad" },
        { id: 8, name: "120 UC", price: 26500, icon: "fas fa-gamepad" },
        { id: 9, name: "325 UC", price: 60000, icon: "fas fa-gamepad" },
        { id: 10, name: "660 UC", price: 120000, icon: "fas fa-gamepad" },
        { id: 11, name: "1320 UC", price: 238000, icon: "fas fa-gamepad" },
        { id: 12, name: "1800 UC", price: 293000, icon: "fas fa-gamepad" },
        { id: 13, name: "3850 UC", price: 565000, icon: "fas fa-gamepad" },
        { id: 14, name: "8100 UC", price: 1107000, icon: "fas fa-gamepad" }
    ],
    
    brawl: [
        { id: 15, name: "30 Gem", price: 16999, icon: "fas fa-gem" },
        { id: 16, name: "80 Gem", price: 41999, icon: "fas fa-gem" },
        { id: 17, name: "170 Gem", price: 79999, icon: "fas fa-gem" },
        { id: 18, name: "360 Gem", price: 149999, icon: "fas fa-gem" },
        { id: 19, name: "950 Gem", price: 346999, icon: "fas fa-gem" },
        { id: 20, name: "Brawl Pass (Skida)", price: 27000, icon: "fas fa-ticket-alt" },
        { id: 21, name: "Brawl Pass", price: 58000, icon: "fas fa-ticket-alt" },
        { id: 22, name: "Brawl Pass Plus", price: 77000, icon: "fas fa-ticket-alt" }
    ],
    
    mlbb: [
        { id: 23, name: "35 Almaz", price: 11111, icon: "fas fa-gem" },
        { id: 24, name: "88 Almaz", price: 18888, icon: "fas fa-gem" },
        { id: 25, name: "132 Almaz", price: 28888, icon: "fas fa-gem" },
        { id: 26, name: "264 Almaz", price: 48888, icon: "fas fa-gem" },
        { id: 27, name: "440 Almaz", price: 79999, icon: "fas fa-gem" }
    ],
    
    roblox: [
        { id: 28, name: "40 Robux", price: 13000, icon: "fas fa-cube" },
        { id: 29, name: "80 Robux", price: 22000, icon: "fas fa-cube" },
        { id: 30, name: "160 Robux", price: 40000, icon: "fas fa-cube" },
        { id: 31, name: "240 Robux", price: 53000, icon: "fas fa-cube" },
        { id: 32, name: "400 Robux", price: 83000, icon: "fas fa-cube" },
        { id: 33, name: "500 Robux", price: 87000, icon: "fas fa-cube" },
        { id: 34, name: "800 Robux", price: 160000, icon: "fas fa-cube" },
        { id: 35, name: "1000 Robux", price: 165000, icon: "fas fa-cube" },
        { id: 36, name: "1700 Robux", price: 285000, icon: "fas fa-cube" },
        { id: 37, name: "2500 Robux", price: 435000, icon: "fas fa-cube" },
        { id: 38, name: "3500 Robux", price: 555000, icon: "fas fa-cube" }
    ]
};

const telegramProducts = {
    premium: [
        { id: 39, name: "Premium 1oy (Kirib)", price: 43000, icon: "fab fa-telegram" },
        { id: 40, name: "Premium 1yil (Kirib)", price: 285000, icon: "fab fa-telegram" },
        { id: 41, name: "Premium 3oy (Kirmasda)", price: 161000, icon: "fab fa-telegram" },
        { id: 42, name: "Premium 6oy (Kirmasda)", price: 215000, icon: "fab fa-telegram" },
        { id: 43, name: "Premium 1yil (Kirmasda)", price: 390000, icon: "fab fa-telegram" }
    ],
    
    stars: [
        { id: 44, name: "50 Stars", price: 11750, icon: "fas fa-star" },
        { id: 45, name: "100 Stars", price: 23500, icon: "fas fa-star" },
        { id: 46, name: "200 Stars", price: 47000, icon: "fas fa-star" },
        { id: 47, name: "500 Stars", price: 117500, icon: "fas fa-star" }
    ],
    
    numbers: [
        { id: 48, name: "🇺🇿 O'zbekiston", price: 13500, icon: "fas fa-phone" },
        { id: 49, name: "🇺🇸 Amerika", price: 10000, icon: "fas fa-phone" },
        { id: 50, name: "🇰🇪 Keniya", price: 10000, icon: "fas fa-phone" },
        { id: 51, name: "🇮🇩 Indoneziya", price: 10000, icon: "fas fa-phone" },
        { id: 52, name: "🇧🇩 Bangladesh", price: 10000, icon: "fas fa-phone" }
    ]
};

// GLOBAL CART ARRAY
window.cart = JSON.parse(localStorage.getItem('kents_cart')) || [];

// GLOBAL ADD TO CART FUNCTION
window.addToCart = function(product) {
    console.log('addToCart chaqirildi:', product);
    
    try {
        if (!product || !product.id) {
            console.error('Mahsulot ma\'lumotlari noto\'g\'ri');
            return;
        }
        
        // Matnni tozalash
        const cleanName = product.name.replace(/'/g, "\\'");
        
        let existingItem = window.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            window.cart.push({
                id: product.id,
                name: cleanName,
                price: product.price,
                quantity: 1,
                category: product.category || 'general'
            });
        }
        
        // Saqlash
        localStorage.setItem('kents_cart', JSON.stringify(window.cart));
        
        // Savatni yangilash
        updateCartDisplay();
        
        // Xabarnoma
        showCartNotification(cleanName + ' savatga qo\'shildi!');
        
        console.log('Joriy savat:', window.cart);
        
    } catch (error) {
        console.error('Savatga qo\'shishda xatolik:', error);
        showCartNotification('Xatolik yuz berdi!', 'error');
    }
};

// CART DISPLAY FUNCTION
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// NOTIFICATION FUNCTION
function showCartNotification(message, type = 'success') {
    // Eski bildirishnomani olib tashlash
    const oldNotif = document.querySelector('.cart-notification');
    if (oldNotif) oldNotif.remove();
    
    // Yangi bildirishnoma yaratish
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
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
        background: ${type === 'success' ? '#4cc9f0' : '#ff4757'};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // 3 soniyadan keyin olib tashlash
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// CSS FOR ANIMATIONS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// PRODUCT CARD FUNCTION
function createProductCard(product, category) {
    // Matnni JavaScript string sifatida tozalash
    const escapedName = product.name.replace(/'/g, "\\'");
    
    return `
        <div class="product-card">
            <div class="product-header">
                <i class="${product.icon}"></i>
                <h3 class="product-title">${product.name}</h3>
            </div>
            <div class="product-body">
                <div class="product-price">${product.price.toLocaleString()} UZS</div>
                <button class="btn-buy" onclick="window.addToCart({
                    id: ${product.id},
                    name: '${escapedName}',
                    price: ${product.price},
                    category: '${category}'
                })">
                    <i class="fas fa-cart-plus"></i> Savatga Qo'shish
                </button>
            </div>
        </div>
    `;
}

function createTabs() {
    const gameTabs = document.getElementById('gameTabs');
    if (gameTabs) {
        Object.keys(products).forEach((category, index) => {
            const tabName = getCategoryName(category);
            const tab = document.createElement('button');
            tab.className = `tab-btn ${index === 0 ? 'active' : ''}`;
            tab.textContent = tabName;
            tab.dataset.category = category;
            tab.addEventListener('click', function() {
                document.querySelectorAll('#gameTabs .tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                showProducts(category, 'gameProducts');
            });
            gameTabs.appendChild(tab);
        });
    }
    
    const telegramTabs = document.getElementById('telegramTabs');
    if (telegramTabs) {
        Object.keys(telegramProducts).forEach((category, index) => {
            const tabName = getCategoryName(category);
            const tab = document.createElement('button');
            tab.className = `tab-btn ${index === 0 ? 'active' : ''}`;
            tab.textContent = tabName;
            tab.dataset.category = category;
            tab.addEventListener('click', function() {
                document.querySelectorAll('#telegramTabs .tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                this.classList.add('active');
                showTelegramProducts(category);
            });
            telegramTabs.appendChild(tab);
        });
    }
}

function getCategoryName(category) {
    const names = {
        standoff: 'Standoff 2',
        pubg: 'PUBG UC',
        brawl: 'Brawl Stars',
        mlbb: 'Mobile Legends',
        roblox: 'Roblox',
        premium: 'Telegram Premium',
        stars: 'Telegram Stars',
        numbers: 'Virtual Raqamlar'
    };
    return names[category] || category;
}

function showProducts(category, containerId = 'gameProducts') {
    const container = document.getElementById(containerId);
    const productsList = products[category] || [];
    
    container.innerHTML = productsList
        .map(product => createProductCard(product, category))
        .join('');
}

function showTelegramProducts(category) {
    const container = document.getElementById('telegramProducts');
    const productsList = telegramProducts[category] || [];
    
    container.innerHTML = productsList
        .map(product => createProductCard(product, 'telegram'))
        .join('');
}

// DOM READY
document.addEventListener('DOMContentLoaded', function() {
    console.log('Products.js DOM ready');
    
    createTabs();
    
    if (products.standoff) {
        showProducts('standoff', 'gameProducts');
    }
    
    if (telegramProducts.premium) {
        showTelegramProducts('premium');
    }
    
    // Savatni yangilash
    updateCartDisplay();
    
    // Global funksiyalarni debug
    console.log('addToCart function:', typeof window.addToCart);
    console.log('cart array:', window.cart);
});

// Eski savatni tekshirish
window.addEventListener('load', function() {
    console.log('Yuklandi. Savat holati:', window.cart);
});