<?php
// PHP code goes here
$title = "Smart Watch | Interactive Product Configurator";
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title; ?></title>

    <style>
        /* ==========================================
           BASE
           ========================================== */
        * {
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: linear-gradient(135deg, red, black, blue) fixed;
            color: #1f2937;
        }

        /* Scroll progress bar (scroll event) */
        #scrollProgress {
            position: fixed;
            top: 0;
            left: 0;
            height: 5px;
            width: 0;
            background: #22c55e;
            z-index: 1000;
            transition: width 0.1s linear;
        }

        /* Back to top button (scroll event) */
        #backToTop {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 46px;
            height: 46px;
            border: none;
            border-radius: 50%;
            background: #111;
            color: white;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease, visibility 0.3s;
            z-index: 1000;
        }

        #backToTop.visible {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }

        #backToTop:hover {
            background: #333;
        }

        /* ==========================================
           LAYOUT
           ========================================== */
        .container {
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
            width: min(1200px, calc(100% - 40px));
            margin: 30px auto;
            padding: 30px;
            background: white;
            gap: 30px;
            border-radius: 16px;
            transition: box-shadow 0.3s ease;
        }

        .container.scrolled {
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.45);
        }

        /* ==========================================
           PRODUCT PREVIEW
           ========================================== */
        .product_img {
            position: relative;
            width: 500px;
            max-width: 100%;
            aspect-ratio: 1 / 1;
            height: auto;
            perspective: 1000px;
            transition: box-shadow 0.3s ease, opacity 0.2s ease;
            flex-shrink: 1;
            cursor: grab;
            overflow: hidden;
            border-radius: 12px;
        }

        #productImage {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.15s ease-out, filter 0.4s ease;
            transform-style: preserve-3d;
            -webkit-user-drag: none;
        }

        .product_img.active-preview {
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
        }

        .product_img.dragging {
            opacity: 0.6;
            cursor: grabbing;
        }

        #engravingPreview {
            position: absolute;
            bottom: 50px;
            left: 50%;
            transform: translateX(-50%);
            max-width: 90%;
            font-size: 24px;
            font-weight: bold;
            color: #e5e7eb;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
            text-align: center;
            overflow-wrap: anywhere;
            pointer-events: none;
        }

        .preview-status {
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 14px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 20px;
            font-size: 13px;
            white-space: nowrap;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        }

        .product_img.active-preview .preview-status {
            opacity: 1;
        }

        /* ==========================================
           PRODUCT DETAILS
           ========================================== */
        .product_details {
            flex: 1 1 350px;
            min-width: 0;
        }

        .product_details h1 {
            margin-top: 0;
        }

        .price {
            font-size: 22px;
            font-weight: bold;
            color: #166534;
        }

        .color-selector p {
            margin-bottom: 10px;
            font-weight: bold;
        }

        .color-option {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: 2px solid #ddd;
            cursor: pointer;
            margin-right: 10px;
            transition: transform 0.2s ease, border-color 0.2s ease;
        }

        .color-option:hover {
            transform: scale(1.15);
        }

        .color-option:focus-visible,
        #resetConfiguration:focus-visible,
        #submitConfiguration:focus-visible,
        #addToCartBtn:focus-visible,
        #backToTop:focus-visible {
            outline: 3px solid #2563eb;
            outline-offset: 3px;
        }

        .black {
            background: black;
        }

        .blue {
            background: blue;
        }

        .red {
            background: red;
        }

        .color-option.selected {
            border: 3px solid #22c55e;
            transform: scale(1.15);
        }

        #selectedColorLabel {
            display: block;
            margin-top: 8px;
            font-size: 14px;
            color: #555;
        }

        /* Engraving */
        .engraving-section {
            margin-top: 20px;
        }

        .engraving-section label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
        }

        #engraving {
            width: 100%;
            max-width: 300px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            font-size: 16px;
            transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
        }

        #engraving.focused {
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
            background: #f0f6ff;
        }

        #engraving.invalid {
            border-color: #b91c1c;
            box-shadow: 0 0 0 3px rgba(185, 28, 28, 0.2);
        }

        .engraving-section small {
            display: block;
            margin-top: 5px;
            color: #666;
            transition: color 0.3s ease;
        }

        .engraving-section small.warning {
            color: #d97706;
            font-weight: bold;
        }

        .engraving-section small.limit {
            color: #b91c1c;
            font-weight: bold;
        }

        /* Description (copy / cut protected) */
        .Description {
            max-width: 100%;
            line-height: 1.6;
            overflow-wrap: break-word;
            user-select: none;
            -webkit-user-select: none;
            padding: 12px;
            background: #f9fafb;
            border-left: 4px solid #999;
            border-radius: 6px;
        }

        .Description.blocked {
            border-left-color: #b91c1c;
            background: #fff1f1;
        }

        /* ==========================================
           BUTTONS
           ========================================== */
        .form-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            margin-top: 20px;
        }

        .form-buttons button {
            flex: 1 1 150px;
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #submitConfiguration {
            background: #111;
            color: white;
        }

        #submitConfiguration:hover {
            background: #333;
            transform: translateY(-2px);
        }

        #resetConfiguration {
            background: #e5e5e5;
            color: #222;
        }

        #resetConfiguration:hover {
            background: #ccc;
            transform: translateY(-2px);
        }

        /* ==========================================
           RESULT + MESSAGE
           ========================================== */
        #submissionResult {
            flex: 1 1 100%;
            padding: 15px;
            border-radius: 8px;
            display: none;
            background: #dff6e4;
            color: #166534;
            overflow-wrap: break-word;
        }

        #submissionResult.error {
            background: #ffe1e1;
            color: #b91c1c;
        }

        #message {
            flex: 1 1 100%;
            margin: 0;
            padding: 0;
            overflow-wrap: break-word;
        }

        #message.show {
            padding: 10px;
            border-radius: 6px;
        }

        #message.success {
            background: #dff6e4;
            color: green;
        }

        #message.info {
            background: #e5e7eb;
            color: #374151;
        }

        #message.warn {
            background: #fff4d6;
            color: #92400e;
        }

        /* ==========================================
           CART
           ========================================== */
        #cartDropArea {
            width: 250px;
            max-width: 100%;
            min-height: 250px;
            border: 3px dashed #999;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 10px;
            transition: all 0.3s ease;
            background: #f8f8f8;
            flex-shrink: 1;
        }

        #cartDropArea h3 {
            margin: 10px 0 5px;
        }

        #cartDropArea p {
            margin: 5px 0;
            color: #666;
        }

        .cart-icon {
            font-size: 50px;
        }

        .cart-info {
            margin-top: 15px;
            font-weight: bold;
        }

        #cartLast {
            font-size: 13px;
            color: #555;
            margin-top: 6px;
            overflow-wrap: anywhere;
        }

        #cartDropArea.drag-over {
            background: #dff6e4;
            border-color: green;
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(0, 128, 0, 0.25);
        }

        #cartDropArea.bump {
            animation: bump 0.4s ease;
        }

        @keyframes bump {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }

        #addToCartBtn {
            margin-top: 10px;
            padding: 8px 14px;
            border: none;
            border-radius: 8px;
            background: #166534;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background 0.3s ease;
        }

        #addToCartBtn:hover {
            background: #14532d;
        }

        /* ==========================================
           TABLET
           ========================================== */
        @media (max-width: 900px) {
            .container {
                width: calc(100% - 30px);
                margin: 15px auto;
                padding: 20px;
                gap: 25px;
            }

            .product_img {
                width: 420px;
                margin: 0 auto;
            }

            .product_details {
                flex: 1 1 100%;
            }

            #cartDropArea {
                margin: 0 auto;
            }
        }

        /* ==========================================
           MOBILE
           ========================================== */
        @media (max-width: 600px) {
            .container {
                flex-direction: column;
                align-items: stretch;
                width: calc(100% - 20px);
                margin: 10px auto;
                padding: 15px;
                gap: 20px;
                border-radius: 12px;
            }

            .product_img {
                width: 100%;
                max-width: 400px;
                margin: 0 auto;
                perspective: none;
            }

            #productImage {
                transform: none !important;
            }

            .product_details h1 {
                font-size: 26px;
            }

            .product_details h2 {
                font-size: 22px;
            }

            #engraving {
                max-width: none;
            }

            .form-buttons {
                flex-direction: column;
                width: 100%;
            }

            .form-buttons button {
                width: 100%;
                flex: none;
            }

            #cartDropArea {
                width: 100%;
                max-width: 350px;
                margin: 0 auto;
            }

            .Description {
                font-size: 15px;
            }

            #engravingPreview {
                font-size: 18px;
            }
        }

        @media (max-width: 400px) {
            .container {
                width: calc(100% - 10px);
                padding: 10px;
                margin: 5px auto;
            }

            .product_details h1 {
                font-size: 22px;
            }

            .product_details h2 {
                font-size: 19px;
            }

            .color-option {
                width: 32px;
                height: 32px;
            }

            .preview-status {
                font-size: 11px;
                padding: 6px 10px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            * {
                transition: none !important;
                animation: none !important;
            }
        }
    </style>
</head>

<body>

    <div id="scrollProgress"></div>

    <div class="container" id="pageContainer">

        <!-- PRODUCT PREVIEW (draggable) -->
        <div class="product_img" id="productPreview" draggable="true">

            <img id="productImage" draggable="false"
                src="https://hyperzone.pk/wp-content/uploads/2024/04/6ff8cadba2f05e5e0ae7a6d6c8861230.jpg"
                alt="Smart Watch">

            <div id="engravingPreview"></div>

            <div class="preview-status">Move mouse over product</div>
        </div>

        <!-- PRODUCT FORM -->
        <form id="productForm" class="product_details" novalidate>
            <h1>Product Detail</h1>
            <h2 class="product_name">Smart Watch</h2>
            <span class="price">Rs 2000</span>

            <div class="product_variant">
                <div class="color-selector">
                    <p>Choose Color:</p>

                    <button type="button" class="color-option black" data-color="black" aria-label="Black"
                        aria-pressed="false"></button>
                    <button type="button" class="color-option blue" data-color="blue" aria-label="Blue"
                        aria-pressed="false"></button>
                    <button type="button" class="color-option red" data-color="red" aria-label="Red"
                        aria-pressed="false"></button>

                    <span id="selectedColorLabel">No color selected</span>
                </div>
            </div>

            <div class="engraving-section">
                <label for="engraving">Custom Product Name / Engraving</label>

                <input type="text" id="engraving" maxlength="20" placeholder="Enter your name" autocomplete="off">

                <small id="charCounter">
                    <span id="charCount">0</span>/20 characters
                </small>
            </div>

            <p class="Description" id="productDescription">Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                Cumque asperiores atque vero eaque nam repudiandae, cum tenetur excepturi architecto voluptas minima
                blanditiis? Quas explicabo repellendus officia libero repudiandae reprehenderit blanditiis sint
                aliquid, quis, voluptatum a corporis officiis fugiat, ex et aliquam vero? Aut, saepe qui.</p>

            <div class="form-buttons">
                <button type="submit" id="submitConfiguration">Submit Configuration</button>
                <button type="button" id="resetConfiguration">Reset</button>
            </div>
        </form>

        <div id="submissionResult" role="status" aria-live="polite"></div>

        <!-- CART / DROP AREA -->
        <div id="cartDropArea">
            <div class="cart-icon">🛒</div>
            <h3>Drop Product Here</h3>
            <p>Drag the product into this area</p>

            <div class="cart-info">
                Cart Items: <span id="cartCount">0</span>
            </div>
            <div id="cartLast"></div>

            <!-- Fallback for touch devices where drag-and-drop is not supported -->
            <button type="button" id="addToCartBtn">Add to Cart</button>
        </div>

        <p id="message" role="status" aria-live="polite"></p>
    </div>

    <button type="button" id="backToTop" aria-label="Back to top">↑</button>

    <script>
        document.addEventListener("DOMContentLoaded", function () {

            // ==========================================
            // DOM ELEMENTS
            // ==========================================
            const DEFAULT_IMAGE = "https://hyperzone.pk/wp-content/uploads/2024/04/6ff8cadba2f05e5e0ae7a6d6c8861230.jpg";
            const MAX_CHARS = 20;

            // Original product images for each color variant
            const productVariants = {
                black: "https://hyperzone.pk/wp-content/uploads/2024/04/6ff8cadba2f05e5e0ae7a6d6c8861230.jpg",
                blue: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQj6HE831T__9_J4SwPip44WIrQ0yRBW8yFEPg7_GUamsCj5-VGRuWvP-wE&s=10",
                red: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9DqiXaWMItBkSS89bv4PN4ySqH49JZf33pwPet3FYnSFDyasTZOhBXs5r&s=10"
            };

            const container = document.getElementById("pageContainer");
            const preview = document.getElementById("productPreview");
            const productImage = document.getElementById("productImage");
            const previewStatus = preview.querySelector(".preview-status");
            const engravingPreview = document.getElementById("engravingPreview");
            const engravingInput = document.getElementById("engraving");
            const charCount = document.getElementById("charCount");
            const charCounter = document.getElementById("charCounter");
            const colorButtons = document.querySelectorAll(".color-option");
            const colorLabel = document.getElementById("selectedColorLabel");
            const description = document.getElementById("productDescription");
            const form = document.getElementById("productForm");
            const resetBtn = document.getElementById("resetConfiguration");
            const submissionResult = document.getElementById("submissionResult");
            const cartArea = document.getElementById("cartDropArea");
            const cartCountEl = document.getElementById("cartCount");
            const cartLast = document.getElementById("cartLast");
            const addToCartBtn = document.getElementById("addToCartBtn");
            const message = document.getElementById("message");
            const scrollProgress = document.getElementById("scrollProgress");
            const backToTop = document.getElementById("backToTop");

            let selectedColor = "";
            let cartCount = 0;
            let messageTimer = null;

            // ==========================================
            // HELPERS
            // ==========================================
            function capitalize(text) {
                return text.charAt(0).toUpperCase() + text.slice(1);
            }

            // Shows a temporary feedback message (type: success | info | warn)
            function showMessage(text, type) {
                clearTimeout(messageTimer);
                message.textContent = text;
                message.className = "show " + type;

                messageTimer = setTimeout(function () {
                    message.className = "";
                    message.textContent = "";
                }, 3000);
            }

            function showResult(html, isError) {
                submissionResult.className = isError ? "error" : "";
                submissionResult.innerHTML = html;
                submissionResult.style.display = "block";
            }

            function addToCart(source) {
                cartCount++;
                cartCountEl.textContent = cartCount;

                const engraving = engravingInput.value.trim();
                const colorText = selectedColor ? capitalize(selectedColor) : "Default";
                cartLast.textContent = "Last added: Smart Watch (" + colorText +
                    (engraving ? ', "' + engraving + '"' : "") + ")";

                cartArea.classList.remove("bump");
                void cartArea.offsetWidth; // restart animation
                cartArea.classList.add("bump");

                showMessage("Smart Watch added to cart successfully!", "success");
            }

            // ==========================================
            // 2. VARIANT SELECTION  (click event)
            // ==========================================
            colorButtons.forEach(function (button) {
                button.addEventListener("click", function () {
                    selectedColor = button.dataset.color;

                    colorButtons.forEach(function (b) {
                        b.classList.remove("selected");
                        b.setAttribute("aria-pressed", "false");
                    });
                    button.classList.add("selected");
                    button.setAttribute("aria-pressed", "true");

                    productImage.src = productVariants[selectedColor];
                    colorLabel.textContent = "Selected color: " + capitalize(selectedColor);
                    submissionResult.style.display = "none";
                });
            });

            // ==========================================
            // 3. ENGRAVING  (input, focus, blur events)
            // ==========================================
            engravingInput.addEventListener("input", function () {
                const text = engravingInput.value;

                engravingPreview.textContent = text;   // real-time preview
                charCount.textContent = text.length;   // counter

                charCounter.classList.remove("warning", "limit");
                if (text.length >= MAX_CHARS) {
                    charCounter.classList.add("limit");
                } else if (text.length >= MAX_CHARS - 5) {
                    charCounter.classList.add("warning");
                }

                if (text.trim() !== "") {
                    engravingInput.classList.remove("invalid");
                }
            });

            engravingInput.addEventListener("focus", function () {
                engravingInput.classList.add("focused");
            });

            engravingInput.addEventListener("blur", function () {
                engravingInput.classList.remove("focused");
                if (engravingInput.value.trim() === "" && engravingInput.value !== "") {
                    engravingInput.classList.add("invalid");
                }
            });

            // ==========================================
            // 1. DESCRIPTION PROTECTION  (copy, cut events)
            // ==========================================
            function blockDescriptionAction(event) {
                event.preventDefault();
                description.classList.add("blocked");
                showMessage("Copying or cutting the product description is not allowed.", "warn");

                setTimeout(function () {
                    description.classList.remove("blocked");
                }, 1500);
            }

            description.addEventListener("copy", blockDescriptionAction);
            description.addEventListener("cut", blockDescriptionAction);
            // Also block the right-click menu on the protected text
            description.addEventListener("contextmenu", function (event) {
                event.preventDefault();
            });

            // ==========================================
            // 4. INTERACTIVE PREVIEW  (mousemove event)
            // ==========================================
            preview.addEventListener("mousemove", function (event) {
                // Pointer position relative to the preview element
                const rect = preview.getBoundingClientRect();
                const x = (event.clientX - rect.left) / rect.width;
                const y = (event.clientY - rect.top) / rect.height;

                const rotateY = (x - 0.5) * 20;
                const rotateX = (0.5 - y) * 20;

                productImage.style.transform =
                    "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg) scale(1.03)";
            });

            // ==========================================
            // 5. HOVER  (mouseenter, mouseleave events)
            // ==========================================
            preview.addEventListener("mouseenter", function () {
                preview.classList.add("active-preview");
                previewStatus.textContent = "Interactive Preview";
            });

            preview.addEventListener("mouseleave", function () {
                preview.classList.remove("active-preview");
                productImage.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
                previewStatus.textContent = "Move mouse over product";
            });

            // ==========================================
            // 6. DRAG AND DROP  (dragstart, dragover, dragleave, drop, dragend)
            // ==========================================
            preview.addEventListener("dragstart", function (event) {
                preview.classList.add("dragging");
                event.dataTransfer.setData("text/plain", "Smart Watch");
                event.dataTransfer.effectAllowed = "copy";
            });

            cartArea.addEventListener("dragover", function (event) {
                event.preventDefault(); // required to allow dropping
                cartArea.classList.add("drag-over");
            });

            cartArea.addEventListener("dragleave", function () {
                cartArea.classList.remove("drag-over");
            });

            cartArea.addEventListener("drop", function (event) {
                event.preventDefault();
                cartArea.classList.remove("drag-over");
                preview.classList.remove("dragging");
                addToCart("drop");
            });

            preview.addEventListener("dragend", function () {
                preview.classList.remove("dragging");
                cartArea.classList.remove("drag-over");
            });

            // Touch / keyboard fallback
            addToCartBtn.addEventListener("click", function () {
                addToCart("button");
            });

            // ==========================================
            // 7. FORM SUBMISSION  (submit event)
            // ==========================================
            form.addEventListener("submit", function (event) {
                event.preventDefault(); // no page reload

                const engraving = engravingInput.value.trim();

                if (selectedColor === "") {
                    showResult("Please select a product color.", true);
                    return;
                }

                if (engraving === "") {
                    engravingInput.classList.add("invalid");
                    showResult("Please enter a product name or engraving.", true);
                    engravingInput.focus();
                    return;
                }

                engravingInput.classList.remove("invalid");

                // Build the result with textContent so user input is never run as HTML
                submissionResult.className = "";
                submissionResult.innerHTML = "";

                const heading = document.createElement("strong");
                heading.textContent = "Configuration Submitted Successfully!";
                submissionResult.appendChild(heading);

                const details = [
                    ["Product", "Smart Watch"],
                    ["Color", capitalize(selectedColor)],
                    ["Engraving", engraving],
                    ["Price", "Rs 2000"],
                    ["Cart items", String(cartCount)]
                ];

                details.forEach(function (item) {
                    submissionResult.appendChild(document.createElement("br"));
                    submissionResult.appendChild(
                        document.createTextNode(item[0] + ": " + item[1])
                    );
                });

                submissionResult.style.display = "block";
                submissionResult.scrollIntoView({ behavior: "smooth", block: "nearest" });
            });

            // ==========================================
            // 8. FORM RESET  (click event)
            // ==========================================
            resetBtn.addEventListener("click", function () {
                selectedColor = "";
                cartCount = 0;

                colorButtons.forEach(function (b) {
                    b.classList.remove("selected");
                    b.setAttribute("aria-pressed", "false");
                });
                colorLabel.textContent = "No color selected";

                productImage.src = DEFAULT_IMAGE;
                productImage.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";

                engravingInput.value = "";
                engravingInput.classList.remove("invalid", "focused");
                engravingPreview.textContent = "";
                charCount.textContent = "0";
                charCounter.classList.remove("warning", "limit");

                preview.classList.remove("active-preview", "dragging");
                previewStatus.textContent = "Move mouse over product";

                cartCountEl.textContent = "0";
                cartLast.textContent = "";
                cartArea.classList.remove("drag-over", "bump");

                submissionResult.style.display = "none";
                submissionResult.textContent = "";

                showMessage("Product configuration has been reset.", "info");
            });

            // ==========================================
            // 10. SCROLL FEEDBACK  (scroll event)
            // ==========================================
            window.addEventListener("scroll", function () {
                const scrollTop = window.scrollY;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

                scrollProgress.style.width = percent + "%";
                container.classList.toggle("scrolled", scrollTop > 20);
                backToTop.classList.toggle("visible", scrollTop > 200);
            });

            backToTop.addEventListener("click", function () {
                window.scrollTo({ top: 0, behavior: "smooth" });
            });

        });
    </script>

</body>

</html>