function checkAuth(authRequired = true) {
  return (req, res, next) => {
    if (authRequired !== !!req.session.name)
      return res.sendStatus(403);
    next();
  }
}

module.exports = {
  checkAuth
};
