const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/audienceRoutes.js', './routes/insertionRoutes.js', './routes/organisationRoutes.js', './routes/userRoutes.js'];

const doc = {
    info: {
        version: "1.0.0",
        title: "Documentation de l'API APIINSERTION",
        description: "Une API conçue pour centraliser et faciliter les recherches de dispositif d'insertion ou de formation en France"
    },
    host: "localhost:3500",
    basePath: "/",
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
        jwt: {
            type: "apiKey",
            name: "Authorization",
            in: "header"
        },
    },
    definitions: {
        User: {
            login: "Jean Guerin",
            email: "Jean-Guerin@gmail.com",
            password: "*********",
            organisation: "Service Militaire Volontaire",
            date: "date de création du profil"
        },
        insertion: {
            title: "Le titre du dispositif",
            min_age: "l'age minimum requis pour le dispositif",
            max_age: "l'age maximum requis pour le dispositif",
            income: "revenus alloués au bénéficiaire du dispositif",
            creation_date: "date de création dans la base de données du dispositif",
            url: "lien vers la page du dispositif",
            audience: "public ciblé par le dispositif",
            duration: "durée du dispositif",
            founding: "financement du dispositif",
            organisation: "organisme prestatatire du dispositif",
            goal: "Objectif du dispositif",
            info: "informations supplémenatires",
        },
        organisation: {
            name: "Nom de l'Organisme",
            date: "date de création dans la base de données"
        },
        audience: {
            target: "public ciblé"
        },
        userResponse: {
            User: {
                login: "Jean Guerin",
                email: "Jean-Guerin@gmail.com",
                password: "*********",
                organisation: "Service Militaire Volontaire",
                date: "date de création du profil"
            },
            token: "jeton d'autorisation"
        }
    }
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js');
});