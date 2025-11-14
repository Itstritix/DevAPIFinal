const mongoose = require('mongoose')
require('dotenv').config('../.env');

const mongoUrl = process.env.MONGODB_URI;

const dbConnect = mongoose.connect(mongoUrl, {})
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1);
});

module.exports = dbConnect;