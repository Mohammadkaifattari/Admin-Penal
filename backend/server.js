const express = require('express');
const cors = require('cors');


const app = express();
const PORT = 5000;



app.use(cors());
app.use(express.json());

// Helper function to read data from JSON file
const readData = () => {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
};

// Helper function to write data to JSON file
const writeData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Check if JSON file exists, if not create empty array
if (!fs.existsSync(DATA_FILE)) {
    writeData([]);
}

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

