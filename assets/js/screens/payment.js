/* ============================================
   PAYMENT SCREEN
   ============================================ */

const PaymentScreen = {
    init() {
        const verifyPaymentBtn = document.getElementById('verify-payment-btn');
        const backToWorkshopBtn = document.getElementById('back-to-workshop');
        const utrInput = document.getElementById('utr-input');
        const cancelVerificationBtn = document.getElementById('cancel-verification-btn');
        const tryAgainBtn = document.getElementById('try-again-btn');
        const changeWorkshopBtn = document.getElementById('change-workshop-btn');

        // Verify payment button
        if (verifyPaymentBtn) {
            verifyPaymentBtn.addEventListener('click', () => this.handleVerifyPayment());
        }

        // Enter key on UTR input
        if (utrInput) {
            utrInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleVerifyPayment();
                }
            });
        }

        // Back to workshop selection
        if (backToWorkshopBtn) {
            backToWorkshopBtn.addEventListener('click', () => {
                App.goTo('screen-select-payment');
            });
        }

        // Cancel verification
        if (cancelVerificationBtn) {
            cancelVerificationBtn.addEventListener('click', () => {
                App.goTo('screen-payment');
            });
        }

        // Try again button
        if (tryAgainBtn) {
            tryAgainBtn.addEventListener('click', () => {
                UI.clearInput('utr-input');
                App.goTo('screen-payment');
                UI.focusInput('utr-input');
            });
        }

        // Change workshop button
        if (changeWorkshopBtn) {
            changeWorkshopBtn.addEventListener('click', () => {
                UI.clearInput('utr-input');
                App.goTo('screen-select-payment');
            });
        }
    },

    render() {
        this.renderPaymentSummary();
    },

    renderPaymentSummary() {
        const container = document.getElementById('payment-summary');
        if (!container || !store.selectedWorkshop) return;

        const workshop = store.selectedWorkshop;
        const amount = CONFIG.WORKSHOP_PRICES[workshop];

        container.innerHTML = `
            <div class="summary-row">
                <span class="label">Paying for</span>
                <span class="value">${UI.formatWorkshopName(workshop)}</span>
            </div>
            <div class="summary-row">
                <span class="label">Name</span>
                <span class="value">${store.user.name}</span>
            </div>
            <div class="summary-row">
                <span class="label">Phone</span>
                <span class="value">${UI.formatPhone(store.phone)}</span>
            </div>
            <div class="summary-row">
                <span class="label">Amount</span>
                <span class="value">${UI.formatCurrency(amount)}</span>
            </div>
        `;
    },

    async handleVerifyPayment() {
        const utrInput = document.getElementById('utr-input');
        const utr = utrInput.value.trim();

        // Validation
        if (!utr) {
            UI.showError('Please enter the UTR / Transaction ID');
            return;
        }

        if (!store.selectedWorkshop) {
            UI.showError('No workshop selected');
            return;
        }

        // Store UTR
        store.setPaymentUTR(utr);

        // Show verifying screen
        App.goTo('screen-verifying');

        // Animate checklist
        const checklistItems = document.querySelectorAll('.checklist-item');
        UI.animateChecklist(Array.from(checklistItems), async () => {
            // Call API after animation
            await this.processPayment();
        });
    },

    async processPayment() {
        const result = await API.processPayment(
            store.phone,
            store.currentPayment.utr,
            store.currentPayment.workshop
        );

        if (result.success) {
            // Store payment result
            store.setPaymentResult(result.data);

            // Update paid workshops
            if (result.data.workshop === 'both') {
                store.paidWorkshops = ['vibe coding', 'product design'];
            } else {
                store.paidWorkshops.push(result.data.workshop);
            }

            // Update pending workshops
            store.pendingWorkshops = store.registeredWorkshops.filter(
                w => !store.paidWorkshops.includes(w)
            );

            // Show success screen
            setTimeout(() => {
                SuccessScreen.render();
                App.goTo('screen-success');
            }, 500);
        } else {
            // Show error screen
            setTimeout(() => {
                this.renderError(result.error, result.details);
                App.goTo('screen-payment-failed');
            }, 500);
        }
    },

    renderError(errorMessage, details) {
        const container = document.getElementById('error-reasons');
        if (!container) return;

        const reasons = [];

        // Parse error message
        if (errorMessage.includes('UTR not found')) {
            reasons.push('UTR not found in payment records');
        } else if (errorMessage.includes('Less amount paid')) {
            reasons.push(`Less amount paid (Expected: ${details?.expected_amount || 'N/A'})`);
        } else if (errorMessage.includes('Excess amount paid')) {
            reasons.push(`Excess amount paid (Expected: ${details?.expected_amount || 'N/A'})`);
        } else if (errorMessage.includes('not successful')) {
            reasons.push('Payment transaction is not successful');
        } else if (errorMessage.includes('already used')) {
            reasons.push('UTR already used for another payment');
        } else if (errorMessage.includes('Already paid')) {
            reasons.push('Already paid for this workshop');
        } else {
            reasons.push(errorMessage);
        }

        container.innerHTML = `
            <h4>Possible reasons:</h4>
            <ul>
                ${reasons.map(reason => `<li>${reason}</li>`).join('')}
            </ul>
        `;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PaymentScreen;
}
