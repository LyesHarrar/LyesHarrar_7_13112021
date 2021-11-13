//Importation du framework et packages nécessaires
const express = require("express");
const path = require("path");
const helmet = require("helmet");
const sanitize = require('express-sanitizer');
const morgan = require("morgan");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

//Lancement de l'application express
const app = express();

//Helmet middleware pour sécuriser les headers
app.use(helmet());

//Configuration des headers pour autoriser les requêtes depuis un autre serveur (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
//helmet js
app.use(helmet());

// ajout de morgan pour le log des requetes HTTP
app.use(morgan('tiny'));

//Transformation des requêtes en objets JavaScript utilisables
app.use(express.json());

//Protège contre les failles XSS
app.use(sanitize());

//Dossier images statique (avec un path dynamique)
app.use("/images", express.static(path.join(__dirname, "images")));

//Enregistrement des routes associées aux endpoints attendus
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);

module.exports = app;