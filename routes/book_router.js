const express = require("express");
const router = express.Router();
const verifyUser = require("../utils/verifyUser");
const isAdmin = require("../utils/isAdmin");

const {
  addBook,
  getAllBooks,
  getOneBook,
  editBook,
  deleteBook,
} = require("../controllers/books");

router.post("/books", addBook, verifyUser, isAdmin);
router.get("/books", getAllBooks);
router.get("/books/:id", getOneBook);
router.put("/books/:id", editBook);
router.delete("/books/:id", deleteBook, isAdmin);
module.exports = router;
