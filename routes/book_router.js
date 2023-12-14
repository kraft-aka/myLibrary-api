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
  addLikeToBook
} = require("../controllers/books");

router.post("/books",verifyUser, isAdmin, addBook );
router.get("/books", getAllBooks);
router.get("/books/:id", getOneBook);
router.put("/books/:id", editBook);
router.delete("/books/:id", verifyUser, isAdmin, deleteBook);
router.put('/books/addLike/:id',verifyUser, addLikeToBook)
module.exports = router;
