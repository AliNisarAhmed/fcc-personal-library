const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const connect = require('./connect');
const bookRoutes = require('./routes/booksRoutes');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MOGNO_URI || 'mongodb://localhost:27017/personal-library';

const app = express();

app.use(helmet());
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api/books', bookRoutes);

app.use(express.static('dist'));


module.exports = app;

connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server connected on port:${PORT}`);
    });
  });


