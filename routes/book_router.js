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
  addLikeToBook,
  removeLikeFromBook,
  addBookToList,
  deleteBookFromList,
} = require("../controllers/books");

router.post("/books", verifyUser, isAdmin, addBook);
router.get("/books", getAllBooks);
router.get("/books/:id", getOneBook);
router.put("/books/:id", verifyUser, isAdmin, editBook);
router.delete("/books/:id", verifyUser, isAdmin, deleteBook);
router.put("/books/addLike/:id", verifyUser, addLikeToBook);
router.put("/books/removeLike/:id", verifyUser, removeLikeFromBook);
router.put("/books/addBookToList/:id", verifyUser, addBookToList);
router.put("/books/deleteBookFromList/:id", verifyUser, deleteBookFromList);
module.exports = router;
