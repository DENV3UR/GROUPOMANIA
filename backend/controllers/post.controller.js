const Post = require("../models/post.model.js");
const Comment = require("../models/comm.model");
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
    const post = new Post({
    url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    description: req.body.description,
    userId: req.body.userId,
    date : new Date(),
    });
    // Save User in the database
    Post.create(post, (err, data) => {
    if (err)
        res.status(500).send({
        message:
            err.message || "Some error occurred while creating the Post."
        });
    else {
        res.status(200).json('Le post a été créé!!');
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

  Post.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving posts."
      });
    else {
      for (let i = 0; i < data.length; i++) {
        console.log('userid : ' + data[i].userid);
        if(data[i].text !== null) data[i].text = [[data[i].text,data[i].userid,data[i].comid]];
        else data[i].text = [];
        if(i+1 < data.length){
        while(data[i].id == data[i+1].id){
          data[i].text.push([data[i+1].text,data[i+1].userid,data[i+1].comid]);
          data.splice(i+1, 1);
        }}
      }
      
      console.log(data);
      res.send(data);
    }
  });

};

exports.deleteOne = (req,res) => {

  Post.getOne(req.params.id,(err, post) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving posts."
      });
    else {
      if(req.isadmin || post[0].userid == req.userId){
      Post.delete(req.params.id,(err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while deleting posts."
          });
        else {
          res.status(200).json('Le post a été supprimé!!');
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
