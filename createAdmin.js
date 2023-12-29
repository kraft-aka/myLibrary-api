const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");

require("dotenv").config();

mongoose
  .connect(process.env.URL, {})
  .then(async () => {
    await main();
    console.log("MongoDB Connected");
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });

async function createAdmin(userName, email, password) {
  try {
    const admin = new User({
      userName,
      email,
      password: bcrypt.hashSync(password, 8),
      role: "admin",
    });
    console.table(await admin.save());
    //process.exit();
  } catch (e) {
    console.log(e);
    //process.exit();
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

async function getAdmins() {
  try {
    const admins = await User.find({ role: "admin" }).exec();
    const obj = {};
    admins.forEach(
      (admin) =>
        (obj[admin.id] = { userName: admin.userName, email: admin.email })
    );
    console.table(obj);
  } catch (e) {
    console.log(e);
  }
}

async function changePassword(email, password) {
  try {
    const admin = await User.findOne({ email: email }).exec();
    if (!email) {
      console.log("No such admin exists.");
    } else {
      (admin.password = bcrypt.hashSync(password, 8)), await admin.save();
      console.log("Password changed successfully");
    }
  } catch (e) {
    console.log(e);
  }
}
// TODO ---> fix this function
async function deleteAdmin(email) {
  try {
    if (!email) {
      console.log("Invalid email.");
    }
    const admin = await User.findOne({ email: email }).exec();
    if (!admin) {
      console.log("No such admin found.");
    }
    await admin.delete();
    console.log(`Admin with email: ${email} successfully deleted.`);
  } catch (e) {
    console.log(e);
  }
}

async function main() {
  switch (process.argv[2]) {
    case "--create":
      await getInput(process.argv[2], process.argv[3], process.argv[4]);
      break;
    case "--delete":
      await deleteAdmin(process.argv[3]);
      break;
    case "--change":
      await changePassword(process.argv[3], process.argv[4]);
      break;
    case "--get":
      await getAdmins();
      break;
    case "--help":
      console.log(
        `Usage: node admin [--get] [--help] [--change] [--delete] [--create] [<args>]

These are the commands used in various situations:

1)Get all admins:
    node admin --get
    
2)Get help:
    node admin --help
    
3)Change credentials for an admin:
    node admin --change EMAIL PASSWORD ADVANCE_PASSWORD
    
4)Delete an admin:
    node admin --delete EMAIL
    
5)Create an admin:
    node admin --create EMAIL PASSWORD ADVANCE_PASSWORD
    
Note: Enter the special characters followed by "\\" in the EMAIL, PASSWORD and ADVANCE_PASSWORD arguments.
`
      );
      break;
    default:
      console.log(
        'Incorrect command: Type "node admin --help" to get help on commands'
      );
      break;
  }
}
