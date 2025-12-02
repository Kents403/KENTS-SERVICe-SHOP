// ===== BUYURTMA KUZATISH TIZIMI =====
class OrderTracker {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('kents_orders')) || [];
        this.init();
    }
    
    init() {
        console.log('Buyurtma kuzatish tizimi ishga tushdi');
    }
    
    // ===== YANGI BUYURTMA =====
    createOrder(customerName, customerPhone, items, total, notes = '') {
        const orderId = 'KENT-' + Date.now().toString().slice(-6);
        
        const order = {
            id: orderId,
            customerName: customerName,
            customerPhone: customerPhone,
            items: items,
            total: total,
            notes: notes,
            status: 'yangi', // yangi → qabul_qilindi → jarayonda → tayyor → yetkazildi → yakunlandi
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            history: [{
                status: 'yangi',
                date: new Date().toISOString(),
                message: 'Buyurtma yaratildi'
            }]
        };
        
        this.orders.unshift(order); // Yangi buyurtma ro'yxat boshiga
        this.saveOrders();
        
        // Telegram admin ga xabar
        this.sendToTelegram(order);
        
        return order;
    }
    
    // ===== STATUS O'ZGARTIRISH =====
    updateStatus(orderId, newStatus, message = '') {
        const order = this.orders.find(o => o.id === orderId);
        
        if (!order) {
            console.error('Buyurtma topilmadi:', orderId);
            return false;
        }
        
        const oldStatus = order.status;
        order.status = newStatus;
        order.updatedAt = new Date().toISOString();
        
        // Tarixga qo'shish
        order.history.push({
            status: newStatus,
            date: new Date().toISOString(),
            message: message || `Status ${oldStatus} dan ${newStatus} ga o'zgartirildi`
        });
        
        this.saveOrders();
        
        // Mijozga Telegram xabar (agar telefon raqam bo'lsa)
        if (order.customerPhone && order.customerPhone.startsWith('@')) {
            this.notifyCustomer(order, newStatus);
        }
        
        return true;
    }
    
    // ===== BUYURTMALARNI FILTRLASH =====
    getOrders(filter = {}) {
        let filtered = [...this.orders];
        
        // Status bo'yicha filtr
        if (filter.status) {
            filtered = filtered.filter(o => o.status === filter.status);
        }
        
        // Sana bo'yicha filtr
        if (filter.date) {
            const date = new Date(filter.date).toDateString();
            filtered = filtered.filter(o => 
                new Date(o.createdAt).toDateString() === date
            );
        }
        
        // Mijoz nomi bo'yicha qidirish
        if (filter.search) {
            const searchTerm = filter.search.toLowerCase();
            filtered = filtered.filter(o => 
                o.customerName.toLowerCase().includes(searchTerm) ||
                o.id.toLowerCase().includes(searchTerm) ||
                o.customerPhone.toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }
    
    // ===== TELEGRAMGA XABAR =====
    sendToTelegram(order) {
        let message = `🆕 *YANGI BUYURTMA* #${order.id}\n\n`;
        message += `👤 *Mijoz:* ${order.customerName}\n`;
        message += `📞 *Telefon:* ${order.customerPhone}\n`;
        message += `💰 *Jami:* ${order.total.toLocaleString()} UZS\n`;
        message += `📅 *Sana:* ${new Date(order.createdAt).toLocaleDateString('uz-UZ')}\n`;
        message += `⏰ *Vaqt:* ${new Date(order.createdAt).toLocaleTimeString('uz-UZ')}\n\n`;
        message += `📦 *Mahsulotlar:*\n`;
        
        order.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name} - ${item.quantity} × ${item.price.toLocaleString()} UZS\n`;
        });
        
        if (order.notes) {
            message += `\n📝 *Izoh:* ${order.notes}`;
        }
        
        // Admin Telegram guruhiga yuborish
        const telegramUrl = `https://t.me/kentservice_support?text=${encodeURIComponent(message)}`;
        
        // Yangi oynada ochish (admin uchun)
        setTimeout(() => {
            window.open(telegramUrl, '_blank');
        }, 1000);
        
        return message;
    }
    
    // ===== MIJOZGA XABAR =====
    notifyCustomer(order, newStatus) {
        const statusMessages = {
            'qabul_qilindi': '✅ Buyurtmangiz qabul qilindi va tez orada boshlanadi.',
            'jarayonda': '⚙️ Buyurtmangiz qayta ishlanmoqda. 5-15 daqiqa ichida tayyor bo\'ladi.',
            'tayyor': '🎉 Buyurtmangiz tayyor! Tez orada yetkazib beriladi.',
            'yetkazildi': '🚚 Buyurtmangiz yetkazib berildi! Rahmat.',
            'yakunlandi': '🏁 Buyurtmangiz muvaffaqiyatli yakunlandi. Yana kutib qolamiz!'
        };
        
        const message = statusMessages[newStatus];
        if (message && order.customerPhone.startsWith('@')) {
            const customerMessage = `🔄 Buyurtma #${order.id} holati:\n\n${message}\n\n📊 Holatni kuzatish: kents-service.uz/track?id=${order.id}`;
            const telegramUrl = `https://t.me/${order.customerPhone.slice(1)}?text=${encodeURIComponent(customerMessage)}`;
            
            // Yangi oynada ochish
            window.open(telegramUrl, '_blank');
        }
    }
    
    // ===== SAQLASH =====
    saveOrders() {
        localStorage.setItem('kents_orders', JSON.stringify(this.orders));
    }
    
    // ===== STATISTIKA =====
    getStats() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        
        // Bugungi buyurtmalar
        const todayOrders = this.orders.filter(o => 
            new Date(o.createdAt) >= today
        );
        
        // Haftalik buyurtmalar
        const weeklyOrders = this.orders.filter(o => 
            new Date(o.createdAt) >= weekAgo
        );
        
        // Oylik buyurtmalar
        const monthlyOrders = this.orders.filter(o => 
            new Date(o.createdAt) >= monthAgo
        );
        
        // Statuslar bo'yicha
        const statusCounts = {
            yangi: this.orders.filter(o => o.status === 'yangi').length,
            qabul_qilindi: this.orders.filter(o => o.status === 'qabul_qilindi').length,
            jarayonda: this.orders.filter(o => o.status === 'jarayonda').length,
            tayyor: this.orders.filter(o => o.status === 'tayyor').length,
            yetkazildi: this.orders.filter(o => o.status === 'yetkazildi').length,
            yakunlandi: this.orders.filter(o => o.status === 'yakunlandi').length
        };
        
        // Daromad
        const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
        const weeklyRevenue = weeklyOrders.reduce((sum, o) => sum + o.total, 0);
        const monthlyRevenue = monthlyOrders.reduce((sum, o) => sum + o.total, 0);
        const totalRevenue = this.orders.reduce((sum, o) => sum + o.total, 0);
        
        // Mashhur mahsulotlar
        const popularProducts = this.getPopularProducts();
        
        return {
            totalOrders: this.orders.length,
            totalRevenue: totalRevenue,
            today: {
                orders: todayOrders.length,
                revenue: todayRevenue
            },
            weekly: {
                orders: weeklyOrders.length,
                revenue: weeklyRevenue
            },
            monthly: {
                orders: monthlyOrders.length,
                revenue: monthlyRevenue
            },
            statusCounts: statusCounts,
            popularProducts: popularProducts
        };
    }
    
    // ===== MASHHUR MAHSULOTLAR =====
    getPopularProducts() {
        const productMap = {};
        
        this.orders.forEach(order => {
            order.items.forEach(item => {
                if (!productMap[item.name]) {
                    productMap[item.name] = {
                        name: item.name,
                        quantity: 0,
                        revenue: 0
                    };
                }
                productMap[item.name].quantity += item.quantity;
                productMap[item.name].revenue += item.price * item.quantity;
            });
        });
        
        return Object.values(productMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 10); // Top 10 mahsulot
    }
    
    // ===== MIJOZLAR STATISTIKASI =====
    getCustomerStats() {
        const customerMap = {};
        
        this.orders.forEach(order => {
            const key = order.customerPhone || order.customerName;
            if (!customerMap[key]) {
                customerMap[key] = {
                    name: order.customerName,
                    phone: order.customerPhone,
                    orders: 0,
                    totalSpent: 0,
                    lastOrder: order.createdAt
                };
            }
            customerMap[key].orders += 1;
            customerMap[key].totalSpent += order.total;
            customerMap[key].lastOrder = order.createdAt;
        });
        
        return Object.values(customerMap)
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 20); // Top 20 mijoz
    }
}

// Global order tracker
window.OrderTracker = OrderTracker;
window.orderTracker = new OrderTracker();