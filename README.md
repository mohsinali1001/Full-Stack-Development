# ⚡ Techify Atelier | Full-Stack Product Customizer & E-Commerce Platform

[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![jQuery](https://img.shields.io/badge/jQuery-3.7.1-0769AD?logo=jquery&logoColor=white)](https://jquery.com/)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Semantic_Markup-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Modern_Design_Tokens-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Lottie Animations](https://img.shields.io/badge/Lottie-Vector_Animation-00DDB3?logo=airtable&logoColor=white)](https://airbnb.io/lottie/)
[![Full Stack Development](https://img.shields.io/badge/Coursework-FSD_Lab_Task_05-8b5cf6)](#)

> **Techify Atelier** is an end-to-end full-stack e-commerce web application featuring an Express.js RESTful backend, asynchronous jQuery AJAX communication, a pointer-tracking 3D interactive product configurator, live SVG recoloring, custom text engraving, an HTML5 spatial drag-and-drop shopping cart, in-card dual-media previews, a cinematic custom video player with keyboard accessibility, and a 3D interactive credit card payment simulator with client-side Luhn verification.

---

## 📑 Table of Contents

- [Architectural Overview](#-architectural-overview)
- [Key Features](#-key-features)
  - [1. Full-Stack Client-Server Architecture & REST API](#1-full-stack-client-server-architecture--rest-api)
  - [2. Dynamic Product Catalog & Dual-Media Cards](#2-dynamic-product-catalog--dual-media-cards)
  - [3. Product Management & Add Product Form](#3-product-management--add-product-form)
  - [4. Interactive 3D Tilt Configurator & Vector Stage](#4-interactive-3d-tilt-configurator--vector-stage)
  - [5. Live Custom Engraving & Freemium Tier Control](#5-live-custom-engraving--freemium-tier-control)
  - [6. HTML5 Drag-and-Drop Shopping Cart with Backend Sync](#6-html5-drag-and-drop-shopping-cart-with-backend-sync)
  - [7. Cinematic Custom Video Showcase Player](#7-cinematic-custom-video-showcase-player)
  - [8. 3D Interactive Payment Gateway & Verification](#8-3d-interactive-payment-gateway--verification)
  - [9. UX Polish, Toast Notifications & Content Protection](#9-ux-polish-toast-notifications--content-protection)
- [Technology Stack](#️-technology-stack)
- [Backend REST API Reference](#-backend-rest-api-reference)
- [Project Directory Structure](#-project-directory-structure)
- [Getting Started & Installation](#-getting-started--installation)
  - [Prerequisites](#prerequisites)
  - [1. Backend Setup](#1-backend-setup)
  - [2. Frontend Launch](#2-frontend-launch)
- [Demonstration & Testing Guide](#-demonstration--testing-guide)
  - [Testing Dynamic API Catalog Loading](#testing-dynamic-api-catalog-loading)
  - [Testing Add Product Submission](#testing-add-product-submission)
  - [Testing Cart Configuration Dispatch](#testing-cart-configuration-dispatch)
  - [Testing the 3D Payment Gateway](#testing-the-3d-payment-gateway)
- [Author & Academic Coursework](#-author--academic-coursework)
- [License](#-license)

---

## 🏛️ Architectural Overview

The application is structured around a decoupled **Client-Server Architecture**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           BROWSER FRONTEND                              │
│                                                                         │
│  ┌───────────────────────┐  ┌─────────────────┐  ┌───────────────────┐  │
│  │   Product Catalog     │  │  3D Customizer  │  │   HTML5 Cart      │  │
│  │  (Dual-Media Cards)   │  │  & Engraving    │  │  (Drag & Drop)    │  │
│  └──────────┬────────────┘  └────────┬────────┘  └─────────┬─────────┘  │
│             │                        │                     │            │
│             │ jQuery AJAX (GET/POST) │                     │            │
└─────────────┼────────────────────────┼─────────────────────┼────────────┘
              │                        │                     │
              ▼                        ▼                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      EXPRESS.JS REST API (Port 5000)                    │
│                                                                         │
│  • CORS Enabled Cross-Origin Middleware                                │
│  • JSON Body Parser (express.json)                                      │
│  • Request Logging Middleware                                           │
│  • Input Validation & Error Handling (400 / 404 / 500)                 │
│                                                                         │
│   GET  /api/products          POST /api/products                        │
│   GET  /api/products/:id      POST /api/configurations                  │
└──────────────────────────────────┬──────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           DATA STORAGE LAYER                            │
│                                                                         │
│  • backend/data/products.json (Seed catalog & variants)                │
│  • In-Memory Product Registry (Dynamic submissions & ID generation)    │
│  • Browser localStorage (Client-side premium tier status persistence)   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

### 1. Full-Stack Client-Server Architecture & REST API
- **Express.js Server:** Hosted on `http://localhost:5000` with native JSON body parsing and custom console logging middleware (`${req.method} ${req.url}`).
- **Cross-Origin Resource Sharing (CORS):** Fully integrated via `cors` to allow seamless client-server interaction without origin conflicts.
- **RESTful Endpoints:** Supports querying all products, querying a single item by numeric ID, receiving new product additions, and receiving tailored customer configurations.
- **Graceful Error Handling:** Robust HTTP status code responses (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, and uncaught exception safety).

### 2. Dynamic Product Catalog & Dual-Media Cards
- **Asynchronous Catalog Bootstrap:** Upon document ready (`jQuery(document).ready`), the client triggers `jQuery.ajax` to fetch the catalog from `GET /api/products` and dynamically builds the product grid.
- **Dual-Media Switcher:** Every catalog card provides a live button toggle between high-definition photography and an embedded showcase video loop.
- **In-Card Media Controls:** Direct play/pause and mute/unmute buttons right on the catalog card with hover feedback.
- **Multi-Tier Asset Fallback System:** Inspects local paths (`images/`, `videos/`) and gracefully falls back to remote CDN URLs or inline SVG illustrations if local files are missing.

### 3. Product Management & Add Product Form
- **Dynamic Product Creator:** Dedicated storefront section (`#add-product-section`) allowing creation of custom products with real-time validation.
- **Rich Attribute Configuration:** Configure product name, device category (`headphones`, `watch`, `speaker`, `earbuds`), price in PKR, description, image assets, color hex codes with premium flags, and tiered upgrade variants.
- **Quick Demo Filler:** Includes a **"Fill Sample"** button to automatically pre-populate valid test data with one click.
- **Interactive UI Feedback:** 
  - Dynamic button loading state (`submitBtn.prop('disabled', true).text('Adding Product...')`).
  - Distinct alert notification banners for success and failure.
  - Live preview card rendering upon successful addition, showcasing the submitted product data returned from the server.
  - Submits asynchronously to `POST /api/products` via `jQuery.ajax`.

### 4. Interactive 3D Tilt Configurator & Vector Stage
- **Mouse-Tracking 3D Perspective:** Interactive stage reacting to pointer movement with real-time calculated CSS 3D rotation (`rotateX`, `rotateY`) and a dynamic specular glare illumination overlay.
- **Live SVG Vector Engine:** Dynamically recolors complex device vector elements in real time based on active finish selections.
- **Tier & Variant Pricing:** Interactive dropdown switching between *Standard*, *Pro*, and *Max* tiers with instant dynamic price calculation in Pakistani Rupees (`Rs`).

### 5. Live Custom Engraving & Freemium Tier Control
- **Real-Time Name Engraving:** Live SVG text overlay placed directly on the product's finish, synchronized with the user's keystrokes.
- **Character Counter & Bounds Checking:** 20-character counter that turns red and alerts the user when reaching maximum capacity.
- **Free vs. Premium Finishes:**
  - *Free Finishes:* Midnight, Ocean, and Coral.
  - *Premium Finishes:* Gold, Rose Gold, and Aurora with shimmering metallic CSS gradients.
  - *Gold-Foil Engraving:* Specialized metallic foil text rendering for premium subscribers.
- **Dynamic Lock Triggers:** Unauthenticated/free users clicking locked finishes receive upgrade prompts routing directly to the 3D payment checkout.

### 6. HTML5 Drag-and-Drop Shopping Cart with Backend Sync
- **Spatial Drag-and-Drop:** Intuitive interaction utilizing the HTML5 Drag and Drop API—users can drag the 3D product stage directly and release it over the shopping cart drop zone.
- **Accessible Tap Alternative:** Mobile-friendly and keyboard-accessible "Add to cart (tap)" button for non-drag environments.
- **Cart Aggregation:** Live item count badge, running total computation, and detailed itemized receipts detailing the chosen finish, variant, and personalized engraving.
- **Backend Order Synchronization:** When an item is added to the cart, the client dispatches a `jQuery.ajax` POST request to `/api/configurations` with the exact product customization payload, logging the transaction on the backend console.

### 7. Cinematic Custom Video Showcase Player
- **Zero-Dependency Player:** Built natively on top of the HTML5 Media API without heavy external dependencies.
- **Interactive Chapter System:** Clickable chapter sidebar and seekbar progress markers with time-synced caption display.
- **Advanced Playback Controls:** Scrub bar with progress fill, variable playback rate (0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x), volume slider, loop toggle, Picture-in-Picture (PiP), and native Fullscreen API integration.
- **Full Keyboard Accessibility:**
  | Shortcut | Action |
  | :--- | :--- |
  | <kbd>Space</kbd> / <kbd>K</kbd> | Play / Pause |
  | <kbd>J</kbd> / <kbd>L</kbd> | Seek Backward / Forward 10 seconds |
  | <kbd>←</kbd> / <kbd>→</kbd> | Step Backward / Forward 5 seconds |
  | <kbd>↑</kbd> / <kbd>↓</kbd> | Adjust Volume up / down by 10% |
  | <kbd>M</kbd> | Toggle Mute |
  | <kbd>F</kbd> | Toggle Fullscreen |

### 8. 3D Interactive Payment Gateway & Verification (`payment.html`)
- **3D Card Flip Animation:** Realistic CSS 3D transform that automatically flips the card to reveal the magnetic stripe and signature panel when the user focuses on the CVV input, and flips back on blur.
- **Live Card Surface Mirroring:** Input data is instantaneously reflected on the virtual credit card surface, including uppercase cardholder name, 16-digit card number formatted in 4-digit chunks, expiration date, and CVV masking.
- **Luhn Modulo-10 Algorithm Validation:** Rigorous client-side card number check ensuring valid card syntax according to ISO/IEC 7812.
- **Expiration Validation:** Compares `MM/YY` inputs against the current system date to prevent expired cards.
- **Lottie Animated Confirmation:** Displays a 2-second simulated processing state followed by a vector checkmark animation and client-side status persistence via `localStorage`.

### 9. UX Polish, Toast Notifications & Content Protection
- **Copy Protection:** Prevents unauthorized cut/copy on product descriptions, triggering animated warning toasts.
- **State Persistence:** Preserves premium membership status across browser sessions using `localStorage.getItem('techifyPremium')`.
- **Keyboard-Accessible Wishlist:** Interactive SVG heart toggle with micro-animations and ARIA compliance.

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools | Purpose |
| :--- | :--- | :--- |
| **Backend Runtime** | [Node.js](https://nodejs.org/) (v18+) | JavaScript runtime environment for backend services |
| **Web Framework** | [Express.js](https://expressjs.com/) (v5.x) | REST API endpoints, routing, static data handling, and middleware |
| **Middleware** | `cors`, `express.json` | Cross-Origin resource sharing and JSON body parsing |
| **Data Layer** | JSON File Store (`backend/data/products.json`) | Persistent product seed data and variant definitions |
| **Client-Side Framework** | [jQuery](https://jquery.com/) (v3.7.1) | Asynchronous AJAX requests, DOM manipulation, and event handling |
| **Client Scripting** | Vanilla JavaScript (ES6+) | 3D tilt geometry, SVG recoloring, canvas & audio/video controls |
| **HTML & Semantics** | HTML5 Semantic Tags & ARIA | Accessible markup, video elements, and drag-and-drop zones |
| **Styling & 3D Visuals** | Modern CSS3 | Custom CSS variables, Glassmorphism, CSS 3D transforms (`rotateX`, `rotateY`, `perspective`) |
| **Typography** | Google Fonts | `Bricolage Grotesque` (Headings) and `Instrument Sans` (UI Body) |
| **Vector Animation** | [Lottie-Web](https://airbnb.io/lottie/) | JSON-driven vector animation for payment confirmation |
| **Verification Algorithm** | Luhn Algorithm (Modulo 10) | Mathematical credit card number integrity verification |

---

## 📡 Backend REST API Reference

The Express backend listens on `http://localhost:5000` by default.

### 1. Health Check
- **Endpoint:** `GET /`
- **Description:** Verifies that the Express backend service is running.
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product Configurator Backend is running"
  }
  ```

### 2. Retrieve All Products
- **Endpoint:** `GET /api/products`
- **Description:** Returns the complete list of available catalog products, including color finishes, variant tiers, pricing, and media paths.
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "products": [
      {
        "id": 1,
        "name": "Aurora Pro Headphones",
        "type": "headphones",
        "price": 24999,
        "currency": "PKR",
        "description": "Active noise cancelling, 40-hour battery and studio-tuned drivers...",
        "images": ["images/aurora-1.jpg", "images/aurora-2.jpg", "images/aurora-3.jpg"],
        "remoteImages": ["https://..."],
        "video": "videos/headphones.mp4",
        "colors": [
          { "name": "Midnight", "code": "#1e293b", "premium": false },
          { "name": "Gold", "code": "#d4a017", "premium": true }
        ],
        "variants": [
          { "name": "Standard", "additionalPrice": 0 },
          { "name": "Pro", "additionalPrice": 5000 }
        ]
      }
    ]
  }
  ```

### 3. Retrieve Single Product
- **Endpoint:** `GET /api/products/:id`
- **Description:** Returns details for a specific product by its numeric ID.
- **Parameters:** `id` (integer)
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "product": { "id": 1, "name": "Aurora Pro Headphones", "..." : "..." }
  }
  ```
- **Error Response (404 Not Found):**
  ```json
  {
    "success": false,
    "message": "Product not found"
  }
  ```

### 4. Create New Product (Lab Demonstration)
- **Endpoint:** `POST /api/products`
- **Description:** Receives a new product specification, assigns an incremented ID, logs details to the server console, and returns the newly registered product.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "name": "Nova Wireless Earbuds",
    "type": "earbuds",
    "price": 18999,
    "currency": "PKR",
    "description": "True wireless earbuds with active noise cancellation.",
    "images": ["images/earbuds-1.jpg"],
    "remoteImages": ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df"],
    "colors": [
      { "name": "Matte Black", "code": "#111111", "premium": false },
      { "name": "Metallic Gold", "code": "#d4a017", "premium": true }
    ],
    "variants": [
      { "name": "Standard", "additionalPrice": 0 },
      { "name": "Pro Wireless", "additionalPrice": 3000 }
    ]
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Product received successfully",
    "product": {
      "id": 4,
      "name": "Nova Wireless Earbuds",
      "type": "earbuds",
      "price": 18999,
      "currency": "PKR",
      "..." : "..."
    }
  }
  ```

### 5. Submit Customized Product Configuration
- **Endpoint:** `POST /api/configurations`
- **Description:** Invoked whenever a user drops or adds a customized item to the cart, sending selected variants, finishes, engraving text, and computed totals to the server.
- **Request Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "productId": 1,
    "productName": "Aurora Pro Headphones",
    "color": "Gold",
    "premiumFinish": true,
    "variant": "Pro",
    "price": 29999,
    "engraving": "MOHSIN ALI",
    "foil": true
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "success": true,
    "message": "Product configuration received successfully",
    "configuration": { "..." : "..." }
  }
  ```

---

## 🗂️ Project Directory Structure

```plaintext
Full-Stack-Development-lab_task_04/
├── backend/                             # Express.js REST API Server
│   ├── data/
│   │   └── products.json                # Seed product catalog, finishes & variants
│   ├── node_modules/                    # Backend dependencies
│   ├── .gitignore                       # Git ignore rules for backend
│   ├── package.json                     # Backend npm scripts and dependencies
│   ├── package-lock.json                # Locked dependency tree
│   └── server.js                        # Express server entry point & API route handlers
├── images/                              # High-resolution product imagery & fallbacks
│   ├── aurora-1.jpg
│   ├── aurora-2.jpg
│   ├── aurora-3.jpg
│   ├── watch-1.webp
│   ├── watch-2.webp
│   ├── watch-3.jpg
│   ├── speaker-1.jpg
│   ├── speaker-2.jpg
│   └── speaker-3.jpg
├── videos/                              # Local showcase video loops
│   ├── headphones.mp4
│   ├── smartwatch.mp4
│   └── speaker.mp4
├── index.html                           # Main storefront, gallery, 3D customizer & cart
├── script.js                            # Client-side AJAX controller, 3D math & UI logic
├── style.css                            # Global design system, glassmorphism tokens & layouts
├── payment.html                         # 3D interactive checkout & premium upgrade portal
├── payment.css                          # 3D card flip styles & checkout form UI
├── payment.js                           # Card input masking, Luhn validation & state logic
└── README.md                            # Complete full-stack project documentation
```

---

## 🚀 Getting Started & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (Version 18.x or newer recommended)
- A modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, or Apple Safari)

---

### 1. Backend Setup

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Launch the Express server:
   ```bash
   npm start
   ```
   *Expected output:*
   ```plaintext
   Server running at http://localhost:5000
   ```

---

### 2. Frontend Launch

In a separate terminal window, serve the root directory containing `index.html`.

**Option A: Using VS Code Live Server (Recommended)**
- Right-click `index.html` in VS Code and select **"Open with Live Server"**.

**Option B: Using Python HTTP Server**
```bash
python -m http.server 3000
```
Navigate to `http://localhost:3000` in your browser.

**Option C: Using Node.js `npx serve`**
```bash
npx serve .
```

> 💡 **Note:** Make sure the Express backend (`http://localhost:5000`) is running before loading the frontend so that the dynamic catalog and AJAX operations initialize properly.

---

## 🧪 Demonstration & Testing Guide

### Testing Dynamic API Catalog Loading
1. Start the backend server (`npm start` inside `backend/`).
2. Open `index.html` in your browser.
3. Observe the catalog grid loading dynamically via `jQuery.ajax` from `http://localhost:5000/api/products`.
4. Check your browser developer console (<kbd>F12</kbd> -> Console) to see:
   ```plaintext
   Products received from backend: { success: true, products: [...] }
   Products loaded: [...]
   ```
5. Check the backend server terminal to observe the custom middleware logging:
   ```plaintext
   GET /api/products
   ```

### Testing Add Product Submission
1. On the main storefront page, click **"➕ Add Product"** in the navigation bar or the **"➕ Add New Product (Demo)"** hero button.
2. Click the **"Fill Sample"** button to automatically populate the form with sample data, or enter custom details.
3. Click **"Add Product"**.
4. Observe the button loading state (`Adding Product...`), followed by the green success alert banner.
5. Inspect the newly rendered card in the **"Submitted Product (Server Response)"** container displaying the assigned ID and attributes.
6. Look at your backend terminal to see the logged product payload:
   ```plaintext
   ========================================
   NEW PRODUCT RECEIVED
   ========================================
   { id: 4, name: '...', price: 18999, ... }
   ========================================
   PRODUCT RECEIVED SUCCESSFULLY
   ========================================
   ```

### Testing Cart Configuration Dispatch
1. Click **"Customize"** on any product in the gallery.
2. Select a finish color, variant, and type a custom engraving (e.g. `MOHSIN ALI`).
3. Drag the 3D preview stage and drop it into the cart zone, or tap **"Add to cart (tap)"**.
4. Observe the cart status updating with:
   ```plaintext
   ✓ Configuration sent to server
   ```
5. View your backend terminal to confirm the received configuration payload:
   ```plaintext
   Received configuration:
   { productId: 1, productName: '...', color: '...', price: 29999, ... }
   ```

### Testing the 3D Payment Gateway
1. Click **"Go Premium"** in the navigation header or click any locked premium swatch (Gold, Rose Gold, Aurora).
2. On `payment.html`, interact with the form using demo test data:
   - **Cardholder Name:** `Mohsin Ali`
   - **Card Number:** `4242 4242 4242 4242` *(Passes the Luhn Algorithm check)*
   - **Expiry Date:** Any future date formatted as `MM/YY` (e.g. `12/28`)
   - **CVV:** `123` *(Notice how the 3D card flips to the signature panel on focus!)*
3. Click **"Pay Rs 500"**.
4. A 2-second processing spinner will appear, followed by a Lottie vector checkmark and persistent unlock.
5. You will be redirected back to the storefront with the **"Premium User 👑"** badge activated and all metallic finishes unlocked.

---

## 👤 Author & Academic Coursework

- **Author:** Mohsin Ali
- **GitHub:** [@mohsinali1001](https://github.com/mohsinali1001)
- **University Email:** `245197@aack.au.edu.pk`
- **Course:** Full-Stack Development (FSD)
- **Institution:** Department of Computer Science & Software Engineering

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
