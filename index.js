require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const connectDB = require('./utils/db');
const CarRoutes = require('./routes/CarRoutes');
const UserRoutes = require('./routes/UserRoutes');

async function startServer(){
    
    // Connect to the database
    await connectDB();

    // Middleware
    app.use(express.json());
    app.use('/api', CarRoutes);
    app.use('/api', UserRoutes);

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
