//Importation du package de gestion des token
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();


//Fonction d'authentification des requêtes
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; //Récupération du token dans le header authorization (suppression du mot clé bearer)
        const decodedToken = jwt.verify(token, process.env.TOKEN); //Décodage du token en objet JS
        const userID = decodedToken.userID; //Extraction du userId depuis le token décodé
        //Si l'userId contenu par le token ne correspond pas au userId de la requête, renvoie d'une erreur, sinon next passe l'exécution au middleware suivant 
        if (req.params["id"] && req.params["id"] != userID) {
            throw "Invalid user ID";
        } else if (req.params["id"] && req.params["id"] == userID) {
            next();
        } else {
            res.locals.userID = decodedToken.userID; //Ajour du userID dans les variables de la requêtes
            next();
        }
    } catch (error) {
        res.status(403).json({ error })
    }
};