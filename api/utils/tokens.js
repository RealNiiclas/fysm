const jwt = require("jsonwebtoken");

function sendAccessToken(res, user) {
  const act = jwt.sign({ ic: user.id, vc: user.version }, "aQ1mOiFKp0n2dDeTX3t", { algorithm: "HS256", expiresIn: "1m", noTimestamp: true });
  res.cookie("act", act, { httpOnly: true, path: "/", sameSite: "strict", maxAge: 60 * 1000 });
}

function sendRefreshToken(res, user) {
  const rft = jwt.sign({ ic: user.id, vc: user.version }, "aQ1mOiFKp0n2dDeTX3t", { algorithm: "HS256", expiresIn: "2d", noTimestamp: true });
  res.cookie("rft", rft, { httpOnly: true, path: "/refresh", sameSite: "strict", maxAge: 2 * 24 * 60 * 60 * 1000 });
}

function verifyToken(token) {
  try { return jwt.verify(token, "aQ1mOiFKp0n2dDeTX3t", { algorithms: ["HS256"] }); }
  catch (err) { return null; }
}

module.exports = {
  sendAccessToken,
  sendRefreshToken,
  verifyToken
}
