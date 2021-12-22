const Sauces = require('../models/Sauces')
const fs = require('fs');

//Récuperation des sauces
/**
 * @api {get} /sauces 
 * @param {Sauces} /Renvoie toutes les sauces de la base de données
 */
exports.getAllSauces = (req, res, next) => {
    Sauces.find()
      .then((Sauces) => { res.status(200).json(Sauces)})
      .catch((error) => { res.status(404).json({ error: error});
    }
  );
};

//Récupération d'une sauce
/**
 * @api {get} /sauce/:id
 * @param {findOne} /Recupére l'id de la sauce
 * @param {Sauces} /Renvoi une sauce
 */
exports.getOneSauce= (req, res, next) => {
  Sauces.findOne({ _id: req.params.id})
    .then((sauces) => { res.status(200).json(sauces)})
    .catch((error) => { res.status(404).json({ error: error});
    }
  );
};

//Création d'une sauce
/**
 * @api {get} /sauce
 * @param {saucesObject} /Recupére le corps de la requête
 * @param {sauces} /Prépare l'envoi du formulaire et de l'image
 * @param {save} /Sauvegarde les données dans la DB
 */

exports.createSauce = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  const sauces = new Sauces({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //Protocole image multer
  });
  sauces.save()
  .then(() => res.status(201).json({ message: 'Sauce enregistrée !',}))
  .catch((error) => res.status(400).json({error: error}));
};

//Modification d'une sauce
/**
 * @api {put} /sauce/:id
 * @param {findOne} /Recupére l'id de la sauce
 * @param {saucesObject} /Recupére le corps de la requête
 * @param {updateOne} /Sauvegarde les nouvelles données
 */

exports.modifySauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id})
    .then(userId => {
      if (userId === req.token.userId) {
        const saucesObject = req.file ?
        { 
          ...JSON.parse(req.body.sauces),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
        Sauces.updateOne({_id: req.params.id}, {...saucesObject, _id: req.params.id})
          .then(() => res.status(201).json({message: 'Sauce mofifiée !'}))
          .catch((error) => res.status(400).json({error: error}));
      } else{
        return res.status(403).json({ error: 'Vous n\'avez pas le droit de modifier cette sauce'});
      }
    })
    .catch((error) => res.status(500).json({ error: error}));
};

//Suppression d'une sauce
/**
 * @api {delete} /sauce/:id
 * @param {findOne} /Recupére l'id de la sauce, vérifie que l'utilisateur soit le propriétaire de la sauce
 * @param {filename} /Récupére l'url de l'image et la supprime
 * @param {deleteOne} /Supprime la sauce
 */

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id, userId: req.token.userId })
    .then(sauces => {
      const filename = sauces.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauces.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Notation d'une sauce
/**
 * @api {post} /sauce/:id/like
 * @param {findOne} /Recupére l'id de la sauce, vérifie que l'utilisateur soit le propriétaire de la sauce
 * @switch /Ajout un like, un dislike ou le supprime. Vérification du userId pour empecher plusieurs votes
 * @param {sauces.likes} /Affiche le nombre d'utilisateur ayant liké
 * @param {sauces.disLikes} /Affiche le nombre d'utilisateur ayant disliké
 * @param {udpateOne} /Met à jour la sauce
 */

exports.rateSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then(sauces => {
      switch (req.body.like) {
        case 1:
          if (!sauces.usersLiked.includes(req.body.userId)) sauces.usersLiked.push(req.body.userId);
          if (sauces.usersDisliked.includes(req.body.userId)) sauces.usersDisliked = sauces.usersDisliked.filter(value => value!=req.body.userId);
          break;

        case 0:
          if (sauces.usersLiked.includes(req.body.userId)) sauces.usersLiked = sauces.usersLiked.filter(value => value!=req.body.userId);
          if (sauces.usersDisliked.includes(req.body.userId)) sauces.usersDisliked = sauces.usersDisliked.filter(value => value!=req.body.userId);
          break;

        case -1:
          if (!sauces.usersDisliked.includes(req.body.userId)) sauces.usersDisliked.push(req.body.userId);
          if (sauces.usersLiked.includes(req.body.userId)) sauces.usersLiked = sauces.usersLiked.filter(value => value!=req.body.userId);
          break;
        default:
          res.status(403).json({ message : 'Bad request'});
    }
    sauces.likes = sauces.usersLiked.length;
    sauces.dislikes = sauces.usersDisliked.length;
    Sauces.updateOne({_id: req.params.id}, sauces)
      .then(() => res.status(201).json({message: 'Sauce notée !'}))
      .catch((error) => res.status(400).json({error: error}));
    })
    .catch(error => res.status(500).json({ error: error }));
};