const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'products.json');



app.use(cors());
app.use(express.json());

// Temporary in-memory storage for Vercel (since Vercel is read-only)
let products = [
    { id: "1", name: "Sample Product", price: "100", description: "This is a sample" }
];

// Helper functions (simplified for in-memory)
const readData = () => products;
const writeData = (data) => {
    products = data;
    console.log("Data updated in memory");
};

app.get('/', (req, res) => {
    res.send("E-commerce API is running with JSON storage!");
});

app.post('/products', (req, res) => {
    const products = readData();
    const newProduct = {
        id: Date.now().toString(), // Unique ID ke liye timestamp
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    };

    products.push(newProduct);
    writeData(products);
    res.status(201).json({ message: "Product created!", product: newProduct });
});
app.get('/products', (req, res) => {
    const products = readData();
    res.json(products);
});

app.put('/products/:id', (req, res) => {
    const products = readData();
    const index = products.findIndex(p => p.id === req.params.id);

    if (index !== -1) {
        products[index] = { id: req.params.id, ...req.body };
        writeData(products);
        res.json({ message: "Product updated!", product: products[index] });
    } else {
        res.status(404).json({ message: "Product not found" });
    }
});
app.delete('/products/:id', (req, res) => {
    const products = readData();
    const filteredProducts = products.filter(p => p.id !== req.params.id);
    
    writeData(filteredProducts);
    res.json({ message: "Product deleted successfully" });
});
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

module.exports = app;

