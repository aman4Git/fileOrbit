require("dotenv").config();
const mongoose = require('mongoose');

function connectDB(){

    // get database connection string from .env file
    const url = process.env.DATABASE_CONNECTION_STRING;

    // connect to database
    mongoose.connect(url, {
        useNewUrlParser   : true,
        useUnifiedTopology: true,
        dbName            : process.env.DATABASE_NAME,
    });

    // check if connection is successful
    const connection = mongoose.connection;

    // log error if connection is not successful
    connection.on('error', (err) => {
        console.error('Database connection error:', err);
    });

    // log success if connection is successful
    connection.once('open', () => {
        console.log("Database connection established successfully");
    })
}

module.exports = connectDB;