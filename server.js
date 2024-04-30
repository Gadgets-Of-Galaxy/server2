const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
app.use(express.json());
const dotenv = require("dotenv");

const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payment");

const router = require('./routes/routes');
const cors = require('cors');
const port = 3000;

const mongoURL = 'mongodb+srv://hemanth0921:mongodbpassword@nodetut.ej60wid.mongodb.net/GOG';

app.use("/api/admin/", adminRoutes);
app.use("/api/payment/", paymentRoutes);

app.use(session({
    secret: 'GOG_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    }
}));

app.use(cors());

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

app.use(router);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
