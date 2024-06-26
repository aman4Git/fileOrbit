require("dotenv").config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectDB = require('./config/database');
const path = require('path');
const cors = require('cors');

//Set default middlewares
app.use(express.static('public'));
app.use(express.json());

//Database configuration
connectDB();

//CORS middleware configuration
const corsOptions = {
    origin: process.env.ALLOWED_CLIENTS.slice(',')
}
app.use(cors(corsOptions));

//Set Template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//Route configuration
app.use('/api/files', require('./routes/files'));
app.use('/files', require('./routes/show'));
app.use('/files/download', require('./routes/download'));

//Start the server
app.listen(PORT, () => {
    console.log(`Server listening on localhost:${PORT}`);
});