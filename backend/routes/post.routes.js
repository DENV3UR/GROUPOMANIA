const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post.controller');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/create', auth, multer, postCtrl.create);


router.get('/getall', auth, postCtrl.getall);

router.delete('/:id', auth, postCtrl.deleteOne);

module.exports = router;