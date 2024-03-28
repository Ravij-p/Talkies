const jwt = require("jsonwebtoken");
const Users = require("../models/userSchema");
const authenticate = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    if (!authorization) {
      return res.status(401).send("Invalid Token");
    }
    const [bearer, token] = authorization.split(" ");
    if (!bearer || !token) {
      return res.status(401).send("Invalid Token");
    }
    const verifyToken = jwt.verify(token, "THIS_IS_THE_SECRET_KEY_OF_JWT");
    const user = await Users.findOne({ _id: verifyToken.id });
    if (!user) {
      return res.status(401).send("User not Found");
    }
    req.user = user;
    console.log("success in authentication");
    next();
  } catch (error) {
    console.log("Authentication Error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = authenticate;
