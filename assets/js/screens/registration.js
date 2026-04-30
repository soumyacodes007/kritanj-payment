/* ============================================
   REGISTRATION SCREEN
   ============================================ */

const RegistrationScreen = {
    init() {
        const viewPaymentBtn = document.getElementById('view-payment-btn');
        const backToDetailsBtn = document.getElementById('back-to-details');

        // View payment options button
        if (viewPaymentBtn) {
            viewPaymentBtn.addEventListener('click', () => {
                if (store.hasUnpaidWorkshops()) {
                    this.renderPaymentOptions();
                    App.goTo('screen-select-payment');
                } else {
                    // All workshops paid, go to ticket
                    App.goTo('screen-ticket');
                    SuccessScreen.renderTicket();
                }
            });
        }

        // Back to details button
        if (backToDetailsBtn) {
            backToDetailsBtn.addEventListener('click', () => {
                App.goTo('screen-registration');
            });
        }
    },

    render() {
        this.renderWorkshopChips();
        this.renderUserDetails();
        this.updateButton();
    },

    renderWorkshopChips() {
        const container = document.getElementById('workshop-chips');
        if (!container) return;

        container.innerHTML = store.registeredWorkshops.map(workshop => `
            <div class="workshop-chip">
                <i data-lucide="${workshop === 'vibe coding' ? 'code' : 'palette'}"></i>
                <span>${UI.formatWorkshopName(workshop)}</span>
            </div>
        `).join('');

        lucide.createIcons();
    },

    renderUserDetails() {
        const container = document.getElementById('user-details');
        if (!container || !store.user) return;

        container.innerHTML = `
            <div class="detail-row">
                <i data-lucide="user"></i>
                <span class="value">${store.user.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <i data-lucide="mail"></i>
                <span class="value">${store.user.email || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <i data-lucide="building"></i>
                <span class="value">${store.user.college || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <i data-lucide="book-open"></i>
                <span class="value">${store.user.department || 'N/A'} • ${store.user.year || 'N/A'}</span>
            </div>
        `;

        lucide.createIcons();
    },

    updateButton() {
        const button = document.getElementById('view-payment-btn');
        const notice = document.getElementById('already-paid-notice');

        if (!button || !notice) return;

        if (store.hasUnpaidWorkshops()) {
            button.innerHTML = '<span>View Payment Options</span><i data-lucide="arrow-right"></i>';
            notice.style.display = 'none';
        } else {
            button.innerHTML = '<span>View Entry Ticket</span><i data-lucide="arrow-right"></i>';
            notice.style.display = 'flex';
        }

        lucide.createIcons();
    },

    renderPaymentOptions() {
        const container = document.getElementById('payment-options');
        if (!container) return;

        const options = [];

        // Individual workshops
        store.registeredWorkshops.forEach(workshop => {
            const isPaid = store.isWorkshopPaid(workshop);
            options.push({
                id: workshop,
                name: UI.formatWorkshopName(workshop),
                price: CONFIG.WORKSHOP_PRICES[workshop],
                icon: workshop === 'vibe coding' ? 'code' : 'palette',
                isPaid: isPaid,
                isBestValue: false
            });
        });

        // Both workshops option
        if (store.canPayForBoth()) {
            const bothPaid = store.isBothPaid();
            options.push({
                id: 'both',
                name: 'Both Workshops',
                price: CONFIG.WORKSHOP_PRICES.both,
                icon: 'gift',
                isPaid: bothPaid,
                isBestValue: true
            });
        }

        container.innerHTML = options.map(option => `
            <div class="payment-option ${option.isPaid ? 'paid' : ''}" data-workshop="${option.id}">
                <div class="payment-option-header">
                    <div class="payment-option-title">
                        <i data-lucide="${option.icon}"></i>
                        <h3>${option.name}</h3>
                        ${option.isBestValue ? '<span class="payment-option-badge"><i data-lucide="star"></i>Best Value</span>' : ''}
                    </div>
                    <div class="payment-option-price">${UI.formatCurrency(option.price)}</div>
                </div>
                ${option.isPaid ? `
                    <div class="payment-option-status paid">
                        <i data-lucide="check-circle"></i>
                        <span>Already Paid</span>
                    </div>
                ` : ''}
                <div class="payment-option-radio"></div>
            </div>
        `).join('');

        lucide.createIcons();

        // Add click handlers
        this.attachPaymentOptionHandlers();
    },

    attachPaymentOptionHandlers() {
        const options = document.querySelectorAll('.payment-option:not(.paid)');
        const proceedBtn = document.getElementById('proceed-to-pay-btn');

        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selection from all
                options.forEach(opt => opt.classList.remove('selected'));

                // Select this one
                option.classList.add('selected');

                // Store selection
                const workshop = option.dataset.workshop;
                store.selectWorkshop(workshop);

                // Enable proceed button
                if (proceedBtn) {
                    proceedBtn.disabled = false;
                }
            });
        });

        // Proceed button
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                if (store.selectedWorkshop) {
                    PaymentScreen.render();
                    App.goTo('screen-payment');
                }
            });
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegistrationScreen;
}
