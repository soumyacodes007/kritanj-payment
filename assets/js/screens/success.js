/* ============================================
   SUCCESS & TICKET SCREENS
   ============================================ */

const SuccessScreen = {
    init() {
        const downloadTicketBtn = document.getElementById('download-ticket-btn');
        const payAnotherBtn = document.getElementById('pay-another-btn');
        const downloadQRBtn = document.getElementById('download-qr-btn');
        const doneBtn = document.getElementById('done-btn');
        const backHomeBtn = document.getElementById('back-home-btn');

        // Download ticket button
        if (downloadTicketBtn) {
            downloadTicketBtn.addEventListener('click', () => {
                this.renderTicket();
                App.goTo('screen-ticket');
            });
        }

        // Pay for another workshop
        if (payAnotherBtn) {
            payAnotherBtn.addEventListener('click', () => {
                UI.clearInput('utr-input');
                RegistrationScreen.renderPaymentOptions();
                App.goTo('screen-select-payment');
            });
        }

        // Download QR button
        if (downloadQRBtn) {
            downloadQRBtn.addEventListener('click', () => {
                const qrImage = document.getElementById('ticket-qr-image');
                if (qrImage) {
                    UI.downloadQR(qrImage, `ticket-${store.phone}.png`);
                }
            });
        }

        // Done button
        if (doneBtn) {
            doneBtn.addEventListener('click', () => {
                this.handleDone();
            });
        }

        // Back to home button
        if (backHomeBtn) {
            backHomeBtn.addEventListener('click', () => {
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
                <span class="label">UTR</span>
                <span class="value">${store.currentPayment.utr}</span>
            </div>
        `;
    },

    updatePayAnotherButton() {
        const button = document.getElementById('pay-another-btn');
        if (!button) return;

        if (store.hasUnpaidWorkshops()) {
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    },

    renderTicket() {
        const qrImage = document.getElementById('ticket-qr-image');
        const detailsContainer = document.getElementById('ticket-details');

        if (!store.paymentResult) return;

        const result = store.paymentResult;

        // Set QR image
        if (qrImage && result.qr_data_uri) {
            qrImage.src = result.qr_data_uri;
        }

        // Render ticket details
        if (detailsContainer) {
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            const timeStr = now.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
            });

            detailsContainer.innerHTML = `
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
                    <span class="label">Date</span>
                    <span class="value">${dateStr} • ${timeStr}</span>
                </div>
                <div class="email-notice">
                    <i data-lucide="mail"></i>
                    <span>We've sent the ticket to your registered email ID.</span>
                </div>
            `;

            lucide.createIcons();
        }
    },

    handleDone() {
        // Reset form
        UI.clearInput('phone-input');
        UI.clearInput('utr-input');
        store.reset();

        // Go back to verify screen
        App.goTo('screen-verify');
        UI.focusInput('phone-input');
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SuccessScreen;
}
