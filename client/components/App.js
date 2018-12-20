import React, { Component } from 'react'
import Axios from 'axios';

export default class App extends Component {
  state = {
    books: [],
    newBook: ''
  }

  componentDidMount() {
    this.fetchBooks();
  }

  fetchBooks = async () => {
    let res = await fetch('/api/books');
    let books = await res.json();
    this.setState({books});
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onNewBookSubmit = async (e) => {
    e.preventDefault();
    await Axios.post('/api/books', {
      title: this.state.newBook
    });
    this.setState({newBook: ''});
    this.fetchBooks();
  }
  
  render() {
    let books = [...this.state.books];
    return (
      <div className="container">
        <h1 id="title">Personal Book Library</h1>
        <div id="addBookForm">
          <h4 className="secondary-heading">Add a book</h4>
          <form onSubmit={this.onNewBookSubmit}>
            <label className="tertiary-heading">Title: 
              <input type="text" placeholder="Enter Book Title" name="newBook" required value={this.state.newBook} onChange={this.onInputChange}/>
            </label>
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="bookList">
          {
            this.state.books.length === 0 ? 
            <h4 className="cta">No book in the library, add a book!</h4> :
            books.reverse().map(book => (
              <div key={book._id} className="book">
                <h4 className="secondary-heading">{book.title}</h4>
                <p>{book.commentCount} Comment{book.commentCount == 1 ? '': 's'}</p>
              </div>
            ))
          }
        </div>
    </div>
    )
  }
}
