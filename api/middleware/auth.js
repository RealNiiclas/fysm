const { getUserById } = require("../utils/database");
const { verifyToken } = require("../utils/tokens");

function checkToken(type) {
  return async (req, res, next) => {
    const token = req.cookies[type];
    if (!token) return res.sendStatus(403);
    
    const tokenPayload = verifyToken(token);
    if (!tokenPayload) return res.sendStatus(403);
    
    const foundUser = await getUserById(tokenPayload.ic);
    if (!foundUser) return res.sendStatus(403);
    
    const isVersionCorrect = foundUser.version === tokenPayload.vc;
    if (!isVersionCorrect) return res.sendStatus(403); 

    res.locals.user = foundUser;
    next();
  };
}

module.exports = {
  checkToken
};
