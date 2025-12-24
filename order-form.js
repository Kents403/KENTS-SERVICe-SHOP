class OrderForm {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.cart = [];
        this.customerInfo = {};
        this.productType = '';
        this.init();
    }
    
    init() {
        console.log('OrderForm initialized');
        this.loadCart();
        this.setupEventListeners();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.renderForm(), 100);
            });
        } else {
            setTimeout(() => this.renderForm(), 100);
        }
    }
    
    loadCart() {
        try {
            this.cart = JSON.parse(localStorage.getItem('kents_cart')) || [];
            console.log('Loaded cart:', this.cart);
        } catch (error) {
            console.error('Cart load error:', error);
            this.cart = [];
            localStorage.setItem('kents_cart', JSON.stringify([]));
        }
    }
    
    renderForm() {
        const cartModal = document.querySelector('.cart-modal');
        if (!cartModal) return;
        
        const cartFooter = document.querySelector('.cart-footer');
        if (cartFooter) {
            cartFooter.innerHTML = this.getFormHTML();
            this.bindEvents();
            this.updateCartPreview();
            this.updateOrderSummary();
        }
    }
    
    getFormHTML() {
        return `
            <div class="order-form-container" id="orderFormContainer">
                <h3><i class="fas fa-file-alt"></i> Buyurtma ma'lumotlari</h3>
                
                <div class="form-step" id="step1">
                    <div class="step-title"><i class="fas fa-shopping-cart"></i> Savatingiz</div>
                    <div class="product-info" id="cartPreview">
                        <!-- Savat mahsulotlari bu yerda -->
                    </div>
                </div>
                
                <div class="form-step" id="step2" style="display: none;">
                    <div class="step-title"><i class="fas fa-user"></i> Mijoz ma'lumotlari</div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-user-circle"></i> Ismingiz <span class="form-required">*</span></label>
                        <input type="text" id="customerName" placeholder="To'liq ismingizni kiriting" required>
                    </div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-phone"></i> Aloqa usuli <span class="form-required">*</span></label>
                        <select id="contactMethod" required>
                            <option value="">Tanlang</option>
                            <option value="telegram">Telegram (@username)</option>
                            <option value="phone">Telefon raqami</option>
                            <option value="email">Email</option>
                        </select>
                        <div class="form-hint">
                            <i class="fas fa-info-circle"></i> Siz bilan bog'lanish usulini tanlang
                        </div>
                    </div>
                    
                    <div class="form-group" id="telegramField" style="display: none;">
                        <label><i class="fab fa-telegram"></i> Telegram username <span class="form-required">*</span></label>
                        <input type="text" id="telegramUsername" placeholder="@username">
                        <div class="form-hint">
                            <i class="fas fa-info-circle"></i> @ belgisiz kiriting (masalan: john_doe)
                        </div>
                    </div>
                    
                    <div class="form-group" id="phoneField" style="display: none;">
                        <label><i class="fas fa-mobile-alt"></i> Telefon raqami <span class="form-required">*</span></label>
                        <input type="tel" id="phoneNumber" placeholder="+998901234567">
                        <div class="form-hint">
                            <i class="fas fa-info-circle"></i> +998 kodi bilan kiriting
                        </div>
                    </div>
                    
                    <div class="form-group" id="emailField" style="display: none;">
                        <label><i class="fas fa-envelope"></i> Email manzili <span class="form-required">*</span></label>
                        <input type="email" id="emailAddress" placeholder="example@gmail.com">
                    </div>
                </div>
                
                <div class="form-step" id="step3" style="display: none;">
                    <div class="step-title"><i class="fas fa-gamepad"></i> Akkaunt ma'lumotlari</div>
                    
                    <div class="form-group">
                        <label><i class="fas fa-tags"></i> Mahsulot turi <span class="form-required">*</span></label>
                        <select id="productTypeSelect" required>
                            <option value="">Tanlang</option>
                            <option value="game">O'yin donatlari</option>
                            <option value="telegram">Telegram mahsulotlari</option>
                            <option value="crypto">Kriptovalyuta</option>
                        </select>
                    </div>
                    
                    <!-- O'yin akkaunt maydonlari -->
                    <div class="account-type-fields" id="gameFields" style="display: none;">
                        <div class="form-group">
                            <label><i class="fas fa-gamepad"></i> O'yin turi</label>
                            <select id="gameType">
                                <option value="">Tanlang</option>
                                <option value="standoff">Standoff 2</option>
                                <option value="pubg">PUBG Mobile</option>
                                <option value="brawl">Brawl Stars</option>
                                <option value="mlbb">Mobile Legends</option>
                                <option value="roblox">Roblox</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label><i class="fas fa-user"></i> O'yin ID/Email <span class="form-required">*</span></label>
                            <input type="text" id="gameAccount" placeholder="O'yin ID yoki email manzili">
                            <div class="form-hint">
                                <i class="fas fa-info-circle"></i> Donat qayerga yuborilishini kiriting
                            </div>
                        </div>
                    </div>
                    
                    <!-- Telegram akkaunt maydonlari -->
                    <div class="account-type-fields" id="telegramFields" style="display: none;">
                        <div class="form-group">
                            <label><i class="fab fa-telegram"></i> Telegram username <span class="form-required">*</span></label>
                            <input type="text" id="telegramAccount" placeholder="@username">
                            <div class="form-hint">
                                <i class="fas fa-info-circle"></i> Premium yoki Stars qayerga yuborilshini kiriting
                            </div>
                        </div>
                    </div>
                    
                    <!-- Kriptovalyuta maydonlari -->
                    <div class="account-type-fields" id="cryptoFields" style="display: none;">
                        <div class="form-group">
                            <label><i class="fas fa-wallet"></i> Hamyon manzili <span class="form-required">*</span></label>
                            <input type="text" id="cryptoWallet" placeholder="TON/USDT hamyon manzili">
                            <div class="form-hint">
                                <i class="fas fa-info-circle"></i> Kriptovalyuta qayerga yuborilishini kiriting
                            </div>
                        </div>
                    </div>
                    
                    <!-- Izoh maydoni -->
                    <div class="form-group">
                        <label><i class="fas fa-sticky-note"></i> Qo'shimcha izoh (ixtiyoriy)</label>
                        <textarea id="orderNotes" placeholder="Qo'shimcha izohlar, talablar..."></textarea>
                    </div>
                </div>
                
                <div class="order-summary" id="orderSummary">
                    <!-- Buyurtma summasi bu yerda -->
                </div>
                
                <div class="form-buttons">
                    <button type="button" class="btn-back" id="backBtn" style="display: none;">
                        <i class="fas fa-arrow-left"></i> Orqaga
                    </button>
                    <button type="button" class="btn-submit" id="nextBtn">
                        Keyingi <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Aloqa usuli o'zgarishida
        document.getElementById('contactMethod')?.addEventListener('change', (e) => {
            this.toggleContactFields(e.target.value);
        });
        
        // Mahsulot turi o'zgarishida
        document.getElementById('productTypeSelect')?.addEventListener('change', (e) => {
            this.toggleProductFields(e.target.value);
        });
        
        // Orqaga tugmasi
        document.getElementById('backBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.goBack();
        });
        
        // Keyingi tugmasi
        document.getElementById('nextBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.nextStep();
        });
    }
    
    setupEventListeners() {
        // Savat modalini ochganda formani yangilash
        const cartIcon = document.getElementById('cartIcon');
        if (cartIcon) {
            cartIcon.addEventListener('click', () => {
                setTimeout(() => {
                    this.loadCart();
                    this.renderForm();
                    this.showStep(1);
                }, 100);
            });
        }
        
        // Modal yopilganda reset qilish
        const closeCart = document.querySelector('.close-cart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.resetForm();
            });
        }
    }
    
    updateCartPreview() {
        const container = document.getElementById('cartPreview');
        if (!container) return;
        
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <i class="fas fa-shopping-cart" style="font-size: 2rem; margin-bottom: 10px;"></i>
                    <p>Savat bo'sh</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.cart.map(item => {
            const price = item.price || 0;
            const quantity = item.quantity || 1;
            const total = price * quantity;
            
            return `
                <div class="product-item">
                    <div>
                        <div class="product-name">${this.escapeHtml(item.name || 'Mahsulot')}</div>
                        <div class="product-quantity">${price.toLocaleString('uz-UZ')} UZS × ${quantity}</div>
                    </div>
                    <div class="product-total">
                        ${total.toLocaleString('uz-UZ')} UZS
                    </div>
                </div>
            `;
        }).join('');
    }
    
    updateOrderSummary() {
        const container = document.getElementById('orderSummary');
        if (!container) return;
        
        const total = this.calculateTotal();
        
        container.innerHTML = `
            <div class="summary-item">
                <span>Mahsulotlar:</span>
                <span>${this.cart.length} ta</span>
            </div>
            <div class="summary-item">
                <span>Jami summa:</span>
                <span>${total.toLocaleString('uz-UZ')} UZS</span>
            </div>
        `;
    }
    
    calculateTotal() {
        return this.cart.reduce((sum, item) => {
            const price = item.price || 0;
            const quantity = item.quantity || 1;
            return sum + (price * quantity);
        }, 0);
    }
    
    toggleContactFields(method) {
        ['telegramField', 'phoneField', 'emailField'].forEach(id => {
            const field = document.getElementById(id);
            if (field) field.style.display = 'none';
        });
        
        switch(method) {
            case 'telegram':
                const telegramField = document.getElementById('telegramField');
                if (telegramField) telegramField.style.display = 'block';
                break;
            case 'phone':
                const phoneField = document.getElementById('phoneField');
                if (phoneField) phoneField.style.display = 'block';
                break;
            case 'email':
                const emailField = document.getElementById('emailField');
                if (emailField) emailField.style.display = 'block';
                break;
        }
    }
    
    toggleProductFields(type) {
        ['gameFields', 'telegramFields', 'cryptoFields'].forEach(id => {
            const field = document.getElementById(id);
            if (field) field.style.display = 'none';
        });
        
        switch(type) {
            case 'game':
                const gameFields = document.getElementById('gameFields');
                if (gameFields) gameFields.style.display = 'block';
                break;
            case 'telegram':
                const telegramFields = document.getElementById('telegramFields');
                if (telegramFields) telegramFields.style.display = 'block';
                break;
            case 'crypto':
                const cryptoFields = document.getElementById('cryptoFields');
                if (cryptoFields) cryptoFields.style.display = 'block';
                break;
        }
    }
    
    showStep(step) {
        for (let i = 1; i <= this.totalSteps; i++) {
            const stepElement = document.getElementById(`step${i}`);
            if (stepElement) stepElement.style.display = 'none';
        }
        
        const currentStepElement = document.getElementById(`step${step}`);
        if (currentStepElement) currentStepElement.style.display = 'block';
        
        this.updateButtons(step);
    }
    
    updateButtons(step) {
        const backBtn = document.getElementById('backBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (!backBtn || !nextBtn) return;
        
        if (step === 1) {
            backBtn.style.display = 'none';
        } else {
            backBtn.style.display = 'flex';
        }
        
        if (step === this.totalSteps) {
            nextBtn.innerHTML = `
                <span class="loading" id="loadingIndicator" style="display: none;">
                    <i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...
                </span>
                <span id="submitText">
                    <i class="fab fa-telegram"></i> Telegramga yuborish
                </span>
            `;
        } else {
            nextBtn.innerHTML = `Keyingi <i class="fas fa-arrow-right"></i>`;
        }
    }
    
    nextStep() {
        if (!this.validateStep(this.currentStep)) {
            return;
        }
        
        this.saveStepData(this.currentStep);
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.showStep(this.currentStep);
        } else {
            this.submitOrder();
        }
    }
    
    goBack() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.showStep(this.currentStep);
        }
    }
    
    validateStep(step) {
        switch(step) {
            case 1:
                if (this.cart.length === 0) {
                    this.showNotification('❌ Iltimos, avval mahsulot tanlang!', 'error');
                    return false;
                }
                return true;
                
            case 2:
                const name = document.getElementById('customerName')?.value.trim() || '';
                const contactMethod = document.getElementById('contactMethod')?.value || '';
                
                if (!name) {
                    this.showNotification('❌ Iltimos, ismingizni kiriting!', 'error');
                    return false;
                }
                
                if (!contactMethod) {
                    this.showNotification('❌ Iltimos, aloqa usulini tanlang!', 'error');
                    return false;
                }
                
                let contactValid = false;
                switch(contactMethod) {
                    case 'telegram':
                        const telegram = document.getElementById('telegramUsername')?.value.trim() || '';
                        contactValid = telegram.length > 2;
                        if (!contactValid) {
                            this.showNotification('❌ Iltimos, Telegram username kiriting!', 'error');
                        }
                        break;
                    case 'phone':
                        const phone = document.getElementById('phoneNumber')?.value.trim() || '';
                        contactValid = phone.length >= 9 && phone.includes('+998');
                        if (!contactValid) {
                            this.showNotification('❌ Iltimos, to\'g\'ri telefon raqam kiriting!', 'error');
                        }
                        break;
                    case 'email':
                        const email = document.getElementById('emailAddress')?.value.trim() || '';
                        contactValid = email.includes('@') && email.includes('.') && email.length > 5;
                        if (!contactValid) {
                            this.showNotification('❌ Iltimos, to\'g\'ri email manzil kiriting!', 'error');
                        }
                        break;
                }
                
                return contactValid;
                
            case 3:
                const productType = document.getElementById('productTypeSelect')?.value || '';
                if (!productType) {
                    this.showNotification('❌ Iltimos, mahsulot turini tanlang!', 'error');
                    return false;
                }
                
                let accountValid = false;
                switch(productType) {
                    case 'game':
                        const gameAccount = document.getElementById('gameAccount')?.value.trim() || '';
                        accountValid = gameAccount.length > 0;
                        if (!accountValid) {
                            this.showNotification('❌ Iltimos, o\'yin akkauntini kiriting!', 'error');
                        }
                        break;
                    case 'telegram':
                        const telegramAccount = document.getElementById('telegramAccount')?.value.trim() || '';
                        accountValid = telegramAccount.length > 0;
                        if (!accountValid) {
                            this.showNotification('❌ Iltimos, Telegram akkauntini kiriting!', 'error');
                        }
                        break;
                    case 'crypto':
                        const cryptoWallet = document.getElementById('cryptoWallet')?.value.trim() || '';
                        accountValid = cryptoWallet.length > 0;
                        if (!accountValid) {
                            this.showNotification('❌ Iltimos, kripto hamyon manzilini kiriting!', 'error');
                        }
                        break;
                }
                
                return accountValid;
                
            default:
                return true;
        }
    }
    
    saveStepData(step) {
        switch(step) {
            case 2:
                this.customerInfo.name = document.getElementById('customerName')?.value.trim() || '';
                this.customerInfo.contactMethod = document.getElementById('contactMethod')?.value || '';
                
                switch(this.customerInfo.contactMethod) {
                    case 'telegram':
                        const telegramUser = document.getElementById('telegramUsername')?.value.trim() || '';
                        this.customerInfo.contact = telegramUser.startsWith('@') ? telegramUser : '@' + telegramUser;
                        break;
                    case 'phone':
                        this.customerInfo.contact = document.getElementById('phoneNumber')?.value.trim() || '';
                        break;
                    case 'email':
                        this.customerInfo.contact = document.getElementById('emailAddress')?.value.trim() || '';
                        break;
                }
                break;
                
            case 3:
                this.productType = document.getElementById('productTypeSelect')?.value || '';
                this.customerInfo.notes = document.getElementById('orderNotes')?.value.trim() || '';
                
                switch(this.productType) {
                    case 'game':
                        this.customerInfo.gameType = document.getElementById('gameType')?.value || '';
                        this.customerInfo.gameAccount = document.getElementById('gameAccount')?.value.trim() || '';
                        break;
                    case 'telegram':
                        const telegramAccount = document.getElementById('telegramAccount')?.value.trim() || '';
                        this.customerInfo.telegramAccount = telegramAccount.startsWith('@') ? telegramAccount.substring(1) : telegramAccount;
                        break;
                    case 'crypto':
                        this.customerInfo.cryptoWallet = document.getElementById('cryptoWallet')?.value.trim() || '';
                        break;
                }
                break;
        }
    }
    
    async submitOrder() {
        const loading = document.getElementById('loadingIndicator');
        const submitText = document.getElementById('submitText');
        
        if (loading && submitText) {
            loading.style.display = 'inline-flex';
            submitText.style.display = 'none';
        }
        
        try {
            const orderId = 'KENT-' + Date.now().toString().slice(-8);
            const total = this.calculateTotal();
            
            const orderData = {
                id: orderId,
                customerName: this.customerInfo.name,
                customerContact: this.customerInfo.contact,
                contactMethod: this.customerInfo.contactMethod,
                productType: this.productType,
                gameType: this.customerInfo.gameType,
                gameAccount: this.customerInfo.gameAccount,
                telegramAccount: this.customerInfo.telegramAccount,
                cryptoWallet: this.customerInfo.cryptoWallet,
                items: this.cart,
                total: total,
                notes: this.customerInfo.notes,
                status: 'yangi',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                history: [{
                    status: 'yangi',
                    date: new Date().toISOString(),
                    message: 'Buyurtma yaratildi'
                }]
            };
            
            // BUYURTMALAR YANGI ADMINGA (@kentservice_admin) - URL TO'G'RILANDI
            this.sendOrderToTelegram(orderData);
            
            if (window.orderSync) {
                window.orderSync.saveToSync(orderData);
            }
            
            if (window.orderTracker) {
                window.orderTracker.createOrder(
                    orderData.customerName,
                    orderData.customerContact,
                    orderData.items,
                    orderData.total,
                    orderData.notes
                );
            }
            
            this.showNotification(`✅ Buyurtma #${orderId} Telegramga yuborildi!`);
            
            setTimeout(() => {
                this.cart = [];
                localStorage.setItem('kents_cart', JSON.stringify([]));
                
                const cartModal = document.querySelector('.cart-modal');
                if (cartModal) cartModal.style.display = 'none';
                
                this.resetForm();
            }, 2000);
            
        } catch (error) {
            console.error('Order submission error:', error);
            this.showNotification('❌ Xatolik yuz berdi! Telegram admin bilan bog\'laning.', 'error');
        } finally {
            if (loading && submitText) {
                loading.style.display = 'none';
                submitText.style.display = 'inline';
            }
        }
    }
    
    sendOrderToTelegram(orderData) {
        try {
            let message = `🆕 *YANGI BUYURTMA* #${orderData.id}\n\n`;
            
            message += `👤 *Mijoz:* ${orderData.customerName}\n`;
            message += `📞 *Aloqa:* ${orderData.customerContact} (${orderData.contactMethod})\n\n`;
            
            message += `🏷 *Mahsulot turi:* ${this.getProductTypeText(orderData.productType)}\n`;
            
            if (orderData.gameType) {
                message += `🎮 *O'yin turi:* ${this.getGameTypeText(orderData.gameType)}\n`;
            }
            
            if (orderData.gameAccount) {
                message += `🔐 *O'yin akkaunti:* ${orderData.gameAccount}\n`;
            }
            if (orderData.telegramAccount) {
                message += `📱 *Telegram akkaunti:* @${orderData.telegramAccount}\n`;
            }
            if (orderData.cryptoWallet) {
                message += `💰 *Kripto hamyon:* ${orderData.cryptoWallet}\n`;
            }
            
            message += `\n📦 *Mahsulotlar:*\n`;
            orderData.items.forEach((item, index) => {
                const price = item.price || 0;
                const quantity = item.quantity || 1;
                message += `${index + 1}. ${item.name} - ${quantity} dona (${(price * quantity).toLocaleString('uz-UZ')} UZS)\n`;
            });
            
            message += `\n💰 *Jami summa:* ${orderData.total.toLocaleString('uz-UZ')} UZS\n`;
            
            if (orderData.notes) {
                message += `\n📝 *Mijoz izohi:* ${orderData.notes}\n`;
            }
            
            message += `\n📅 *Sana:* ${new Date().toLocaleString('uz-UZ')}\n`;
            message += `📍 *Manzil:* ${window.location.href}\n`;
            message += `⚡ *Xizmat:* KENTS SERVICE`;
            
            // ✅ BUYURTMALAR YANGI ADMINGA (@kentservice_admin) - URL BIR XIL
            const telegramUrl = `https://t.me/kentservice_admin?text=${encodeURIComponent(message)}`;
            
            window.open(telegramUrl, '_blank');
            
        } catch (error) {
            console.error('Telegram send error:', error);
            throw error;
        }
    }
    
    getProductTypeText(type) {
        const types = {
            'game': '🎮 O\'yin donatlari',
            'telegram': '📱 Telegram mahsulotlari',
            'crypto': '💰 Kriptovalyuta'
        };
        return types[type] || type;
    }
    
    getGameTypeText(type) {
        const games = {
            'standoff': 'Standoff 2',
            'pubg': 'PUBG Mobile',
            'brawl': 'Brawl Stars',
            'mlbb': 'Mobile Legends',
            'roblox': 'Roblox'
        };
        return games[type] || type;
    }
    
    showNotification(message, type = 'success') {
        const oldNotif = document.querySelector('.order-notification');
        if (oldNotif) oldNotif.remove();
        
        const notification = document.createElement('div');
        notification.className = 'order-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4cc9f0' : '#ff4757'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        `;
        
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${this.escapeHtml(message)}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    resetForm() {
        this.currentStep = 1;
        this.customerInfo = {};
        this.productType = '';
        
        const formContainer = document.getElementById('orderFormContainer');
        if (formContainer) {
            formContainer.remove();
        }
        
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            cartCount.textContent = '0';
        }
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

window.OrderForm = OrderForm;

document.addEventListener('DOMContentLoaded', () => {
    window.orderForm = new OrderForm();
});