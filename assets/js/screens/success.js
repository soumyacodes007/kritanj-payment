/* ============================================
   SUCCESS SCREEN
   ============================================ */

const SuccessScreen = {
    init() {
        const payAnotherBtn = document.getElementById('pay-another-btn');
        const doneBtn = document.getElementById('done-btn');

        // Pay for another workshop
        if (payAnotherBtn) {
            payAnotherBtn.addEventListener('click', () => {
                UI.clearInput('utr-input');
                RegistrationScreen.renderPaymentOptions();
                App.goTo('screen-select-payment');
            });
        }

        // Done button
        if (doneBtn) {
            doneBtn.addEventListener('click', () => {
                this.handleDone();
            });
        }
    },

    render() {
        this.renderPaymentDetails();
        this.updatePayAnotherButton();
    },

    renderPaymentDetails() {
        const container = document.getElementById('success-payment-details');
        if (!container || !store.paymentResult) return;

        const result = store.paymentResult;

        container.innerHTML = `
            <div class="detail-row">
                <span class="label">Payment ID</span>
                <span class="value">${result.payment_id || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="label">Workshop</span>
                <span class="value">${UI.formatWorkshopName(result.workshop)}</span>
            </div>
            <div class="detail-row">
                <span class="label">Amount Paid</span>
                <span class="value">${UI.formatCurrency(result.paid_amount || result.expected_amount)}</span>
            </div>
            <div class="detail-row">
                <span class="label">Name</span>
                <span class="value">${result.latest_profile?.name || store.user?.name || 'N/A'}</span>
            </div>
            <div class="detail-row">
                <span class="label">UTR</span>
                <span class="value">${store.currentPayment.utr}</span>
            </div>
        `;
    },

    updatePayAnotherButton() {
        const button = document.getElementById('pay-another-btn');
        if (!button) return;
        button.style.display = store.hasUnpaidWorkshops() ? 'block' : 'none';
    },

    handleDone() {
        UI.clearInput('phone-input');
        UI.clearInput('utr-input');
        store.reset();
        App.goTo('screen-verify');
        UI.focusInput('phone-input');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SuccessScreen;
}
