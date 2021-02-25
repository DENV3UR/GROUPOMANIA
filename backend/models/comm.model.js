const sql = require("./db.js");

// constructor
const Comment = function(comment) {
  this.text = comment.text;
  this.userid = comment.userId;
  this.postid = comment.postId;
};

Comment.create = (newComment, result) => {
  sql.query("INSERT INTO comments SET ?", newComment, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, { id: res.id, ...newComment });
  });
};

Comment.getAll = (postid, result) => {
  sql.query("SELECT * FROM comments where postid=" + postid, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};


Comment.getOne = (id, result) => {
  sql.query("SELECT * FROM comments where id=" + id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

Comment.delete = (id, result) => {
  sql.query("DELETE FROM comments where id=" + id, (err, res) => {
    if (err) {
      result(null, err);
      return;
    }
    result(null, res);
  });
};

module.exports = Comment;