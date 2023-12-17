const Book = require("../models/book"); // import Book model+schema
const User = require("../models/user");

// adds book
async function addBook(req, res) {
  // creates instance of book. input comes from req.body
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    language: req.body.language,
    pages: req.body.pages,
    genre: req.body.genre,
    addedBy: req.user.id,
  });

  try {
    // save the item to the collection in mongodb
    const newBook = await book.save();
    res.status(200).send({ msg: "Book is added", newBook });
  } catch (err) {
    res.status(500).send({ msg: "Something went wrong", err: err.message });
  }
}

// fetches all books from db
async function getAllBooks(req, res) {
  try {
    // find method returns all items from given collection
    const books = await Book.find();
    // checks if books contains any book
    if (books.length === 0) {
      return res.status(500).send({ msg: "There are no books!" });
    } else {
      return res.status(200).send({ msg: "Successfully found!", books });
    }
  } catch (err) {
    res.status(500).send({ msg: "Something went wrong!", err: err.message });
  }
}
// fetches one particular book from the collection
async function getOneBook(req, res) {
  try {
    // searches one book bt id and assigns it to the book const. Id param comes from body
    const book = await Book.findOne({ _id: req.params.id });
    // if there is no such book with a given id it returns res.status(404)
    if (!book) {
      res.status(404).send({ msg: "Could find such book" });
    } else {
      //otherwise book is returned
      res.status(200).send({ msg: "Succesfully found book", book });
    }
  } catch (err) {
    res.status(500).send({ msg: "Something went wrong!", err: err.message });
  }
}

//updates one book
async function editBook(req, res) {
  try {
    const book = await Book.findOneAndUpdate(
      { _id: req.params.id, addedBy: req.user.id },
      {
        title: req.body.title,
        author: req.body.author,
        language: req.body.language,
        pages: req.body.pages,
        genre: req.body.genre,
        avaiable: req.body.available,
      },
      { new: true }
    );
    res.status(200).send({ msg: "Book updated successfully", book });
  } catch (err) {
    res.status(500).send({ msg: "Something went wrong!", err: err.message });
  }
}

// deletes one books by id
async function deleteBook(req, res) {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      addedBy: req.user.id,
    });
    if (!book) {
      res.status(500).send({ msg: "Could not find this book" });
    } else {
      res.status(200).send({
        msg: "Book with is id: " + req.params.id + " successfully removed",
      });
    }
  } catch (err) {
    res.status(500).send({ msg: "Something went wrong!", err: err.message });
  }
}

// add likes to a book
async function addLikeToBook(req, res) {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).send({ msg: "Not found" });
    } else {
      if (
        book.likes.filter((like) => like.user.toString() === req.user.id)
          .length > 0
      ) {
        return res.status(400).send({ msg: "Already added like" });
      }
      book.likes.unshift({ user: req.user.id });
      await book.save();
      return res.status(200).send({ msg: "Liked added" });
    }
  } catch (err) {
    res.status(500).send({ msg: "Something went wrong", err: err.message });
  }
}

//removes like from a book
async function removeLikeFromBook(req, res) {
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (!book) {
      return res.status(404).send({ msg: "Book not found" });
    } else {
      if (
        book.likes.filter((like) => like.user.toString() === req.user.id)
          .length > 0
      ) {
        const idx = book.likes.findIndex(
          (like) => like.user.toString() === req.user.id
        );
        book.likes.splice(idx, 1);
        await book.save();
        return res.status(200).send({ msg: "Successfully removed like" });
      }
      return res
        .status(400)
        .send({ msg: "User did not add like to this book" });
    }
  } catch (err) {
    res.status(500).send({ msg: "Something went wrong", err: err.message });
  }
}

// adds book to a readning list
async function addBookToList(req, res) {
  try {
    const book = req.params.id;
    const user = await User.findOne({ _id: req.user.id });
    console.log(book);
    if (!user) {
      return res.status(404).send({ msg: "Could not find a book" });
    } else {
      if (
        user.readingList.filter((read) => read.book.toString() === book)
          .length > 0
      ) {
        return res
          .status(500)
          .send({ msg: "Book is already in a reading list" });
      }
      user.readingList.unshift({ book });
      await user.save();
      return res
        .status(200)
        .send({ msg: "Book added successfully to the reading list", book });
    }
  } catch (err) {
    res.status(500).send({ msg: "Something went wrong", err: err.message });
  }
}

module.exports = {
  addBook,
  getAllBooks,
  getOneBook,
  editBook,
  deleteBook,
  addLikeToBook,
  removeLikeFromBook,
  addBookToList,
};
