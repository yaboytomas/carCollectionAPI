const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const connectDB = require('./utils/db');

connectDB();

app.listen(PORT, () => {
  console.log(`\nServer is running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});
