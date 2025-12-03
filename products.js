    // ===== MAHSULOTLAR =====
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
            { id: 19, name: "950 Gem", price: 346999, icon: "fas fa-gem" }
        ],
        
        mlbb: [
            { id: 20, name: "35 Almaz", price: 11111, icon: "fas fa-gem" },
            { id: 21, name: "88 Almaz", price: 18888, icon: "fas fa-gem" },
            { id: 22, name: "132 Almaz", price: 28888, icon: "fas fa-gem" },
            { id: 23, name: "264 Almaz", price: 48888, icon: "fas fa-gem" },
            { id: 24, name: "440 Almaz", price: 79999, icon: "fas fa-gem" }
        ],
        
        roblox: [
            { id: 25, name: "40 Robux", price: 13000, icon: "fas fa-cube" },
            { id: 26, name: "80 Robux", price: 22000, icon: "fas fa-cube" },
            { id: 27, name: "160 Robux", price: 40000, icon: "fas fa-cube" },
            { id: 28, name: "240 Robux", price: 53000, icon: "fas fa-cube" },
            { id: 29, name: "400 Robux", price: 83000, icon: "fas fa-cube" }
        ]
    };

    const telegramProducts = {
        premium: [
            { id: 30, name: "Premium 1oy (Kirib)", price: 45000, icon: "fab fa-telegram" },
            { id: 31, name: "Premium 1yil (Kirib)", price: 307000, icon: "fab fa-telegram" },
            { id: 32, name: "Premium 3oy (Kirmasda)", price: 173000, icon: "fab fa-telegram" },
            { id: 33, name: "Premium 6oy (Kirmasda)", price: 233000, icon: "fab fa-telegram" },
            { id: 34, name: "Premium 1yil (Kirmasda)", price: 402000, icon: "fab fa-telegram" }
        ],
        
        stars: [
            { id: 35, name: "50 Stars", price: 11750, icon: "fas fa-star" },
            { id: 36, name: "100 Stars", price: 23500, icon: "fas fa-star" },
            { id: 37, name: "200 Stars", price: 47000, icon: "fas fa-star" },
            { id: 38, name: "500 Stars", price: 117500, icon: "fas fa-star" }
        ],
        
        numbers: [
            { id: 39, name: "🇺🇿 O'zbekiston", price: 15000, icon: "fas fa-phone" },
            { id: 40, name: "🇺🇸 Amerika", price: 11500, icon: "fas fa-phone" },
            { id: 41, name: "🇰🇪 Keniya", price: 11000, icon: "fas fa-phone" },
            { id: 42, name: "🇮🇩 Indoneziya", price: 10000, icon: "fas fa-phone" },
            { id: 43, name: "🇧🇩 Bangladesh", price: 10000, icon: "fas fa-phone" }
        ]
    };

    // ===== TABLAR =====
    function createTabs() {
        // O'yin donatlari tablari
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
        
        // Telegram tablari
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

    // ===== MAHSULOTLARNI KO'RSATISH =====
    function createProductCard(product, category) {
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
                        name: '${product.name}',
                        price: ${product.price},
                        category: '${category}'
                    })">
                        <i class="fas fa-cart-plus"></i> Savatga Qo'shish
                    </button>
                </div>
            </div>
        `;
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

    // ===== YUKLASH =====
    document.addEventListener('DOMContentLoaded', function() {
        createTabs();
        
        if (products.standoff) {
            showProducts('standoff', 'gameProducts');
        }
        
        if (telegramProducts.premium) {
            showTelegramProducts('premium');
        }
    });