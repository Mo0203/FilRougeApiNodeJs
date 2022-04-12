const express = require('express');
const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');
const mongoose = require('mongoose');
const cors = require('cors');
const xss = require('xss-clean');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json');

const userRoutes = require('./routes/userRoutes');
const orgRoutes = require('./routes/organisationRoutes');
const insertRoutes = require('./routes/insertionRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
const logRoutes = require('./routes/logRoutes');


app.use(cors());
app.use(helmet());
app.use(xssClean());
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(cors());
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/', userRoutes);
app.use('/', orgRoutes);
app.use('/', insertRoutes);
app.use('/', audienceRoutes);
app.use('/', logRoutes);


mongoose.connect(process.env.MONGO_URL)
    .then((result) => {
        app.listen(3500);
        console.log('Server is now listening on port 3500');
    })
    .catch((err) => console.error(err));