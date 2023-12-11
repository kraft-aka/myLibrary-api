const express = require("express");
const router = express.Router();

const {
  addBook,
  getAllBooks,
  getOneBook,
  editBook,
  deleteBook,
} = require("../controllers/books");

router.post("/books", addBook);
router.get("/books", getAllBooks);
router.get("/books/:id", getOneBook);
router.put("/books/:id", editBook);
router.delete("/books/:id", deleteBook);
module.exports = router;
