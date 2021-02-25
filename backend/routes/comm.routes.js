const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comm.controller');
const auth = require('../middleware/auth');

router.post('/create', commentCtrl.create);


router.get('/getall/:postid', commentCtrl.getall);

router.delete('/:id', auth,commentCtrl.deleteOne);

module.exports = router;