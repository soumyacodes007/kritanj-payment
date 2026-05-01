/* ============================================
   STATE MANAGEMENT
   ============================================ */

const store = {
    // User Data
    phone: null,
    user: null,
    
    // Workshop Data
    registeredWorkshops: [],
    paidWorkshops: [],
    pendingWorkshops: [],
    
    // Selected Workshop for Payment
    selectedWorkshop: null,
    
    // Payment Data
    currentPayment: {
        utr: null,
        amount: null,
        workshop: null
    },
    
    // Success Data
    paymentResult: null,
    
    // Methods
    reset() {
        this.phone = null;
        this.user = null;
        this.registeredWorkshops = [];
        this.paidWorkshops = [];
        this.pendingWorkshops = [];
        this.selectedWorkshop = null;
        this.currentPayment = {
            utr: null,
            amount: null,
            workshop: null
        };
        this.paymentResult = null;
    },
    
    setUserData(data) {
        this.phone = data.phone;
        this.user = data.latest_profile;
        this.registeredWorkshops = data.registered_workshops || [];
        this.paidWorkshops = data.paid_workshops || [];
        this.pendingWorkshops = data.pending_workshops || [];
    },
    
    selectWorkshop(workshop) {
        this.selectedWorkshop = workshop;
        this.currentPayment.workshop = workshop;
        this.currentPayment.amount = CONFIG.WORKSHOP_PRICES[workshop];
    },
    
    setPaymentUTR(utr) {
        this.currentPayment.utr = utr;
    },
    
    setPaymentResult(result) {
        this.paymentResult = result;
    },
    
    isWorkshopPaid(workshop) {
        return this.paidWorkshops.includes(workshop);
    },
    
    isWorkshopRegistered(workshop) {
        return this.registeredWorkshops.includes(workshop);
    },
    
    hasUnpaidWorkshops() {
        return this.pendingWorkshops.length > 0;
    },
    
    canPayForBoth() {
        // Only offer "both" if registered for both AND neither has been paid yet.
        return this.registeredWorkshops.length === 2 &&
               this.registeredWorkshops.includes('vibe coding') &&
               this.registeredWorkshops.includes('product design') &&
               this.pendingWorkshops.length === 2;
    },

    isBothPaid() {
        return this.paidWorkshops.includes('vibe coding') && this.paidWorkshops.includes('product design');
    },

    isAllPaid() {
        return this.registeredWorkshops.length > 0 && this.pendingWorkshops.length === 0;
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = store;
}
