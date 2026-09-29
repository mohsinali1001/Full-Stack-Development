# Interactive Product Configurator

A responsive, single-page **Interactive Product Configurator** for an eCommerce website, built with **HTML, CSS and JavaScript**. Users can view a product, customize it, interact with its preview, add it to a cart and submit the final configuration.

> **Course:** Full Stack Development (CS-301L) | **Lab:** 03
> **University:** Air University Islamabad, Kamra Campus | **Semester:** BSCS VB

---

## Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [How to Run](#how-to-run)
4. [Feature Walkthrough](#feature-walkthrough)
5. [JavaScript Events Used](#javascript-events-used)
6. [Responsive Design](#responsive-design)
7. [Code Organization](#code-organization)
8. [Lab Requirements Checklist](#lab-requirements-checklist)
9. [Known Notes](#known-notes)

---

## Features

- Product name, price and description display
- Copy/cut protection on the product description
- Color variant selection that changes the product image
- Custom engraving text with a live preview and a character counter
- 3D tilt effect that follows the mouse over the product preview
- Hover, focus and scroll feedback
- Drag-and-drop of the product into a cart area (plus an **Add to Cart** button for touch devices)
- Form validation and submission without a page reload
- Reset button that restores the whole configurator
- Fully responsive layout for desktop, laptop, tablet and mobile

---

## Project Structure

The whole application lives in one file:

```
index.php
 ├── <head>      Page title (PHP variable) and all CSS inside <style>
 ├── <body>      Layout: preview, form, result box, cart, message, back-to-top button
 └── <script>    All JavaScript (vanilla JS, no libraries)
README.md
```

There are no external libraries. The only external resources are the product images.

---

## How to Run

**Option 1: With PHP (as submitted)**
1. Place `index.php` in your server folder (for example `htdocs` in XAMPP).
2. Start Apache and open `http://localhost/index.php`.

**Option 2: Without PHP**
1. Rename `index.php` to `index.html`.
2. Replace `<?php echo $title; ?>` inside the `<title>` tag with plain text, and delete the PHP block at the top of the file.
3. Open the file in any browser.

An internet connection is needed to load the product images.

---

## Feature Walkthrough

### 1. Product Information and Description
Shows the product name (Smart Watch), the price (Rs 2000) and a short description.
The description is protected: trying to **copy** or **cut** it is blocked with `preventDefault()`. The description box flashes red and a warning message appears. Text selection and the right-click menu are also disabled on it.

### 2. Color / Variant Selection
Three round buttons (black, blue, red). Clicking one:
- highlights the selected button with a green border,
- swaps the product image to the matching variant,
- updates the label ("Selected color: Blue").

### 3. Custom Engraving
A text field with a **20 character limit**.
- The text appears on the product preview **in real time** while typing.
- A live counter shows `n/20 characters`.
- The counter turns **orange** near the limit (15+) and **red** at the limit (20).
- The input highlights in blue when focused and shows a red error state if invalid.

### 4. Interactive Product Preview
Moving the mouse over the product tilts it in 3D. The pointer position is calculated **relative to the preview element** using `getBoundingClientRect()`, so the effect works wherever the element is on the page. The tilt is disabled on small screens.

### 5. Hover Interaction
On hover the preview gets a stronger shadow and a status badge that changes from "Move mouse over product" to "Interactive Preview". When the mouse leaves, the product returns to its normal position.

### 6. Drag and Drop
The product preview is draggable. While it is dragged over the cart:
- the cart turns green, scales up and gets a glow.

When dropped:
- the cart count increases,
- the last added item is shown (color and engraving),
- the cart plays a small bounce animation,
- a confirmation message appears for 3 seconds.

Touch devices do not support HTML drag-and-drop, so an **Add to Cart** button does the same job.

### 7. Form Submission
Handled fully in JavaScript, with no page reload. Before submitting it checks that:
- a color has been selected,
- an engraving/name has been entered.

If not, a red error message is shown. If valid, a green summary shows the product, color, engraving, price and cart items. The summary is built with `textContent` so user input can never inject HTML.

### 8. Form Reset
Restores the configurator to its initial state: color selection, product image, engraving text and preview, counter, cart count, hover/drag states, result box and messages. A "Product configuration has been reset." message confirms it.

### 9. Scroll Feedback
- A green **progress bar** at the top shows how far the page is scrolled.
- The main container gets a stronger shadow once you scroll.
- A **back-to-top** button appears after scrolling down.

---

## JavaScript Events Used

The lab requires at least six events. This project uses **17**, all registered with `addEventListener`.

| Event | Used for |
|---|---|
| `click` | Color selection, reset, Add to Cart, back to top |
| `input` | Live engraving preview and character counter |
| `focus` | Highlight the engraving input |
| `blur` | Remove highlight, flag invalid input |
| `copy` | Block copying the description |
| `cut` | Block cutting the description |
| `contextmenu` | Block right-click on the description |
| `mousemove` | 3D tilt based on pointer position |
| `mouseenter` | Activate preview state and status badge |
| `mouseleave` | Reset preview state and tilt |
| `dragstart` | Begin dragging the product |
| `dragover` | Allow dropping and highlight the cart |
| `dragleave` | Remove the cart highlight |
| `drop` | Add the product to the cart |
| `dragend` | Clean up drag state |
| `submit` | Validate and show the configuration |
| `scroll` | Progress bar, shadow and back-to-top button |
| `DOMContentLoaded` | Start the script once the page is ready |

---

## Responsive Design

Built with flexbox, `min()`, `aspect-ratio`, `flex-wrap` and media queries:

| Breakpoint | Behavior |
|---|---|
| Desktop / laptop | Preview, details and cart laid out side by side |
| `max-width: 900px` (tablet) | Preview centered, details take full width |
| `max-width: 600px` (mobile) | Single column, full-width buttons, tilt effect disabled |
| `max-width: 400px` (small mobile) | Tighter spacing and smaller headings and color buttons |

No horizontal scrolling is needed at any size. Long text wraps with `overflow-wrap`.

**Accessibility:** visible keyboard focus outlines, `aria-label` and `aria-pressed` on color buttons, `aria-live` on messages, and a `prefers-reduced-motion` rule that turns off animations for users who request it.

---

## Code Organization

The JavaScript is grouped into clearly commented sections that match the lab requirements:

1. DOM elements and state variables
2. Helper functions: `capitalize()`, `showMessage()`, `showResult()`, `addToCart()`
3. Variant selection
4. Engraving (input, focus, blur)
5. Description protection (copy, cut)
6. Interactive preview (mousemove)
7. Hover (mouseenter, mouseleave)
8. Drag and drop
9. Form submission
10. Form reset
11. Scroll feedback

Variable and function names describe what they do (for example `selectedColor`, `cartCount`, `blockDescriptionAction`).

---

## Lab Requirements Checklist

| # | Requirement | Status |
|---|---|---|
| 1 | Product info and copy/cut-protected description | Done |
| 2 | Variant selection updates the preview | Done |
| 3 | Real-time engraving with limit and feedback | Done |
| 4 | Interactive preview using relative pointer position | Done |
| 5 | Hover enter/leave interaction | Done |
| 6 | Drag-and-drop to cart with visual response and confirmation | Done |
| 7 | JavaScript form submission with validation | Done |
| 8 | Reset with feedback | Done |
| 9 | Responsive on desktop, laptop, tablet and mobile | Done |
| 10 | Visual feedback for all listed actions, including scrolling | Done |
| - | At least six JavaScript events, using event listeners | Done (17) |

---

## Known Notes

- The blue and red product images are hotlinked Google thumbnails, so they may stop loading if the links expire. Replace them in the `productVariants` object in the script if needed.
- Drag-and-drop is a desktop feature; mobile users use the **Add to Cart** button.
- The cart is not saved. Refreshing the page resets it.
