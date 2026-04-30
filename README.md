# GDG on Campus - Workshop Registration App

A premium, mobile-first event registration web application with a cinematic dark forest theme.

## 🎨 Design Features

- **Dark Fantasy Forest Theme**: Cinematic background with warm golden accents
- **Glassmorphism UI**: Modern glass-effect cards with backdrop blur
- **Mobile-First**: Optimized for mobile devices, works beautifully on desktop
- **Smooth Animations**: Elegant transitions between screens
- **Premium Typography**: Cinzel serif headings + Inter sans-serif body

## 📁 Project Structure

```
workshop-registration/
├── index.html                 # Main HTML file
├── assets/
│   ├── images/
│   │   ├── background.jpg     # Forest background (add your image here)
│   │   └── payment-qr.png     # BharatPe QR code (add your image here)
│   ├── css/
│   │   ├── shared.css         # Base styles, variables, utilities
│   │   ├── verify.css         # Phone verification screen styles
│   │   ├── registration.css   # Registration status & payment options
│   │   ├── payment.css        # Payment & verification screens
│   │   └── success.css        # Success & ticket screens
│   └── js/
│       ├── screens/
│       │   ├── verify.js      # Phone verification logic
│       │   ├── registration.js # Registration & workshop selection
│       │   ├── payment.js     # Payment processing
│       │   └── success.js     # Success & ticket display
│       ├── config.js          # Configuration & constants
│       ├── store.js           # State management
│       ├── ui.js              # UI utilities
│       ├── api.js             # API calls
│       └── app.js             # Main app controller
├── api.md                     # API documentation
└── README.md                  # This file
```

## 🚀 Getting Started

### 1. Add Required Images

Place these images in the `assets/images/` folder:

- **background.jpg**: Forest background image (1920x1080px recommended)
- **payment-qr.png**: BharatPe payment QR code

### 2. Configure API

Edit `assets/js/config.js`:

```javascript
const CONFIG = {
    API_BASE_URL: 'https://your-api-url.com',
    REGISTRATION_URL: 'https://forms.google.com/your-form',
    // ... other settings
};
```

### 3. Open in Browser

Simply open `index.html` in a web browser. No build process required!

## 🎯 User Flow

1. **Verify Phone** → User enters phone number
2. **Registration Status** → Shows registered workshops
3. **Select Payment** → Choose workshop(s) to pay for
4. **Payment** → Scan QR, enter UTR
5. **Verifying** → Animated verification process
6. **Success** → Payment confirmed
7. **Entry Ticket** → Download QR code for venue entry

## 🛠️ Tech Stack

- **HTML5**: Semantic markup
- **CSS3**: Custom properties, flexbox, grid, animations
- **Vanilla JavaScript**: No frameworks, pure ES6+
- **Lucide Icons**: Beautiful icon library
- **Google Fonts**: Cinzel (serif) + Inter (sans-serif)

## 🎨 Color Palette

```css
--bg-dark: #06100d
--card-dark: rgba(5, 16, 13, 0.78)
--gold: #d8a84f
--gold-light: #f6d88b
--orange: #d96b24
--green: #79c85a
--red: #d94824
--text: #f4ead2
```

## 📱 Responsive Design

- **Mobile**: Full-width cards, optimized touch targets
- **Tablet**: Centered card layout
- **Desktop**: Max-width 430px card (phone-like experience)

## 🔧 Customization

### Change Colors

Edit CSS variables in `assets/css/shared.css`:

```css
:root {
    --gold: #your-color;
    --green: #your-color;
    /* ... */
}
```

### Change Fonts

Update font imports in `index.html` and variables in `shared.css`:

```css
--font-heading: 'Your Font', serif;
--font-body: 'Your Font', sans-serif;
```

### Add New Screen

1. Add HTML in `index.html`
2. Create CSS file in `assets/css/`
3. Create JS file in `assets/js/screens/`
4. Initialize in `app.js`

## 🌐 API Integration

The app connects to your backend API with these endpoints:

- `POST /verify` - Verify user registration
- `POST /pay` - Process payment

See `api.md` for complete API documentation.

## 📦 Deployment

### Static Hosting (Recommended)

Deploy to any static hosting service:

- **Netlify**: Drag & drop the folder
- **Vercel**: Connect GitHub repo
- **GitHub Pages**: Push to gh-pages branch
- **Firebase Hosting**: `firebase deploy`

### No Build Required

This is a pure HTML/CSS/JS app. Just upload the files!

## 🐛 Troubleshooting

### Icons not showing

Make sure Lucide CDN is loaded:
```html
<script src="https://unpkg.com/lucide@latest"></script>
```

### Background image not loading

Check the path in `shared.css`:
```css
background-image: url('../images/background.jpg');
```

### API calls failing

1. Check `CONFIG.API_BASE_URL` in `config.js`
2. Check CORS settings on your API
3. Open browser console for error details

## 📄 License

This project is created for GDG on Campus - NIT Agarpara.

## 🤝 Contributing

Feel free to customize and improve this app for your event!

---

**Built with ❤️ for GDG on Campus**

*GOOD VIBES. GREAT CODE.*
