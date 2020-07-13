const jwt = require(`jsonwebtoken`);

// definnig the token verification
const auth = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token)
      return res
        .status(401)
        .json({ msg: "You Are Not Authenticated", errMsg: true });

    const verify = jwt.verify(token, process.env.JWT_KEY);

    if (!verify)
      return res
        .status(401)
        .json({ msg: "Token Verification Failed", errMsg: true });

    req.user = verify.id;
    next();
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = auth;
