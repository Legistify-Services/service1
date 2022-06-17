const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];
    if (!token)
      return res
        .status(401)
        .send({ status: false, code: 401, msg: "TOKEN_NOT_FOUND" });
    try {
      const decodedTokenData = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
      req.user = decodedTokenData;
      next();
    } catch (exception) {
      res.status(401).send({ status: false, code: 401, msg: "INVALID_TOKEN" });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
    console.log(error);
  }
};
