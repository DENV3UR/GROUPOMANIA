const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require('path');
const authRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comm.routes');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/auth', authRoutes);

app.use('/post', postRoutes);

app.use('/comm', commentRoutes);

module.exports = app;