const Sauces = require('../models/Sauces')
const fs = require('fs'); 

//Récuperation des sauces

exports.getAllSauces = (req, res, next) => {
    Sauces.find()
    .then((sauces) => { res.status(200).json(sauces)})
    .catch((error) => { res.status(404).json({ error: error});
    }
  );
};

//Récupération d'une sauce

exports.getOneSauce= (req, res, next) => {
  Sauces.findOne({ _id: req.params.id})
    .then((sauces) => { res.status(200).json(sauces)})
    .catch((error) => { res.status(404).json({ error: error});
    }
  );
};

//Création d'une sauce

exports.createSauce = (req, res, next) => {
  const saucesObject = JSON.parse(req.body.sauce);
  delete saucesObject._id;
  const sauces = new Sauces({
    ...saucesObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauces.save()
  .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
  .catch((error) => res.status(400).json({error: error}));
};

//Modification d'une sauce

exports.modifySauces = (req, res, next) => {
  const saucesObject = req.file ?
    { 
      ...JSON.parse(req.body.sauces),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauces.updateOne({_id: req.params.id}, {...saucesObject, _id: req.params.id})
  .then(() => res.status(201).json({message: 'Sauce mofifiée !'}))
  .catch((error) => res.status(400).json({error: error}));
};

//Suppression d'une sauce

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
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

//Noter une sauce

exports.rateSauces = (req, res, next) =>{
  if(req.body.like === 1){
    Sauces.updateOne({ _id:req.params.id}, {$inc: {likes: req.params.likes++}, $push: { userLiked: req.body.userId} })
      .then((sauces) => res.status(200).json({ message: 'Like ajouté' }))
      .catch(error => res.status(500).json({ error }))
  } else if (req.body.like === -1){
    Sauces.updateOne({ _id: req.params.id}, {$inc: {dislikes: req.params.dislikes++}, $push: {userLiked: req.body.userId}})
    .then((sauces) => res.status(200).json({ message: 'Dislike ajouté' }))
    .catch(error => res.status(500).json({ error }))
  } else {
    Sauces.findOne({ _id: req.params.id })
        .then(sauces => {
            if (sauce.usersLiked.includes(req.body.userId)) {
                Sauces.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                    .then((sauces) => { res.status(200).json({ message: 'Like supprimé' }) })
                    .catch(error => res.status(500).json({ error }))
            } else if (sauce.usersDisliked.includes(req.body.userId)) {
                Sauces.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                    .then((sauces) => { res.status(200).json({ message: 'Dislike supprimé' }) })
                    .catch(error => res.status(500).json({ error }))
            }
        })
        .catch(error => res.status(500).json({ error }))
  }
}