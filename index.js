const express = require('express');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const orgRoutes = require('./routes/organisationRoutes');
const insertRoutes = require('./routes/insertionRoutes');
const audienceRoutes = require('./routes/audienceRoutes');


require('dotenv').config();
const cors = require('cors');

app.use(cors());
app.use(helmet());
app.use(xssClean());
app.use(express.json());
app.use('/', userRoutes);
app.use('/', orgRoutes);
app.use('/', insertRoutes);
app.use('/', audienceRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then((result) => {
        app.listen(3500);
        console.log('Server is now listening on port 3500')
    })
    .catch((err) => console.error(err));