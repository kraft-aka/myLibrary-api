const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { isEmail } = require("validator");
const db = require("./config/keys").mongoURI;
const Admin = require("./model/Admin");
const handleError = require("./utils/handleError");

async function createAdmin(email, password, advPassword) {
  try {
    if (!email) {
      console.log("Please provide an email");
      return;
    }
    if (!isEmail(email)) {
      console.log("Invalid Email");
      return;
    }
    if (!password) {
      console.log("Please provide an password");
      return;
    }
    if (
      !password.match(
        /^(?=.*\d+)(?=.*[A-Z]+)(?=.*[!@#$%^&*()_+-=[\]{};':"\\|,.<>/?]+).{8,}$/
      )
    ) {
      console.log(password);
      console.log(
        "Password must be 8 characters long and should contain at least one Digit, Capital letter and Special character"
      );
      return;
    }
    if (!advPassword) {
      console.log("Please provide an advance password");
      return;
    }
    if (
      !advPassword.match(
        /^(?=.*\d+)(?=.*[A-Z]+)(?=.*[!@#$%^&*()_+-=[\]{};':"\\|,.<>/?]+).{8,}$/
      )
    ) {
      console.log(
        "Advance password must be 8 characters long and should contain at least one Digit, Capital letter and Special character"
      );
      return;
    }
    if (password === advPassword) {
      console.log("Password and Advance password should be different.");
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash(password, salt);
    const hash2 = await bcrypt.hash(advPassword, salt);
    const admin = new Admin({
      email,
      password: hash1,
      advPassword: hash2,
    });
    if (await admin.save()) {
      console.log("Admin created successfully.");
    } else {
      console.log("Something went wrong.");
    }
  } catch (e) {
    if (handleError(e).email) {
      console.log("Admin already exists with that email.");
    }
  }
}

async function deleteAdmin(email) {
  try {
    if (!email) {
      console.log("Please provide an email");
      return;
    }
    if (!isEmail(email)) {
      console.log("Invalid Email");
      return;
    }
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      console.log("No Admin exists with that email.");
      return;
    }
    if (await admin.delete()) {
      console.log("Admin deleted successfully.");
    } else {
      console.log("Something went wrong.");
    }
  } catch (e) {
    console.log(e);
  }
}

async function changePassword(email, password, advPassword) {
  try {
    if (!email) {
      console.log("Please provide an email");
      return;
    }
    if (!isEmail(email)) {
      console.log("Invalid Email");
      return;
    }
    if (!password) {
      console.log("Please provide an password");
      return;
    }
    if (
      !password.match(
        /^(?=.*\d+)(?=.*[A-Z]+)(?=.*[!@#$%^&*()_+-=[\]{};':"\\|,.<>/?]+).{8,}$/
      )
    ) {
      console.log(password);
      console.log(
        "Password must be 8 characters long and should contain at least one Digit, Capital letter and Special character"
      );
      return;
    }
    if (!advPassword) {
      console.log("Please provide an advance password");
      return;
    }
    if (
      !advPassword.match(
        /^(?=.*\d+)(?=.*[A-Z]+)(?=.*[!@#$%^&*()_+-=[\]{};':"\\|,.<>/?]+).{8,}$/
      )
    ) {
      console.log(
        "Advance password must be 8 characters long and should contain at least one Digit, Capital letter and Special character"
      );
      return;
    }
    if (password === advPassword) {
      console.log("Password and Advance password should be different.");
      return;
    }
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      console.log("No Admin exists with that email.");
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash(password, salt);
    const hash2 = await bcrypt.hash(advPassword, salt);
    admin.password = hash1;
    admin.advPassword = hash2;
    if (await admin.save()) {
      console.log("Password changed successfully.");
    } else {
      console.log("Something went wrong.");
    }
  } catch (e) {
    console.log(e);
  }
}

async function getAdmins() {
  try {
    const admins = await Admin.find({}).select("email date").exec();
    const obj = {};
    admins.forEach((admin) => {
      obj[admin.id] = { email: admin.email, date: admin.date };
    });
    console.table(obj);
  } catch (e) {
    console.log(e);
  }
}

async function main() {
  switch (process.argv[2]) {
    case "--create":
      await createAdmin(process.argv[3], process.argv[4], process.argv[5]);
      break;
    case "--delete":
      await deleteAdmin(process.argv[3]);
      break;
    case "--change":
      await changePassword(process.argv[3], process.argv[4], process.argv[5]);
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

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(async () => {
    await main();
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
