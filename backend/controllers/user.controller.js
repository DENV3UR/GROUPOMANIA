const User = require("../models/users.model.js");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// Create and Save a new User
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
    // Create a User
    const user = new User({
      email: req.body.email,
      password: hash
    });
    // Save User in the database
    User.create(user, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      else {
        res.status(200).json({
          userId: data.id,
          isadmin: 0,
          token: jwt.sign(
              { userId: data.id , isadmin: 0},
              'RANDOM_TOKEN_SECRET',
              { expiresIn: '24h' }
            )
        });
        //res.send(data);
      }
    });
  })
  .catch(error => res.status(500).json({ error }));
};

// Find a single User with a UserId
exports.findOne = (req, res) => {

  const user = new User({
    email: req.body.email,
    password: req.body.password
  });

    User.checkOne(user,  (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
          } else {
            res.status(500).send({
              message: "Error retrieving Customer with email " + req.body.email
            });
          }
        } else {

          bcrypt.compare(req.body.password, data.password)
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            console.log(data.id);
            res.status(200).json({
              userId: data.id,
              isadmin: data.isadmin,
              token: jwt.sign(
                  { userId: data.id ,isadmin: data.isadmin},
                  'RANDOM_TOKEN_SECRET',
                  { expiresIn: '24h' }
                )
            });
          })
          .catch(error => res.status(500).json({ error }));
        }
      });
};

// Find a single User with a UserId
exports.getOne = (req, res) => {

    User.getOne(req.params.id,  (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
          } else {
            res.status(500).send({
              message: "Error retrieving Customer with id " + req.params.id
            });
          }
        } else {
          res.send(data);
        }
      });
};

// Update a User identified by the UserId in the request
exports.update = (req, res) => {
  User.updateById(req.params.id,req.body.surname,req.body.name,req.body.role,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving posts."
      });
    else {
      res.status(200).json('Le user a été modifié!!');
    }
  });
};

// Delete a User with the specified UserId in the request
exports.deleteOne = (req,res) => {

  User.getOne(req.params.id,(err, usr) => {
    if (err){
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving posts."
      });
    }
    else {
      if(req.isadmin || usr.id == req.userId){
      User.remove(req.params.id,(err, data) => {
        if (err){
          res.status(500).send({
            message:
              err.message || "Some error occurred while retrieving posts."
          });
        }
        else {
          res.status(200).json('Le user a été supprimé!!');
        }
      });
    }
    else{
      res.status(401).send({
        message: "Unauthorized!"
      });
    }
  }
  });

};
