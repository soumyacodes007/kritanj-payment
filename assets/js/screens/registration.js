/* ============================================
   REGISTRATION SCREEN
   ============================================ */

const RegistrationScreen = {
    init() {
        const viewPaymentBtn = document.getElementById('view-payment-btn');
        const backToDetailsBtn = document.getElementById('back-to-details');
        const doneFromRegBtn = document.getElementById('done-from-reg-btn');
        const backToVerifyBtn = document.getElementById('back-to-verify');

        // View payment options button — only reachable when there are pending workshops
        if (viewPaymentBtn) {
            viewPaymentBtn.addEventListener('click', () => {
                if (store.hasUnpaidWorkshops()) {
                    this.renderPaymentOptions();
                    App.goTo('screen-select-payment');
                }
            });
        }

        // Back to details button (screen 04 → screen 03)
        if (backToDetailsBtn) {
            backToDetailsBtn.addEventListener('click', () => {
                App.goTo('screen-registration');
            });
        }

        // Done / try another number from registration (all-paid state)
        if (doneFromRegBtn) {
            doneFromRegBtn.addEventListener('click', () => {
                UI.clearInput('phone-input');
                store.reset();
                App.goTo('screen-verify');
                UI.focusInput('phone-input');
            });
        }

        // Back button on screen 03 → screen 01
        if (backToVerifyBtn) {
            backToVerifyBtn.addEventListener('click', () => {
                UI.clearInput('phone-input');
                store.reset();
                App.goTo('screen-verify');
                UI.focusInput('phone-input');
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
        const doneBtn = document.getElementById('done-from-reg-btn');

        if (!button || !notice) return;

        if (store.isAllPaid()) {
            // All workshops paid — hide pay button, show email notice + done
            button.style.display = 'none';
            notice.style.display = 'flex';
            if (doneBtn) doneBtn.style.display = 'block';
        } else {
            // Pending payments exist
            button.style.display = 'flex';
            button.innerHTML = '<span>View Payment Options</span><i data-lucide="arrow-right"></i>';
            notice.style.display = 'none';
            if (doneBtn) doneBtn.style.display = 'none';
            lucide.createIcons();
        }
    },

    renderPaymentOptions() {
        const container = document.getElementById('payment-options');
        if (!container) return;

        const options = [];

        // Individual workshop options — always show all registered ones
        store.registeredWorkshops.forEach(workshop => {
            const isPaid = store.isWorkshopPaid(workshop);
            options.push({
                id: workshop,
                name: UI.formatWorkshopName(workshop),
                price: CONFIG.WORKSHOP_PRICES[workshop],
                icon: workshop === 'vibe coding' ? 'code' : 'palette',
                isPaid,
                isBestValue: false
            });
        });

        // "Both" option — only if registered for both AND neither is paid yet
        if (store.canPayForBoth()) {
            options.push({
                id: 'both',
                name: 'Both Workshops',
                price: CONFIG.WORKSHOP_PRICES.both,
                icon: 'gift',
                isPaid: false,
                isBestValue: false
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
                        <span>Already Paid — check your email for QR</span>
                    </div>
                ` : ''}
                ${!option.isPaid ? '<div class="payment-option-radio"></div>' : ''}
            </div>
        `).join('');

        lucide.createIcons();

        this.attachPaymentOptionHandlers();
    },

    attachPaymentOptionHandlers() {
        const options = document.querySelectorAll('.payment-option:not(.paid)');

        // Clone the proceed button to wipe any stacked listeners from prior renders.
        const oldProceedBtn = document.getElementById('proceed-to-pay-btn');
        const proceedBtn = oldProceedBtn.cloneNode(true);
        oldProceedBtn.parentNode.replaceChild(proceedBtn, oldProceedBtn);

        // Reset state — clear stale workshop selection and disable proceed.
        store.selectedWorkshop = null;
        store.currentPayment.workshop = null;
        proceedBtn.disabled = true;

        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');

                const workshop = option.dataset.workshop;
                store.selectWorkshop(workshop);
                proceedBtn.disabled = false;
            });
        });

        proceedBtn.addEventListener('click', () => {
            if (store.selectedWorkshop && !store.isWorkshopPaid(store.selectedWorkshop)) {
                PaymentScreen.render();
                App.goTo('screen-payment');
            }
        });
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RegistrationScreen;
}
