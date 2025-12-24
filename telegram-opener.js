// telegram-opener.js - Barcha qurilmalar uchun universal Telegram ochish
class TelegramOpener {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('Telegram Opener loaded');
    }
    
    openTelegram(message, phone = '') {
        // ✅ BUYURTMALAR YANGI ADMINGA (@kentservice_admin)
        let telegramUrl = `https://t.me/kentservice_admin`;
        
        if (message) {
            telegramUrl += `?text=${encodeURIComponent(message)}`;
        }
        
        console.log('Opening Telegram:', telegramUrl);
        
        const device = this.detectDevice();
        
        switch(device) {
            case 'ios':
                return this.openIOS(telegramUrl, message);
            case 'android':
                return this.openAndroid(telegramUrl);
            case 'desktop':
                return this.openDesktop(telegramUrl);
            default:
                return this.openUniversal(telegramUrl, message);
        }
    }
    
    detectDevice() {
        const ua = navigator.userAgent;
        
        if (/iPhone|iPad|iPod/.test(ua)) {
            return 'ios';
        } else if (/Android/.test(ua)) {
            return 'android';
        } else if (/Windows|Mac|Linux/.test(ua) && !/Mobile/.test(ua)) {
            return 'desktop';
        } else {
            return 'unknown';
        }
    }
    
    openIOS(url, message) {
        console.log('iOS device detected');
        
        this.showIOSModal(url, message);
        
        setTimeout(() => {
            this.openLinkInBackground(url);
        }, 100);
        
        return true;
    }
    
    openAndroid(url) {
        console.log('Android device detected');
        
        try {
            window.open(url, '_blank', 'noopener,noreferrer');
            
            setTimeout(() => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = url;
                document.body.appendChild(iframe);
                setTimeout(() => document.body.removeChild(iframe), 1000);
            }, 500);
            
        } catch (error) {
            console.error('Android error:', error);
            window.location.href = url;
        }
        
        return true;
    }
    
    openDesktop(url) {
        console.log('Desktop device detected');
        
        window.open(url, '_blank', 'noopener,noreferrer,width=800,height=600');
        return true;
    }
    
    openUniversal(url, message) {
        console.log('Universal method');
        
        try {
            const newTab = window.open('', '_blank');
            if (newTab) {
                newTab.location = url;
            } else {
                window.location.href = url;
            }
        } catch (error) {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            document.body.appendChild(iframe);
            setTimeout(() => {
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            }, 3000);
        }
        
        return true;
    }
    
    showIOSModal(url, message) {
        const oldModal = document.getElementById('iosTelegramModal');
        if (oldModal) oldModal.remove();
        
        const modal = document.createElement('div');
        modal.id = 'iosTelegramModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            z-index: 99999;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            animation: fadeIn 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                border-radius: 20px;
                padding: 30px;
                max-width: 500px;
                width: 100%;
                max-height: 80vh;
                overflow-y: auto;
                text-align: center;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            ">
                <div style="font-size: 3rem; color: #0088cc; margin-bottom: 20px;">
                    <i class="fab fa-telegram"></i>
                </div>
                
                <h2 style="color: #333; margin-bottom: 15px; font-size: 1.5rem;">
                    Telegramga o'tish
                </h2>
                
                <p style="color: #666; margin-bottom: 25px; line-height: 1.5;">
                    Quyidagi tugmani bosing yoki Telegram ilovasida <strong>@kentservice_admin</strong> ga o'tib, xabarni yuboring.
                </p>
                
                <div style="
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 12px;
                    margin-bottom: 25px;
                    text-align: left;
                    max-height: 200px;
                    overflow-y: auto;
                ">
                    <p style="
                        font-family: 'Courier New', monospace;
                        font-size: 13px;
                        color: #333;
                        margin: 0;
                        word-break: break-word;
                        white-space: pre-wrap;
                    ">${this.truncateMessage(message, 300)}</p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 15px; margin-bottom: 25px;">
                    <button onclick="window.telegramOpener.copyMessageToClipboard('${this.escapeHtml(message)}')" 
                            style="
                                background: #4361ee;
                                color: white;
                                border: none;
                                padding: 16px;
                                border-radius: 12px;
                                font-size: 16px;
                                font-weight: 600;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 10px;
                                transition: all 0.3s;
                            "
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(67, 97, 238, 0.3)';"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        <i class="fas fa-copy"></i>
                        Matnni nusxalash
                    </button>
                    
                    <button onclick="window.open('${url}', '_blank')" 
                            style="
                                background: #0088cc;
                                color: white;
                                border: none;
                                padding: 16px;
                                border-radius: 12px;
                                font-size: 16px;
                                font-weight: 600;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 10px;
                                transition: all 0.3s;
                            "
                            onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 5px 15px rgba(0, 136, 204, 0.3)';"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                        <i class="fab fa-telegram"></i>
                        Telegramga o'tish
                    </button>
                </div>
                
                <button onclick="document.getElementById('iosTelegramModal').remove()" 
                        style="
                            background: transparent;
                            color: #666;
                            border: 2px solid #ddd;
                            padding: 12px 25px;
                            border-radius: 12px;
                            font-size: 15px;
                            cursor: pointer;
                            width: 100%;
                            transition: all 0.3s;
                        "
                        onmouseover="this.style.backgroundColor='#f8f9fa';"
                        onmouseout="this.style.backgroundColor='transparent';">
                    Yopish
                </button>
                
                <p style="color: #999; font-size: 12px; margin-top: 20px;">
                    <i class="fas fa-info-circle"></i> Agar Telegram ochilmasa, ilovani qayta ishga tushiring
                </p>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            this.openLinkInBackground(url);
        }, 300);
    }
    
    openLinkInBackground(url) {
        try {
            const iframe = document.createElement('iframe');
            iframe.style.cssText = `
                position: absolute;
                width: 1px;
                height: 1px;
                opacity: 0;
                border: none;
                pointer-events: none;
            `;
            iframe.src = url;
            document.body.appendChild(iframe);
            
            setTimeout(() => {
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            }, 3000);
            
        } catch (error) {
            console.log('Background open failed:', error);
        }
    }
    
    copyMessageToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                const notification = document.createElement('div');
                notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #4cc9f0;
                    color: white;
                    padding: 15px 25px;
                    border-radius: 10px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                    z-index: 100000;
                    animation: slideIn 0.3s ease;
                `;
                notification.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas fa-check-circle"></i>
                        <span>Matn nusxalandi! Endi Telegramga yuborishingiz mumkin</span>
                    </div>
                `;
                document.body.appendChild(notification);
                
                setTimeout(() => {
                    notification.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => notification.remove(), 300);
                }, 3000);
                
            })
            .catch(err => {
                console.error('Copy failed:', err);
                alert('Matnni nusxalashda xatolik. Iltimos, qolda nusxalang.');
            });
    }
    
    truncateMessage(message, maxLength) {
        if (!message) return '';
        if (message.length <= maxLength) return message;
        return message.substring(0, maxLength) + '...';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML.replace(/'/g, "\\'").replace(/"/g, '\\"');
    }
}

window.TelegramOpener = TelegramOpener;
window.telegramOpener = new TelegramOpener();

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { 
            transform: translateX(100%); 
            opacity: 0; 
        }
        to { 
            transform: translateX(0); 
            opacity: 1; 
        }
    }
    
    @keyframes slideOut {
        from { 
            transform: translateX(0); 
            opacity: 1; 
        }
        to { 
            transform: translateX(100%); 
            opacity: 0; 
        }
    }
`;
document.head.appendChild(style);