const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    minlength: 1,
    required: true
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'book'
  }
});

const Comment = mongoose.model('comment', commentSchema);

module.exports = Comment;
