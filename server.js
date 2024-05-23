require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/database');

//Database configuration
connectDB();

//Route configuration
app.use('/api/files', require('./routes/files'));

//Start the server
app.listen(PORT, () => {
    console.log(`Server listening on localhost:${PORT}`);
});