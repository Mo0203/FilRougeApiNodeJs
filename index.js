const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/', userRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then((result) => {
        app.listen(3500);
        console.log('Server is now listening on port 3500')
    })
    .catch((err) => console.error(err));