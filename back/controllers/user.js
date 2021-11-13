const db = require('../dbConnect'); //Connexion à la bd
require("dotenv").config();
const bcrypt = require('bcrypt'); //Pour crypter le mot de passe
const jwt = require('jsonwebtoken'); //Génère un token sécurisé
const fs = require('fs'); //Permet de gérer les fichiers stockés
const passwordValidator = require("password-validator");
const emailValidator = require("email-validator");

//Création du schéma de mot de passe
const passwordSchema = new passwordValidator();
passwordSchema
    .is().min(5) //5 caractères min
    .is().max(20) //12 caractères max
    .has().not().spaces() //Pas d'espace

//Création de l'utilisateur et hashage du mot de passe
exports.signup = (req, res, next) => {
    //Validation des inputs
    if (!emailValidator.validate((req.body.email))) {
        return res.status(400).json({
            message: "Assurez-vous d'avoir entré une adresse email valide"
        })
    } else if (!passwordSchema.validate((req.body.password))) {
        return res.status(400).json({
            message: "Votre mot de passe doit contenir au moins 5 caractères"
        })
    } else {
        //Hashage x10 du mdp + salage
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                let userProfile = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: hash
                };
                //Vérification de l'absence de ligne avec le même email dans la BDD
                let sqlCheck = "SELECT * FROM User WHERE email = ?";
                db.query(sqlCheck, [userProfile.email], function(error, result) {
                    if (error) {
                        return res.status(501).json({
                            message: "Erreur du serveur. Veuillez réésayer plus tard."
                        })
                    }
                    if (result[0]) {
                        return res.status(401).json({
                            message: "Un compte a déjà été créé avec cet email !"
                        })
                    } else {
                        //Création de la nouvelle ligne utilisateur avec l'objet userProfile
                        let sqlCreateUser = "INSERT INTO User (firstName, lastName, email, password, dateCreation) VALUES (?, ?, ?, ?, NOW())";
                        db.query(sqlCreateUser, [userProfile.firstName, userProfile.lastName, userProfile.email, userProfile.password], function(error, result) {
                            if (error) {
                                return res.status(501).json({
                                    message: 'Erreur de notre serveur. Veuillez réessayer dans quelques instants.'
                                })
                            }
                            if (result) {
                                //Renvoi d'un objet contenant le userID et le token sécurisé
                                res.status(201).json({
                                    userID: result.insertId,
                                    token: jwt.sign({
                                            userID: result.insertId
                                        },
                                        process.env.TOKEN, {
                                            expiresIn: "24h"
                                        }
                                    )
                                })
                            }
                        })
                    }
                })
            })
            .catch(error => {
                return res.status(501).json({
                    message: 'Erreur de notre serveur. Veuillez réésayer plus tard.'
                })
            })
    }
};

//Login de l'utilisateur
exports.login = (req, res, next) => {
    //Récupération des identifiants transmis par le front
    const emailLogin = req.body.email;
    const passwordLogin = req.body.password;
    //Recherche de la ligne correspondante dans la BDD
    let sqlLogin = "SELECT * FROM User WHERE email=?";
    db.query(sqlLogin, [emailLogin], function(error, result) {
        if (error) {
            return res.status(500).json({
                message: "Erreur sur notre serveur. Veuillez réessayer plus tard."
            });
        } else if (result.length == 0) {
            //Si la ligne n'existe pas encore, informer le visiteur
            return res.status(404).json({
                message: "Vous n'êtes pas encore inscrit"
            })
        } else {
            //Si la ligne existe, vérification du mot de passe
            bcrypt.compare(passwordLogin, result[0].password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            message: "Votre mot de passe est incorrect."
                        })
                    }
                    //Si le mdp a bien la même origine, renvoi d'un objet contenant userID, token et l'absence d'adminRights
                    return res.status(200).json({
                        userID: result[0].userID,
                        adminRights: result[0].adminRights,
                        token: jwt.sign({
                                userID: result[0].userID
                            },
                            process.env.TOKEN, {
                                expiresIn: "24h"
                            }
                        )
                    })
                })
                .catch(error => res.status(500).json(error))
        }
    })
};

