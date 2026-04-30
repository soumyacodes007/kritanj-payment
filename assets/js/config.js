/* ============================================
   CONFIGURATION
   ============================================ */

const CONFIG = {
    // API Configuration
    API_BASE_URL: 'https://kritanj-9c6e45de93c3.herokuapp.com',
    
    // CORS Proxy (use if API doesn't have CORS enabled)
    USE_CORS_PROXY: true,
    CORS_PROXY_URL: 'https://corsproxy.io/?',
    
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
    
    // Mock Mode (set to false to use real API)
    MOCK_MODE: false,
    
    // Animation Delays
    ANIMATION_DELAY: 300,
    VERIFICATION_DELAY: 2000,
    
    // Helper to get API URL with optional proxy
    getApiUrl(endpoint) {
        const baseUrl = `${this.API_BASE_URL}${endpoint}`;
        return this.USE_CORS_PROXY ? `${this.CORS_PROXY_URL}${encodeURIComponent(baseUrl)}` : baseUrl;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
