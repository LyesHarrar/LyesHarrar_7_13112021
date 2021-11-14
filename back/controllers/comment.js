const db = require('../dbConnect');

//Créer un commentaire
exports.createComment = (req, res, next) => {
    //Contenu du commentaire dans l'objet envoyé par le front
    let commentText = req.body.commentText;
    //PostID dans l'URL de la requête
    let postID = req.params["id"];
    //UserID est une variable de la requête (ajouté lors de l'authentification de celle-ci)
    let userID = res.locals.userID;
    //Création de la ligne dans la BDD
    let sqlNewComment =
        "INSERT INTO Comment (userID, postID, commentText, dateSend) VALUES (?, ?, ?, NOW())";
    db.query(sqlNewComment, [userID, postID, commentText], function(error, result) {
        if (error) {
            return res.status(501).json(error);
        }
        if (result) {
            return res.status(201).json(result);
        }
    })
};

//Renvoi d'une liste des commentaires pour un post
exports.getAllComments = (req, res, next) => {
    let postID = req.params["id"];
    let sqlGetComments =
        "SELECT postID, commentID FROM Comment WHERE postID = ?";
    db.query(sqlGetComments, [postID], function(error, result) {
        if (error) {
            return res.status(404).json(error);
        }
        if (result) {
            return res.status(200).json(result);
        }
    })
};

//Renvoi des données d'un commentaire
exports.getOneComment = (req, res, next) => {
    let postID = req.params["id"];
    let commentID = req.params["ref"];
    let sqlGetComment = "SELECT * FROM Comment WHERE postID = ? && commentID = ?";
    db.query(sqlGetComment, [postID, commentID], function(error, result) {
        if (error) {
            return res.status(404).json(error);
        }
        if (result) {
            return res.status(200).json(result);
        }
    })
};

//Supprimer un commentaire 
exports.deleteComment = (req, res, next) => {
    let postID = req.params["id"];
    let commentID = req.params["ref"];
    let sqlDeleteCom = "DELETE FROM Comment WHERE postID = ? && commentID = ?";
    db.query(sqlDeleteCom, [postID, commentID], function(error, result) {
        if (error) {
            return res.status(500).json(error);
        }
        if (result) {
            return res.status(200).json(result);
        }
    })
};