const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const orgRoutes = require('./routes/organisationRoutes');


require('dotenv').config();
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());
app.use('/', userRoutes);
app.use('/', orgRoutes);
app.use('/', inserRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then((result) => {
        app.listen(3500);
        console.log('Server is now listening on port 3500')
    })
    .catch((err) => console.error(err));