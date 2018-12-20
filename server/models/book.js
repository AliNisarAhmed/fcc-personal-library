const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  comments: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'comment'}]
  }
});

const Book = mongoose.model('book', bookSchema);

module.exports = Book;