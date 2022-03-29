const mongoose = require('mongoose');
const express = require('express')
const app = express();
const userRoutes = require('./routes/userRoutes');


require('dotenv').config();

const cors = require('cors');




app.use(cors());//j'appelle cors
app.use(express.json());//j'appelle express
app.use('/', userRoutes)// le slash correspond à l'initial de l'adresse



mongoose.connect(process.env.MONGO_URL)
    .then((result) => {
        app.listen(3500);
        console.log("Serveur is now listening on port 3500");//je vérifie grace à l'affichage que le lien est effectif
    })
    .catch((err) => console.log(err))

