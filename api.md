# GDG on Campus Workshop Registration API

## Overview

This API handles workshop registration verification and payment processing for GDG on Campus events at NIT Agarpara. It integrates with Google Sheets for registration data and BharatPe for payment verification.

## Base URL
```
http://localhost:5000
```

## Authentication
No authentication required for current endpoints.

## Endpoints

### 1. Health Check
**GET /**

Returns the API status.

**Response:**
```json
{
  "status": "ok",
  "message": "API running"
}
```

---

### 2. Verify Registration
**POST /verify**

Verifies user registration status and payment information.

**Request Body:**
```json
{
  "phone": "string" // Phone number (will be normalized)
}
```

**Response (Success):**
```json
{
  "phone": "9876543210",
  "registered": true,
  "registered_workshops": ["vibe coding", "product design"],
  "paid_workshops": ["vibe coding"],
  "pending_workshops": ["product design"],
  "latest_profile": {
    "name": "John Doe",
    "email": "john@example.com",
    "college": "NIT Agarpara",
    "department": "Computer Science",
    "year": "3rd Year",
    "row_index": 42
  }
}
```

**Error Responses:**
- `400`: `{"error": "phone is required"}`
- `404`: `{"error": "User not registered"}`

---

### 3. Process Payment
**POST /pay**

Processes payment for workshop registration using UTR (Unique Transaction Reference).

**Request Body:**
```json
{
  "phone": "string",     // Phone number (will be normalized)
  "utr": "string",       // Unique Transaction Reference
  "workshop": "string"   // "vibe coding", "product design", or "both"
}
```

**Supported Workshops:**
- `vibe coding` - ₹30
- `product design` - ₹30
- `both` - ₹60

**Response (Success - Single Workshop):**
```json
{
  "status": "success",
  "payment_id": "abc123def456",
  "phone": "9876543210",
  "workshop": "vibe coding",
  "expected_amount": "30",
  "paid_amount": "30",
  "latest_profile": {
    "name": "John Doe",
    "email": "john@example.com",
    "college": "NIT Agarpara",
    "department": "Computer Science",
    "year": "3rd Year"
  },
  "qr_base64": "base64_encoded_qr_image",
  "qr_data_uri": "data:image/png;base64,...",
  "email_queued": true
}
```

**Response (Success - Both Workshops):**
```json
{
  "status": "success",
  "payment_id": "abc123def456",
  "phone": "9876543210",
  "workshop": "both",
  "expected_amount": "60",
  "paid_amount": "60",
  "latest_profile": {
    "name": "John Doe",
    "email": "john@example.com",
    "college": "NIT Agarpara",
    "department": "Computer Science",
    "year": "3rd Year"
  },
  "qr_base64": "base64_encoded_qr_image",
  "qr_data_uri": "data:image/png;base64,...",
  "email_queued": true
}
```

**Error Responses:**
- `400`: `{"error": "phone is required"}`
- `400`: `{"error": "utr is required"}`
- `400`: `{"error": "invalid workshop", "allowed": ["vibe coding", "product design", "both"]}`
- `404`: `{"error": "User not registered"}`
- `404`: `{"error": "UTR not found"}`
- `404`: `{"error": "Not registered for the workshop"}`
- `409`: `{"error": "UTR already used"}`
- `409`: `{"error": "Already paid for this workshop"}`
- `409`: `{"error": "One or more requested workshops are already paid"}`
- `400`: `{"error": "Less amount paid", "expected_amount": "60", "paid_amount": "30"}`
- `400`: `{"error": "Excess amount paid", "expected_amount": "30", "paid_amount": "60"}`
- `400`: `{"error": "Payment transaction is not successful", "txn_status": "failed"}`
- `500`: `{"error": "Invalid amount returned by payment source"}`

---

### 4. Debug Registration Data
**GET /debug/registration/{phone}**

Debug endpoint to view registration data for a specific phone number.

**Parameters:**
- `phone`: Phone number to query

**Response:**
```json
{
  "phone": "9876543210",
  "registrations": {
    "vibe coding": {
      "name": "John Doe",
      "email": "john@example.com",
      "college": "NIT Agarpara",
      "department": "Computer Science",
      "year": "3rd Year",
      "row_index": 42
    }
  },
  "latest_profile": {
    "name": "John Doe",
    "email": "john@example.com",
    "college": "NIT Agarpara",
    "department": "Computer Science",
    "year": "3rd Year",
    "row_index": 42
  },
  "paid": ["vibe coding"]
}
```

---

### 5. Debug Recent Transactions
**GET /debug/transactions**

Debug endpoint to view recent payment transactions (last 5).

**Response:**
```json
[
  {
    "id": "TXN123456",
    "amount": "30.00",
    "status": "success",
    "payerName": "John Doe",
    "paymentTimestamp": "2024-01-01T10:00:00Z",
    "utr": "UTR123456789"
  }
]
```

## Data Flow

1. **Registration**: Users register via Google Forms, data stored in Google Sheets
2. **Verification**: API checks registration status and payment history
3. **Payment**: Users make payments via BharatPe
4. **Processing**: API verifies payment via UTR, generates QR code, sends confirmation email
5. **Records**: Payment data stored in separate Google Sheet

## Phone Number Normalization

Phone numbers are automatically normalized:
- Removes all non-digit characters
- Handles various formats (with/without country code)
- Standardizes to 10-digit format

## QR Code Generation

Upon successful payment, a QR code is generated containing:
```json
{
  "payment_id": "unique_payment_id",
  "phone": "normalized_phone",
  "workshop": "workshop_name",
  "utr": "transaction_reference"
}
```

## Email Notifications

Confirmation emails are sent asynchronously containing:
- Payment confirmation
- QR code for entry
- Registration details
- Payment information

## Error Handling

All endpoints return appropriate HTTP status codes and JSON error messages. The API handles various edge cases including:
- Duplicate UTR usage
- Invalid amounts
- Unsuccessful transactions
- Missing registrations

## Rate Limiting

No explicit rate limiting implemented. Consider adding for production use.

## Dependencies

- Flask
- gspread
- oauth2client
- requests
- qrcode
- smtplib (for email)
- Google Sheets API
- BharatPe API</content>
<parameter name="filePath">d:\Cursor\narula\API_GUIDE.md