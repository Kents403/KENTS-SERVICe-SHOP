class OrderSync {
    constructor() {
        this.STORAGE_KEY = 'kents_all_orders';
        this.DEVICE_ID = this.generateDeviceId();
        this.init();
    }
    
    init() {
        console.log('OrderSync initialized for device:', this.DEVICE_ID);
        this.syncOrders();
        
        setInterval(() => this.syncOrders(), 30000);
    }
    
    generateDeviceId() {
        let deviceId = localStorage.getItem('kents_device_id');
        if (!deviceId) {
            deviceId = 'DEV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('kents_device_id', deviceId);
        }
        return deviceId;
    }
    
    syncOrders() {
        try {
            const localOrders = window.orderTracker?.getOrders() || [];
            const syncedOrders = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
            const allOrders = this.mergeOrders(localOrders, syncedOrders);
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allOrders));
            
            if (window.orderTracker) {
                window.orderTracker.orders = allOrders;
                window.orderTracker.saveOrders();
            }
            
            console.log('Orders synced. Total:', allOrders.length);
            return allOrders;
            
        } catch (error) {
            console.error('Sync error:', error);
            return [];
        }
    }
    
    mergeOrders(orders1, orders2) {
        const merged = [...orders1];
        const existingIds = new Set(orders1.map(o => o.id));
        
        orders2.forEach(order => {
            if (!existingIds.has(order.id)) {
                merged.push(order);
                existingIds.add(order.id);
            }
        });
        
        return merged.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.date || 0);
            const dateB = new Date(b.createdAt || b.date || 0);
            return dateB - dateA;
        });
    }
    
    sendOrderToAll(orderData) {
        orderData.deviceId = this.DEVICE_ID;
        orderData.deviceType = this.getDeviceType();
        orderData.syncDate = new Date().toISOString();
        
        this.saveToSync(orderData);
        this.sendEmail(orderData);
        this.sendTelegram(orderData);
        
        return orderData;
    }
    
    sendEmail(orderData) {
        try {
            const email = 'kents.service@gmail.com';
            const subject = `📦 Yangi Buyurtma #${orderData.id}`;
            const body = `
Buyurtma ma'lumotlari:

ID: ${orderData.id}
Mijoz: ${orderData.customerName}
Telefon: ${orderData.customerContact || orderData.customerPhone}
Summa: ${orderData.total.toLocaleString()} UZS
Sana: ${new Date().toLocaleString('uz-UZ')}
Qurilma: ${orderData.deviceType} (${orderData.deviceId})

Mahsulotlar:
${orderData.items.map((item, i) => `${i+1}. ${item.name} - ${item.quantity} dona`).join('\n')}

Mahsulot turi: ${orderData.productType}
${orderData.gameAccount ? `O'yin akkaunti: ${orderData.gameAccount} (${orderData.gameType})` : ''}
${orderData.telegramAccount ? `Telegram akkaunti: @${orderData.telegramAccount}` : ''}
${orderData.cryptoWallet ? `Kripto hamyon: ${orderData.cryptoWallet}` : ''}

${orderData.notes ? `Izoh: ${orderData.notes}` : ''}

Manzil: ${window.location.href}
            `;
            
            const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            setTimeout(() => {
                window.open(mailtoLink, '_blank');
            }, 500);
            
        } catch (error) {
            console.error('Email error:', error);
        }
    }
    
    sendTelegram(orderData) {
        try {
            let message = `🆕 *YANGI BUYURTMA* #${orderData.id}\n\n`;
            message += `👤 *Mijoz:* ${orderData.customerName}\n`;
            message += `📞 *Aloqa:* ${orderData.customerContact || orderData.customerPhone}\n`;
            message += `💰 *Jami:* ${orderData.total.toLocaleString()} UZS\n`;
            message += `📱 *Qurilma:* ${orderData.deviceType}\n\n`;
            
            if (orderData.productType) {
                message += `🏷 *Mahsulot turi:* ${orderData.productType}\n`;
            }
            
            if (orderData.gameAccount) {
                message += `🎮 *O'yin akkaunti:* ${orderData.gameAccount} (${orderData.gameType || 'O\'yin'})\n`;
            }
            
            if (orderData.telegramAccount) {
                message += `📱 *Telegram akkaunti:* @${orderData.telegramAccount}\n`;
            }
            
            if (orderData.cryptoWallet) {
                message += `💰 *Kripto hamyon:* ${orderData.cryptoWallet}\n`;
            }
            
            message += `\n📦 *Mahsulotlar:*\n`;
            orderData.items.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - ${item.quantity} dona\n`;
            });
            
            if (orderData.notes) {
                message += `\n📝 *Mijoz izohi:* ${orderData.notes}\n`;
            }
            
            message += `\n📅 *Sana:* ${new Date().toLocaleString('uz-UZ')}`;
            
            // ✅ BUYURTMALAR YANGI ADMINGA (@kentservice_admin)
            const telegramUrl = `https://t.me/kentservice_admin?text=${encodeURIComponent(message)}`;
            
            setTimeout(() => {
                window.open(telegramUrl, '_blank');
            }, 1000);
            
        } catch (error) {
            console.error('Telegram error:', error);
        }
    }
    
    saveToSync(orderData) {
        try {
            const orders = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
            orders.unshift(orderData);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
        } catch (error) {
            console.error('Save error:', error);
        }
    }
    
    getDeviceType() {
        const ua = navigator.userAgent.toLowerCase();
        if (/mobile|android|iphone|ipod/.test(ua)) return '📱 Mobile';
        if (/tablet|ipad/.test(ua)) return '📟 Tablet';
        return '💻 Desktop';
    }
    
    getAllOrders() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    }
    
    getOrderById(orderId) {
        const orders = this.getAllOrders();
        return orders.find(order => order.id === orderId);
    }
    
    getOrdersByCustomer(phone) {
        const orders = this.getAllOrders();
        return orders.filter(order => 
            (order.customerContact && order.customerContact.toLowerCase().includes(phone.toLowerCase())) ||
            (order.customerPhone && order.customerPhone.toLowerCase().includes(phone.toLowerCase()))
        );
    }
    
    getSyncStats() {
        const orders = this.getAllOrders();
        const byDevice = {};
        
        orders.forEach(order => {
            const device = order.deviceType || 'Noma\'lum';
            if (!byDevice[device]) {
                byDevice[device] = 0;
            }
            byDevice[device]++;
        });
        
        return {
            totalOrders: orders.length,
            byDevice: byDevice,
            lastSync: new Date().toLocaleString('uz-UZ')
        };
    }
}

window.OrderSync = OrderSync;
window.orderSync = new OrderSync();