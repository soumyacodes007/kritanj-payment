/* ============================================
   API LAYER
   ============================================ */

const API = {
    // Verify user registration
    async verifyRegistration(phone) {
        try {
            console.log('Verifying phone:', phone);
            const url = CONFIG.getApiUrl('/verify');
            console.log('API URL:', url);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phone })
            });

            console.log('Response status:', response.status);
            const data = await response.json();
            console.log('Response data:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed');
            }

            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('API Error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // Process payment
    async processPayment(phone, utr, workshop) {
        try {
            const url = CONFIG.getApiUrl('/pay');

            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, utr, workshop })
            });

            const data = await response.json();

            if (!response.ok) {
                // Return full API body as details so renderError can read expected_amount etc.
                return {
                    success: false,
                    error: data.error || 'Payment verification failed',
                    details: data
                };
            }

            return { success: true, data };
        } catch (error) {
            return { success: false, error: error.message, details: null };
        }
    },

    // Get QR code for paid workshop (if endpoint exists)
    async getQRCode(phone, workshop) {
        try {
            const url = CONFIG.getApiUrl(`/qr/${phone}/${workshop}`);
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to retrieve QR code');
            }

            return {
                success: true,
                data: data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
}
