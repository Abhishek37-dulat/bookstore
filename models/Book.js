const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  bookId: { type: String, unique: true, required: true },
  authors: [{ type: String }],
  sellCount: { type: Number, default: 0 },
  title: { type: String, unique: true, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 100, max: 1000 },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
