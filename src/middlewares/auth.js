function isAuthenticated(req, res, next) {
  if (req.session && req.session.passport && req.session.passport.user) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
}

  
  module.exports = {
    isAuthenticated
  }