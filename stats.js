// ===== STATISTIKA VIZUALIZATSIYASI =====
class StatsDashboard {
    constructor() {
        this.statsContainer = null;
        this.init();
    }
    
    init() {
        console.log('Statistika dashboard yuklandi');
    }
    
    // ===== STATISTIKANI KO'RSATISH =====
    renderStats(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        this.statsContainer = container;
        const stats = window.orderTracker.getStats();
        
        container.innerHTML = `
            <div class="stats-grid">
                <!-- Umumiy statistikalar -->
                <div class="stat-card total">
                    <div class="stat-icon">📊</div>
                    <div class="stat-value">${stats.totalOrders}</div>
                    <div class="stat-label">Jami Buyurtma</div>
                </div>
                
                <div class="stat-card revenue">
                    <div class="stat-icon">💰</div>
                    <div class="stat-value">${stats.totalRevenue.toLocaleString()} UZS</div>
                    <div class="stat-label">Jami Daromad</div>
                </div>
                
                <div class="stat-card today">
                    <div class="stat-icon">📅</div>
                    <div class="stat-value">${stats.today.orders}</div>
                    <div class="stat-label">Bugungi Buyurtma</div>
                    <div class="stat-sub">${stats.today.revenue.toLocaleString()} UZS</div>
                </div>
                
                <div class="stat-card weekly">
                    <div class="stat-icon">📈</div>
                    <div class="stat-value">${stats.weekly.orders}</div>
                    <div class="stat-label">Haftalik Buyurtma</div>
                    <div class="stat-sub">${stats.weekly.revenue.toLocaleString()} UZS</div>
                </div>
                
                <!-- Status statistikasi -->
                <div class="stat-card wide status-stats">
                    <h3>📊 Buyurtma Holatlari</h3>
                    <div class="status-grid">
                        <div class="status-item new">
                            <span class="status-dot"></span>
                            <span class="status-name">Yangi</span>
                            <span class="status-count">${stats.statusCounts.yangi}</span>
                        </div>
                        <div class="status-item processing">
                            <span class="status-dot"></span>
                            <span class="status-name">Jarayonda</span>
                            <span class="status-count">${stats.statusCounts.jarayonda}</span>
                        </div>
                        <div class="status-item ready">
                            <span class="status-dot"></span>
                            <span class="status-name">Tayyor</span>
                            <span class="status-count">${stats.statusCounts.tayyor}</span>
                        </div>
                        <div class="status-item completed">
                            <span class="status-dot"></span>
                            <span class="status-name">Yakunlangan</span>
                            <span class="status-count">${stats.statusCounts.yakunlandi}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Mashhur mahsulotlar -->
                <div class="stat-card wide popular-products">
                    <h3>🏆 Mashhur Mahsulotlar</h3>
                    <div class="products-list">
                        ${this.renderPopularProducts(stats.popularProducts)}
                    </div>
                </div>
                
                <!-- Mijozlar statistikasi -->
                <div class="stat-card wide customers">
                    <h3>👥 Top Mijozlar</h3>
                    <div class="customers-list">
                        ${this.renderTopCustomers(stats)}
                    </div>
                </div>
            </div>
        `;
    }
    
    // ===== MASHHUR MAHSULOTLAR =====
    renderPopularProducts(products) {
        if (!products || products.length === 0) {
            return '<p class="empty">Hozircha ma\'lumot yo\'q</p>';
        }
        
        return products.map((product, index) => `
            <div class="product-item">
                <span class="product-rank">${index + 1}</span>
                <span class="product-name">${product.name}</span>
                <span class="product-quantity">${product.quantity} dona</span>
                <span class="product-revenue">${product.revenue.toLocaleString()} UZS</span>
            </div>
        `).join('');
    }
    
    // ===== TOP MIJOZLAR =====
    renderTopCustomers(stats) {
        const customers = window.orderTracker.getCustomerStats();
        
        if (!customers || customers.length === 0) {
            return '<p class="empty">Hozircha ma\'lumot yo\'q</p>';
        }
        
        return customers.slice(0, 5).map((customer, index) => `
            <div class="customer-item">
                <span class="customer-rank">${index + 1}</span>
                <div class="customer-info">
                    <span class="customer-name">${customer.name}</span>
                    <span class="customer-phone">${customer.phone || 'Noma\'lum'}</span>
                </div>
                <div class="customer-stats">
                    <span class="customer-orders">${customer.orders} buyurtma</span>
                    <span class="customer-spent">${customer.totalSpent.toLocaleString()} UZS</span>
                </div>
            </div>
        `).join('');
    }
    
    // ===== STATISTIKANI YANGILASH =====
    updateStats() {
        if (this.statsContainer) {
            this.renderStats(this.statsContainer.id);
        }
    }
}

// Global stats dashboard
window.StatsDashboard = StatsDashboard;
window.statsDashboard = new StatsDashboard();