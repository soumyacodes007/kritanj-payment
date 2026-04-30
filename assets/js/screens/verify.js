/* ============================================
   VERIFY SCREEN
   ============================================ */

const VerifyScreen = {
    init() {
        const verifyBtn = document.getElementById('verify-btn');
        const phoneInput = document.getElementById('phone-input');
        const tryDifferentBtn = document.getElementById('try-different-btn');
        const registerNowBtn = document.getElementById('register-now-btn');

        // Verify button click
        if (verifyBtn) {
            verifyBtn.addEventListener('click', () => this.handleVerify());
        }

        // Enter key on phone input
        if (phoneInput) {
            phoneInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleVerify();
                }
            });

            // Auto-format phone number
            phoneInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) {
                    value = value.slice(0, 10);
                }
                e.target.value = value;
            });
        }

        // Try different number button
        if (tryDifferentBtn) {
            tryDifferentBtn.addEventListener('click', () => {
                UI.clearInput('phone-input');
                App.goTo('screen-verify');
                UI.focusInput('phone-input');
            });
        }

        // Register now button
        if (registerNowBtn) {
            registerNowBtn.addEventListener('click', () => {
                window.open(CONFIG.REGISTRATION_URL, '_blank');
            });
        }
    },

    async handleVerify() {
        const phoneInput = document.getElementById('phone-input');
        const phone = UI.normalizePhone(phoneInput.value);

        // Validation
        if (!phone || phone.length !== 10) {
            UI.showError('Please enter a valid 10-digit phone number');
            return;
        }

        // Show loading
        UI.showButtonLoading('verify-btn');

        // Call API
        const result = await API.verifyRegistration(phone);

        // Hide loading
        UI.hideButtonLoading('verify-btn');

        if (result.success) {
            // Store user data
            store.setUserData(result.data);

            // Navigate to registration screen
            App.goTo('screen-registration');
        } else {
            // Show not registered screen
            App.goTo('screen-not-registered');
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VerifyScreen;
}
