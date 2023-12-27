const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");

require("dotenv").config();

mongoose
  .connect(process.env.URL, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

async function createAdmin(userName, email, password) {
  try {
    const admin = new User({
      userName,
      email,
      password: bcrypt.hashSync(password, 8),
      role: 'admin'
    });
    console.log(await admin.save());
    process.exit();
  } catch (e) {
    console.log(e);
    process.exit();
  }
}

function getInput() {
  if (process.argv.length === 5) {
    const userName = process.argv[2];
    const email = process.argv[3];
    const password = process.argv[4];
    createAdmin(userName, email, password);
  }
}

getInput();