const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

async function signUp(req, res) {
  const user = new User({
    userName: req.body.userName,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });
  try {
    const newUser = await user.save();
    res.status(200).send({ msg: "User created", newUser });
  } catch (err) {
    res.status(500).send({ err, msg: "Error occured" });
  }
}

async function signIn(req, res) {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(404).send({ msg: "User is not found" });
    }
    const passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    console.log(passwordIsValid, "++++++++++");
    if (!passwordIsValid) {
      return res.status(401).send({ msg: "Invalid password" });
    }
    const accessToken = jwt.sign({ id: user.id }, process.env.API_SECRET, {
      expiresIn: 86400,
    });
    res.status(200).send({
      msg: "Successfully signed in",
      user: {
        id: user.id,
        email: user.email,
        userName: user.userName,
      },
      accessToken,
    });
  } catch (err) {
    res.status(500).send({ err: err.message, msg: "Error occured" });
  }
}

module.exports = { signIn, signUp };
