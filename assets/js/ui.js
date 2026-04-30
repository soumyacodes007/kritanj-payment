/* ============================================
   UI UTILITIES
   ============================================ */

const UI = {
    // Show loading state on button
    showButtonLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        button.disabled = true;
        button.dataset.originalText = button.innerHTML;
        button.innerHTML = '<div class="circular-loader" style="width: 20px; height: 20px; border-width: 2px;"></div>';
    },
    
    // Hide loading state on button
    hideButtonLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        button.disabled = false;
        if (button.dataset.originalText) {
            button.innerHTML = button.dataset.originalText;
            delete button.dataset.originalText;
        }
        
        // Reinitialize Lucide icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    },
    
    // Show error message
    showError(message, containerId = null) {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="glass-card" style="background: rgba(217, 72, 36, 0.1); border-color: var(--red);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <i data-lucide="alert-circle" style="width: 20px; height: 20px; color: var(--red);"></i>
                            <span style="color: var(--red); font-size: 0.9rem;">${message}</span>
                        </div>
                    </div>
                `;
                lucide.createIcons();
            }
        } else {
            alert(message);
        }
    },
    
    // Show success message
    showSuccess(message, containerId = null) {
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="glass-card" style="background: rgba(121, 200, 90, 0.1); border-color: var(--green);">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <i data-lucide="check-circle" style="width: 20px; height: 20px; color: var(--green);"></i>
                            <span style="color: var(--green); font-size: 0.9rem;">${message}</span>
                        </div>
                    </div>
                `;
                lucide.createIcons();
            }
        }
    },
    
    // Format phone number
    formatPhone(phone) {
        // Remove all non-digits
        const cleaned = phone.replace(/\D/g, '');
        
        // Format as: 98765 43210
        if (cleaned.length === 10) {
            return `${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
        }
        
        return cleaned;
    },
    
    // Normalize phone number (remove spaces, country code, etc.)
    normalizePhone(phone) {
        return phone.replace(/\D/g, '').slice(-10);
    },
    
    // Format currency
    formatCurrency(amount) {
        return `₹${amount}`;
    },
    
    // Format workshop name
    formatWorkshopName(workshop) {
        return CONFIG.WORKSHOP_NAMES[workshop] || workshop;
    },
    
    // Animate checklist items
    animateChecklist(items, callback) {
        let index = 0;
        
        const animate = () => {
            if (index < items.length) {
                const item = items[index];
                item.classList.add('complete');
                item.classList.remove('active');
                
                index++;
                if (index < items.length) {
                    items[index].classList.add('active');
                }
                
                setTimeout(animate, 800);
            } else {
                if (callback) callback();
            }
        };
        
        if (items.length > 0) {
            items[0].classList.add('active');
            setTimeout(animate, 800);
        }
    },
    
    // Download QR code
    downloadQR(imageElement, filename = 'ticket-qr.png') {
        const link = document.createElement('a');
        link.href = imageElement.src;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    
    // Clear input
    clearInput(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            input.value = '';
        }
    },
    
    // Focus input
    focusInput(inputId) {
        const input = document.getElementById(inputId);
        if (input) {
            setTimeout(() => input.focus(), 100);
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UI;
}
