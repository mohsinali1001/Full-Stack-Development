const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 5000;

// ================================
// Middleware
// ================================

// Allow frontend to communicate with backend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Custom middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// ================================
// Read Products JSON
// ================================

const productsPath = path.join(__dirname, "data", "products.json");

const productsData = fs.readFileSync(productsPath, "utf-8");

const products = JSON.parse(productsData);

// ================================
// Routes
// ================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Product Configurator Backend is running"
    });
});

// Get all products
app.get("/api/products", (req, res) => {
    res.json({
        success: true,
        products: products.products
    });
});

// Get single product
app.get("/api/products/:id", (req, res) => {
    const productId = Number(req.params.id);

    const product = products.products.find(
        (item) => item.id === productId
    );

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    res.json({
        success: true,
        product: product
    });
});

// Add new product (demonstration endpoint - in-memory / console display, no database)
app.post("/api/products", (req, res) => {
    const product = req.body;

    if (!product || !product.name || !product.type || product.price === undefined || product.price === null || product.price === "") {
        return res.status(400).json({
            success: false,
            message: "Product name, type and price are required"
        });
    }

    const priceNum = Number(product.price);
    if (isNaN(priceNum) || priceNum <= 0) {
        return res.status(400).json({
            success: false,
            message: "Price must be a valid positive number"
        });
    }

    if (!product.description || String(product.description).trim() === "") {
        return res.status(400).json({
            success: false,
            message: "Product description is required"
        });
    }

    // Generate next product ID based on existing products in products.json
    const nextId = (products.products && products.products.length > 0)
        ? Math.max(...products.products.map((p) => p.id)) + 1
        : 1;

    const newProduct = {
        id: nextId,
        name: String(product.name).trim(),
        type: String(product.type).trim(),
        price: priceNum,
        currency: product.currency || "PKR",
        description: String(product.description).trim(),
        images: Array.isArray(product.images) && product.images.length > 0 ? product.images : ["images/default.jpg"],
        remoteImages: Array.isArray(product.remoteImages) && product.remoteImages.length > 0 ? product.remoteImages : (Array.isArray(product.images) ? product.images : []),
        video: product.video || `videos/${product.type}.mp4`,
        colors: Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : [
            { name: "Default", code: "#1e293b", premium: false }
        ],
        variants: Array.isArray(product.variants) && product.variants.length > 0 ? product.variants : [
            { name: "Standard", additionalPrice: 0 }
        ]
    };

    console.log("========================================");
    console.log("NEW PRODUCT RECEIVED");
    console.log("========================================");
    console.log("");
    console.dir(newProduct, { depth: null });
    console.log("");
    console.log("========================================");
    console.log("PRODUCT RECEIVED SUCCESSFULLY");
    console.log("========================================");

    res.status(201).json({
        success: true,
        message: "Product received successfully",
        product: newProduct
    });
});

// Receive a product configuration from the frontend (jQuery AJAX POST)
app.post("/api/configurations", (req, res) => {
    const configuration = req.body;

    if (!configuration || !configuration.productId) {
        return res.status(400).json({
            success: false,
            message: "Product configuration is required"
        });
    }

    console.log("Received configuration:");
    console.log(configuration);

    res.status(201).json({
        success: true,
        message: "Product configuration received successfully",
        configuration: configuration
    });
});

process.on("uncaughtException", (error) => {
    console.error("UNCAUGHT EXCEPTION:");
    console.error(error);
});

process.on("unhandledRejection", (error) => {
    console.error("UNHANDLED REJECTION:");
    console.error(error);
});

process.on("exit", (code) => {
    console.log("Node process is exiting. Code:", code);
});

// ================================
// Start Server
// ================================

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});