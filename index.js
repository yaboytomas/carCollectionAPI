const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const connectDB = require('./utils/db');
const CarRoutes = require('./routes/CarRoutes');

async function startServer(){
    
    // Connect to the database
    await connectDB();

    // Middleware
    app.use(express.json());
    app.use('/api', CarRoutes);


    // Start the server
    app.listen(PORT, () => {
    console.log(`\nServer is running on http://localhost:${PORT}`);
    });

    // Home route
    app.get("/", (req, res) => {
    res.send("Hello World!");
    });
}

startServer();
