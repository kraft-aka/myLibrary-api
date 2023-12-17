const mongoose = require("mongoose");
const userSchema = mongoose.Schema;

const User = new userSchema({
  userName: {
    type: String,
    required: [true, "Username must be provided"],
    unique: [true, "Username must be unique"],
  },
  email: {
    type: String,
    required: [true, "Email must be provided"],
    lowercase: true,
    trim: true,
    validate: {
      validator: (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str),
      message: "{VALUE} is not valid email!",
    },
  },
  password: {
    type: String,
    required: [true, "Provide password"],
    trim: true,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  readingList: [
    {
      book: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Book",
      },
    },
  ],
});

module.exports = mongoose.model("User", User);
