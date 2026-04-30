/* ============================================
   MAIN APP CONTROLLER
   ============================================ */

const App = {
    currentScreen: 'screen-verify',

    init() {
        console.log('🚀 GDG Workshop Registration App Initialized');
        
        // Initialize all screens
        VerifyScreen.init();
        RegistrationScreen.init();
        PaymentScreen.init();
        SuccessScreen.init();

        // Show initial screen
        this.goTo('screen-verify');

        // Focus on phone input
        UI.focusInput('phone-input');
    },

    goTo(screenId) {
        // Hide all screens
        const screens = document.querySelectorAll('.screen-card');
        screens.forEach(screen => {
            screen.classList.remove('active');
        });

        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;

            // Scroll to top
            window.scrollTo(0, 0);

            // Reinitialize Lucide icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }

            // Screen-specific actions
            this.onScreenChange(screenId);
        } else {
            console.error(`Screen not found: ${screenId}`);
        }
    },

    onScreenChange(screenId) {
        switch (screenId) {
            case 'screen-registration':
                RegistrationScreen.render();
                break;
            case 'screen-payment':
                PaymentScreen.render();
                break;
            case 'screen-success':
                SuccessScreen.render();
                break;
            case 'screen-ticket':
                SuccessScreen.renderTicket();
                break;
        }
    },

    getCurrentScreen() {
        return this.currentScreen;
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = App;
}
