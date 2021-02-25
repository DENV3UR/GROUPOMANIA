const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    const isadmin = decodedToken.isadmin;
    console.log('auth');
    if (req.body.userId && parseInt(req.body.userId, 10) !== parseInt(userId, 10)) {
      throw 'Invalid user ID';
    } else {
      console.log('valid');
      req.userId = userId;
      req.isadmin = parseInt(isadmin, 10);
      next();
    }
  } catch(error) {
    console.log(error);
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};