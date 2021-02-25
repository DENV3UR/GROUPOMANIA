const sql = require("./db.js");

// constructor
const Post = function(post) {
  this.imgurl = post.url;
  this.description = post.description;
  this.date = post.date;
  this.userid = post.userId;
};

Post.create = (newPost, result) => {
  sql.query("INSERT INTO posts SET ?", newPost, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.id, ...newPost });
  });
};

Post.getAll = result => {
  sql.query("SELECT posts.*, users.email, users.name, users.surname, users.id as mainuserid, comments.text, comments.userid, comments.id as comid FROM posts INNER JOIN users ON posts.userid = users.id LEFT JOIN comments ON posts.id = comments.postid", (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Post.getOne = (id,result) => {
  sql.query("SELECT * FROM posts where id=" + id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Post.delete = (id,result) => {
  sql.query("DELETE FROM posts WHERE id=" + id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = Post;