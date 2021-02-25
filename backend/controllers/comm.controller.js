const Comment = require("../models/comm.model.js");
const jwt = require('jsonwebtoken');

// Create and Save a new Post
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    // Create a User
    const comment = new Comment({
    text: req.body.text,
    userId: req.body.userId,
    postId: req.body.postId,
    });
    // Save User in the database
    Comment.create(comment, (err, data) => {
    if (err)
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the Post."
        });
    else {
        res.status(200).json('Le commentaire a été créé!!');
        //res.send(data);
    }
    });
  };


exports.getall = (req,res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  Comment.getAll(req.params.postid, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving posts."
      });
    else res.send(data);
  });

};

exports.deleteOne = (req,res) => {
  // Validate request
  Comment.getOne(req.params.id, (err, comment) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while getting comments"
      });
    else {
      console.log('userid ==> ', comment );
      if(req.isadmin || comment[0].userid == req.userId){
        Comment.delete(req.params.id, (err, data) => {
          console.log('req ==> ' , req);
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while deleting comments"
            });
          else res.status(200).json('Le commentaire a été effacé!!');
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