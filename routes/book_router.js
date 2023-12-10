const express = require("express");
const router = express.Router();

const { addBook, getAllBooks, getOneBook } = require("../controllers/books");

router.post("/books", addBook);
router.get("/books", getAllBooks);
router.get("/books/:id", getOneBook);

module.exports = router;
