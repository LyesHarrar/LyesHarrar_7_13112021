const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/comment");

//Importation des middleware d'authentification et de gestion des fichiers entrants
const auth = require("../middleware/auth");

//Application des fonctions et authentification pour chaque route
router.post("/:id", auth, commentCtrl.createComment);
router.get("/:id", auth, commentCtrl.getAllComments);
router.get("/:id/:ref", auth, commentCtrl.getOneComment);
router.delete("/:id/:ref", auth, commentCtrl.deleteComment);

module.exports = router;