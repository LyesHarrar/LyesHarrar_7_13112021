const db = require('../dbConnect');

//Obtenir la liste et la date de toutes les publications
exports.getAllPosts = (req, res, next) => {
    let sqlGetPosts = "SELECT postID, dateSend FROM Post";
    db.query(sqlGetPosts, function(error, result) {
        if (error) {
            return res.status(404).json({
                message: "Soyez le premier à publier !"
            });
        }
        if (result) {
            console.log(result);
            return res.status(200).json(result);
        }
    })
};

//Renvoie les données d'une publication
exports.getOnePost = (req, res, next) => {
    let postID = req.params["id"];
    let sqlGetPost = "SELECT * FROM Post WHERE postID = ?";
    db.query(sqlGetPost, [postID], function(error, result) {
        if (error) {
            return res.status(404).json({
                message: "Cette publication a été supprimée"
            });
        }
        if (result) {
            return res.status(200).json(result);
        }
    })
};

//Créer une publication
exports.createPost = (req, res, next) => {
    //Création d'un objet avec les valeurs envoyées par le front
    let newPost = {
        gifUrl: req.body.gifUrl,
        title: req.body.title,
        text: req.body.text
    };
    //Récupération du userID (variable de la requête ajoutée lors de l'authentification)
    let userID = res.locals.userID;
    //Ajout d'une ligne dans la BDD avec les données récupérées
    let sqlNewPost = "INSERT INTO Post (userID, gifUrl, postTitle, postText, dateSend) VALUES (?, ?, ?, ?, NOW())";
    db.query(sqlNewPost, [userID, newPost.gifUrl, newPost.title, newPost.text], function(error) {
        if (error) {
            return res.status(501).json({
                message: "Votre message n'a pas été publié. Veuillez réessayer dans quelques instants."
            });
        } else {
            return res.status(201).json({
                message: "Votre publication est maintenant visible par vos collègues."
            });
        }
    })
};

//Supprimer une publication 
exports.deletePost = (req, res, next) => {
    let postID = req.params["id"];
    let sqlDelete = "DELETE FROM Post WHERE postID=?";
    db.query(sqlDelete, [postID], function(error) {
        if (error) {
            return res.status(500).json(error);
        } else {
            return res.status(200).json({
                message: "Publication supprimée"
            });
        }
    })
};

//Incrémenter le nombre d'applaudissements
exports.clapPost = (req, res, next) => {
    let postID = req.params["id"];
    //Augmentation de 1 du nombre d'applaudissements (0 par défaut à la publication)
    let sqlClap = "UPDATE Post SET claps = claps + 1 WHERE postID=?";
    db.query(sqlClap, [postID], function(error, result) {
        if (error) {
            return res.status(501).json(error)
        }
        if (result) {
            return res.status(200).json(result)
        }
    })
};