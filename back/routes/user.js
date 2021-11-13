const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");

//Importation des middleware d'authentification et de gestion des fichiers entrants
const authId = require("../middleware/auth-id");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

//Application des fonctions et authentification pour chaque route
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/:id", auth, userCtrl.profile);
router.put("/:id", authId, userCtrl.modify);
router.post("/:id", authId, multer, userCtrl.avatar)
router.delete("/:id", authId, userCtrl.delete);

module.exports = router;