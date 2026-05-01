/* ============================================
   CONFIGURATION
   ============================================ */

const CONFIG = {
    // API endpoint (CORS handled server-side)
    API_BASE_URL: 'https://kritanj-9c6e45de93c3.herokuapp.com',

    // Workshop Prices
    WORKSHOP_PRICES: {
        'vibe coding': 30,
        'product design': 30,
        'both': 60
    },

    // Workshop Display Names
    WORKSHOP_NAMES: {
        'vibe coding': 'Vibe Coding',
        'product design': 'Product Design',
        'both': 'Both Workshops'
    },

    // Registration Form URL
    REGISTRATION_URL: 'https://forms.google.com/your-form-url',

    // Animation Delays
    ANIMATION_DELAY: 300,
    VERIFICATION_DELAY: 2000,

    getApiUrl(endpoint) {
        return `${this.API_BASE_URL}${endpoint}`;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
