const express = require('express');
const router = express.Router();


const {//je crée les fonctions et les importe du controller
    getUser,
    createUser,
    // updateUser,
    // deleteUser,
} = require('../controllers/userController.js');

router.post('/login', getUser);// je crée les routes d'utilisation en definissant le type de requete, elles sont en POST afin de cacher l'url 
router.post('/register', createUser);//route=router.fct=post.url='/register'.fct trouvée à cette URL=createUser
// router.post('/updateUser', updateUser);
// router.post('/deleteUser', deleteUser);



module.exports = router;// j'exporte le routeur
