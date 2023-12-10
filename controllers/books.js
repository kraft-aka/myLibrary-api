const Book = require('../models/book');

async function addBook(req, res) {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    language: req.body.language,
    pages: req.body.pages,
    genre: req.body.genre,
  });
  try {
    const newBook = await book.save();
    res.status(200).send({ msg: 'Book is added', newBook })
  } catch (err) {
    res.status(500).send({ msg: 'Something went wrong', err: err.message })
  }
}

async function getAllBooks(req, res) {
  try {
    const books = await Book.find();
    if (books.length === 0) {
      return res.status(500).send({ msg: 'There are no books!' })
    } else {
      return res.status(200).send({ msg: 'Successfully found!', books })
    }

  } catch (err) {
    res.status(500).send({ msg: 'Something went wrong!', err: err.message })
  }
}

async function getOneBook(req, res) {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      res.status(404).send({ msg: 'Could find such book' })
    } else {
      res.status(200).send({ msg: 'Succesfully found book', book })
    }
  } catch (err) {
    res.status(500).send({ msg: 'Something went wrong!', err: err.message })
  }
}

module.exports = { addBook, getAllBooks, getOneBook }
