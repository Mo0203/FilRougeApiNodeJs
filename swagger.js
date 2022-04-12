const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger.json';
const endpointsFiles = ['./routes/audienceRoutes.js', './routes/insertionRoutes.js', './routes/logRoutes.js', './routes/organisationRoutes.js',]

swaggerAutogen(outputFile, endpointsFiles).then(() => {
    require('./index.js');
});