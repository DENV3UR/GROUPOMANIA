const express = require('express');
const router = express.Router();
const userCtrl = require("../controllers/user.controller.js");
const emailVerify = require('../middleware/email-verify');
const auth = require('../middleware/auth');

// Create a new user
router.post("/signup", emailVerify, userCtrl.create);
 
// check user credentials
router.post("/login", userCtrl.findOne);

// Retrieve a single user with userId
router.get("/:id", userCtrl.getOne);

// Update a user with userId
router.put("/user/:id", auth, userCtrl.update);

// Delete a user with userId
router.delete("/user/:id",auth, userCtrl.deleteOne);

module.exports = router;

