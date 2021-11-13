const mysql = require('mysql');
require('dotenv').config();

//Connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'groupomania',
});

db.connect((error) => {
    if (error) {
        throw error;
    } else {
        console.log("Connecté à MySQL");
    }
});

module.exports = db;