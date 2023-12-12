const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    validate: {
      validator: (str) => str.trim().length !== 0,
      message: "{VALUE} can not be empty string!",
    },
  },
  author: {
    type: String,
    required: [true, "Title is required"],
    validate: {
      validator: (str) => str.trim().length !== 0,
      message: "{VALUE} can not be empty string!",
    },
  },
  language: {
    type: [String],
    default: ["english"],
  },
  pages: {
    type: Number,
    required: false,
    default: 0,
  },
  genre: {
    type: [String],
  },
  available: {
    type: Boolean,
    default: false,
  },
  addedBy : {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  likes: [
    {
      user: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
      }
    }
  ],
}, { timestamps: true });


module.exports = mongoose.model('Book', bookSchema);
