const router = require('express').Router();
const Book = require('../models/book');
const Comment = require('../models/comment');


// GET - List of all books with commentCount
router.get('/', async (req, res) => {
  try {
    let books = await Book.find({}).exec();
    books = books.map(book => ({
      _id: book._id,
      title: book.title,
      commentCount: book.comments.length
    }));
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

// GET - Get details for a particular book with comments in an array
router.get('/:id', async (req, res) => {
  try {
    let book = await Book.findById(req.params.id).populate('comments').exec();
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(400).json({error: 'No book with that ID exists'})
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

// POST - Add a comment on a particular book
router.post('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let comment = await Comment.create({text: req.body.text, book: id});
    let book = await Book.findOneAndUpdate({_id: id}, {$push: {comments: comment._id}}, {new: true}).populate('comments').exec();
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({error: error.message});
  }
})

// POST - Add a new book with title, returns the book object
router.post('/', async (req, res) => {
  try {
    let title = req.body.title;
    if (!title) {
      res.status(400).json({error: 'title is required'});
    } else {
      let book = await Book.create({ title });
      res.status(200).json(book);
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});

router.delete('/:id', async (req, res) => {
  try {
    let id = req.params.id;
    let book = await Book.findById(id).exec();
    book.comments.forEach(async comment => {
      await Comment.findByIdAndDelete(comment);
    });
    await Book.findByIdAndDelete(book._id).exec();
    if (book) {
      res.status(200).send('successfully deleted');
    } else {
      res.json({error: 'could not delete'});
    }
  } catch (error) {
    res.json({error: error.message});
  }
});

router.delete('/', async (req, res) => {
  try {
    let books = await Book.find({}).exec();
    if (books) {
      books.forEach(async book => {
        book.comments.forEach(async comment => {
          await Comment.findByIdAndDelete(comment);
        });
        await Book.findByIdAndDelete(book._id);
      });
    }
    res.status(200).send('complete delete successful')
  } catch (error) {
    res.status(400).json({error: error.message});
  }
});


module.exports = router;