//Récupérer le profil d'un utilisateur
exports.profile = (req, res, next) => {
    let userID = req.params["id"];
    let sqlGet = "SELECT * FROM User WHERE userID = ?";
    db.query(sqlGet, [userID], function(error, result) {
        if (error) {
            return res.status(500).json(error.message);
        }
        if (result) {
            return res.status(200).json(result);
        }
    })
};

//Modifier un profil
exports.modify = (req, res, next) => {
    //Récupération du userID (search params) et des info à modifier (objet transmis)
    let userID = req.params["id"]
    let updatedProfile = {
        firstName: req.body.firstName,
        lastName: req.body.lastName
    };
    console.log(updatedProfile);
    //Modifier la ligne user avec les infos transmises (sinon garder la valeur inchangée)
    let sqlModify =
        "UPDATE User SET firstName = IFNULL(?, firstName), lastName = IFNULL (?, lastName) WHERE userID = ?";
    let values = [updatedProfile.firstName, updatedProfile.lastName, userID];
    db.query(sqlModify, values, function(error, result) {
        if (error) {
            res.status(500).json(error.message);
        }
        if (result.affectedRows == 0) {
            res.status(400).json({
                message: "La modification n'a pas pu aboutir"
            });
        } else {
            //si la MaJ a été effectuée, renvoyer toutes les données user
            let sqlGet = "SELECT * FROM User WHERE userID = ?";
            db.query(sqlGet, [userID], function(error, result) {
                if (error) {
                    res.status(500).json(error.message);
                }
                if (result) {
                    res.status(200).json(result);
                }
            })
        }
    })
};

//Met à jour l'avatar depuis la page profil
exports.avatar = (req, res, next) => {
    //Reconstruction de l'URL de l'image à partir de son nom de fichier
    const newAvartarUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
    const userID = req.params["id"];
    //Recherche de l'avatar actuel pour pouvoir le supprimer
    let sqlExUrl = "SELECT avatarUrl FROM User WHERE userID = ?";
    db.query(sqlExUrl, [userID], function(error, result) {
        if (error) {
            return res.status(500).json(error)
        }
        if (result) {
            //Extraction du nom du fichier depuis l'URL stockée dans la BDD
            let exAvatarName = result[0].avatarUrl.split("/images/")[1];
            //S'il ne s'agit pas de l'image par défaut (à conserver), supprimer l'ancienne image
            if (exAvatarName != "avatar.png") {
                fs.unlink(`images/${exAvatarName}`, (error) => {
                    if (error) throw error;
                })
            }
            //Mettre à jour avec la nouvelle URL
            let sqlChangeAvatar = "UPDATE User SET avatarUrl = ? WHERE userID = ?";
            db.query(sqlChangeAvatar, [newAvartarUrl, userID], function(error) {
                if (error) {
                    return res.status(501).json({
                        message: "La modification n'a pas pu aboutir"
                    })
                } else {
                    return res.status(201).json(newAvartarUrl)
                }
            })
        }
    })
};

//Suppresion d'un utilisateur
exports.delete = (req, res, next) => {
    let userID = req.params["id"];
    //Recherche de la ligne de l'utilisateur concerné
    let sqlFindAvatar = "SELECT avatarUrl FROM User WHERE userID = ?";
    db.query(sqlFindAvatar, [userID], function(error, result) {
        if (error) {
            return res.status(500).json(error)
        }
        if (result) {
            //Supprimer son image de profil (s'il ne s'agit pas de l'image par défaut, à conserver)
            let avatarName = result[0].avatarUrl.split("/images/")[1];
            if (avatarName != "avatar.png") {
                fs.unlink(`images/${avatarName}`, (error) => {
                    if (error) throw error;
                })
            }
        }
    });
    //Supprimer toute la ligne de la BDD
    let sqlDelete = "DELETE FROM User WHERE userID = ?";
    db.query(sqlDelete, [userID], function(error) {
        if (error) {
            return res.status(500).json(error.message);
        } else {
            return res.status(200).json();
        }
    })
};