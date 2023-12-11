const express = require("express");
const mongoose = require("mongoose");
const bookRouter = require('./routes/book_router');
const homeRouter = require('./routes/home')

require("dotenv").config();
const app = express();

// connects to mongodb database, URL is located in .env
try {
  mongoose.connect(process.env.URL, {});
  console.log('Connected to the server');
} catch (err) {
  console.log(err, "Something went wrong");
}

// enables app to automatically parse incoming JSON data
app.use(express.json());

// routes 
app.use(homeRouter);
app.use(bookRouter);

// app runs on the port 
app.listen(process.env.PORT, () => {
  console.log(`Listening on PORT ${process.env.PORT}`)
})