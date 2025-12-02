// Admin funksiyalari
class AdminPanel {
    constructor() {
        this.orders = JSON.parse(localStorage.getItem('kents_orders')) || [];
        this.init();
    }
    
    init() {
        console.log('Admin panel yuklandi');
        // Bu yerda admin panel funksiyalari
    }
    
    addOrder(orderData) {
        const order = {
            id: Date.now(),
            ...orderData,
            date: new Date().toISOString(),
            status: 'yangi'
        };
        
        this.orders.push(order);
        localStorage.setItem('kents_orders', JSON.stringify(this.orders));
        return order;
    }
}

// Agar admin sahifada bo'lsa
if (window.location.pathname.includes('admin.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        const adminPanel = new AdminPanel();
        console.log('Admin panel ishga tushdi');
    });
}