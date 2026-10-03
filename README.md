# ⚡ Techify Atelier | Interactive Product Customizer & Media Experience

[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic_Markup-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Modern_Design_Tokens-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Lottie Animations](https://img.shields.io/badge/Lottie-Vector_Animation-00DDB3?logo=airtable&logoColor=white)](https://airbnb.io/lottie/)
[![Full Stack Development](https://img.shields.io/badge/Coursework-FSD_Lab_Task_04-8b5cf6)](#)

> **Techify Atelier** is an immersive, next-generation e-commerce web application featuring a real-time 3D interactive product configurator, HTML5 drag-and-drop shopping cart, in-card dual-media previews, a custom chapter-enabled video player with keyboard shortcuts, and a dynamic 3D credit card payment simulator with Luhn validation.

---

## 🌟 Key Features

### 🛍️ 1. Interactive Product Gallery & Dual-Media Cards
- **Dual-Media Card Previews:** Each product card features a live switcher allowing users to toggle between high-resolution photography and embedded video showcase loops.
- **In-Card Video Controls:** Quick play/pause and mute/unmute buttons directly inside the catalog card with hover transformations.
- **Graceful Fallbacks:** Multi-tier fallback system automatically checks local asset directories and falls back to remote CDN/archive streams and vector artwork if media is unavailable.

### 🎨 2. 3D Tilt Configurator & Vector Stage
- **Pointer-Tracking 3D Perspective:** Realistic mouse-driven 3D tilt stage (`rotateX`/`rotateY`) with dynamic specular glare illumination calculated in real time.
- **Live SVG Vector Engine:** Dynamically recolors product vectors in real time, supporting custom finishes, drop shadows, and metallic shine animations.
- **Live Name Engraving:** Real-time text overlay rendered directly onto the product preview, complete with a 20-character counter and threshold warning alerts.
- **Variant Selector:** Seamless tier switching (Standard, Pro, Max) with automatic running price calculation in Pakistani Rupees (`Rs`).

### 👑 3. Freemium Experience & Tier Control
- **Free Finishes:** Midnight, Ocean, and Coral color options accessible to all users.
- **Premium Metallic & Chromatic Finishes:** Exclusive Gold, Rose Gold, and Aurora finishes with shimmering CSS overlays.
- **Gold-Foil Engraving:** Premium metallic foil styling for custom text.
- **Interactive Upgrade Triggers:** Visual lock indicators and direct upgrade prompts seamlessly routing to the dedicated payment portal.

### 🛒 4. HTML5 Drag-and-Drop Shopping Cart
- **Spatial Drag-and-Drop:** Intuitive interaction allowing users to drag the product preview stage directly and drop it into the cart drop zone.
- **Accessible Tap Fallback:** Mobile-friendly and keyboard-accessible "Add to Cart" button for non-drag environments.
- **Cart Aggregation:** Live item counting, itemized receipt breakdown with selected finish and custom engraving details, and total price calculation.
- **Visual Feedback:** Dynamic CSS drag-over highlights and pulse animations upon item drop.

### 🎬 5. Cinematic Video Showcase Player
- **Custom Player Architecture:** Built from scratch on the HTML5 Media API without third-party player bloat.
- **Interactive Chapter System:** Clickable chapter sidebar and seekbar progress markers with time-synced captions.
- **Advanced Playback Controls:** Scrub bar with progress fill, variable playback rate (0.5x – 2.0x), volume slider, loop toggle, Picture-in-Picture (PiP), and native Fullscreen API integration.
- **Full Keyboard Accessibility:**
  | Key / Shortcut | Action |
  | :--- | :--- |
  | <kbd>Space</kbd> / <kbd>K</kbd> | Play / Pause |
  | <kbd>J</kbd> / <kbd>L</kbd> | Skip Backward / Forward 10 seconds |
  | <kbd>←</kbd> / <kbd>→</kbd> | Step Backward / Forward 5 seconds |
  | <kbd>↑</kbd> / <kbd>↓</kbd> | Increase / Decrease Volume by 10% |
  | <kbd>M</kbd> | Toggle Mute |
  | <kbd>F</kbd> | Toggle Fullscreen |

### 💳 6. 3D Interactive Payment Gateway (`payment.html`)
- **3D Card Flip Animation:** Realistic card perspective that flips to the back when the user focuses on the CVV input and returns to the front on blur.
- **Real-Time Card Mirroring:** Instantaneous credit card surface updates reflecting the cardholder name, formatted 16-digit card number (spaced in blocks of four), and expiration date.
- **Client-Side Luhn Algorithm Validation:** Rigorous card number check utilizing the Luhn modulo-10 algorithm alongside expiration date verification against current system time.
- **Lottie Success Animation:** Simulated processing spinner followed by an animated vector checkmark and automatic state persistence (`localStorage`).

### 🛡️ 7. UX Polish & Security Features
- **Content Protection:** Prevents unauthorized cut/copy on proprietary product descriptions, triggering animated toast alerts.
- **Interactive Wishlist:** Keyboard-accessible SVG heart toggle with micro-animations.
- **State Persistence:** Preserves user premium status across sessions using browser `localStorage`.

---

## 🗂️ Project Directory Structure

```plaintext
Lab Task 04/
├── index.html                   # Main storefront, gallery, 3D configurator & video player
├── style.css                    # Core design system, CSS tokens, glassmorphism & layout
├── script.js                    # Configurator logic, drag-and-drop, state & video player
├── payment.html                 # 3D interactive checkout & premium upgrade portal
├── payment.css                  # 3D card flip styles, credit card visuals & form styling
├── payment.js                   # Card formatting, Luhn validation & payment simulation
├── images/                      # High-resolution product photography
│   ├── aurora-1.jpg
│   ├── aurora-2.jpg
│   ├── aurora-3.jpg
│   ├── watch-1.webp
│   ├── watch-2.webp
│   ├── watch-3.jpg
│   ├── speaker-1.jpg
│   ├── speaker-2.jpg
│   └── speaker-3.jpg
├── videos/                      # Local showcase video assets
│   ├── headphones.mp4
│   ├── smartwatch.mp4
│   └── speaker.mp4
└── README.md                    # Comprehensive repository documentation
```

---

## 🛠️ Technology Stack

| Layer | Technologies / APIs Utilized |
| :--- | :--- |
| **Structure & Semantics** | HTML5 Semantic Elements, Accessible ARIA Attributes, SVG Graphics |
| **Styling & Animation** | Vanilla CSS3, CSS Custom Properties (Variables), 3D Transforms (`rotateX`, `rotateY`, `perspective`), CSS Flexbox & CSS Grid, Glassmorphism, Google Fonts (`Bricolage Grotesque`, `Instrument Sans`) |
| **Client-Side Logic** | Vanilla JavaScript (ES6+), Event Delegation, HTML5 Drag & Drop API, HTML5 Media API, Fullscreen API, Picture-in-Picture API, Web Storage API (`localStorage`) |
| **Algorithms** | Luhn Algorithm (Modulo 10 Credit Card Verification) |
| **Motion & Graphics** | Lottie-Web (JSON vector animation player) |

---

## 🚀 Getting Started

No build steps, node modules, or bundlers are required. The project is crafted using native web standards.

### Prerequisites
A modern web browser supporting ES6, CSS 3D transforms, and HTML5 video (Google Chrome, Mozilla Firefox, Microsoft Edge, or Apple Safari).

### Installation & Launch

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohsinali1001/Full-Stack-Development.git
   cd "Full-Stack-Development/Lab Task 04"
   ```

2. **Run locally using an HTTP server:**
   Because the project loads video assets and Lottie animations, serving via a local server is recommended:
   
   *Using VS Code Live Server:*
   - Right-click `index.html` and choose **"Open with Live Server"**.

   *Using Python:*
   ```bash
   python -m http.server 3000
   ```
   Navigate to `http://localhost:3000` in your browser.

   *Using Node.js (`npx serve`):*
   ```bash
   npx serve .
   ```

3. **Direct File Access:**
   You can also double-click `index.html` directly in your file explorer to open it in your default web browser.

---

## 🧪 Testing the Premium Checkout Simulation

To test the payment upgrade flow without using actual credentials:
1. Navigate to the storefront and click **"Go Premium"** in the top navigation or click on any locked premium swatch (Gold, Rose Gold, Aurora).
2. On the **Payment page** (`payment.html`), use the demo test details:
   - **Cardholder Name:** Any name (minimum 3 characters)
   - **Card Number:** `4242 4242 4242 4242` *(Passes the Luhn Algorithm check)*
   - **Expiry Date:** Any future date formatted as `MM/YY` (e.g., `12/28`)
   - **CVV:** Any 3 digits (e.g., `123`) — notice how the card automatically flips to the magnetic strip and signature panel when this field is focused!
3. Click **"Pay Rs 500"**. Upon success, your status will instantly elevate to **Premium User 👑**, unlocking all metallic finishes and gold-foil engraving across the store.

---

## 📱 Responsive & Cross-Browser Design

- **Fully Responsive:** Fluid layouts adapt seamlessly across desktops, tablets, and smartphones using CSS Grid, Flexbox, and `clamp()` typography.
- **High Contrast & Typography:** Clear visual hierarchy crafted with modern type pairings and accessible focus outlines (`:focus-visible`).
- **Touch & Pointer Friendly:** Supports pointer events for touch-screen rotation and standard tap alternatives for drag-and-drop actions.

---

## 👤 Author

**Mohsin Ali**
- GitHub: [@mohsinali1001](https://github.com/mohsinali1001)
- University Email: `245197@aack.au.edu.pk`
- Course: Full-Stack Development (FSD)

---

## 📄 License

This project was developed as part of academic coursework for **Full-Stack Development (Lab Task 04)**. Distributed under the [MIT License](LICENSE).
