const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/post");

//Importation des middleware d'authentification et de gestion des fichiers entrants
const auth = require("../middleware/auth");

//Application des fonctions et authentification pour chaque route
router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, postCtrl.createPost); 
router.delete("/:id", auth, postCtrl.deletePost);
router.put("/:id", auth, postCtrl.clapPost);

module.exports = router;