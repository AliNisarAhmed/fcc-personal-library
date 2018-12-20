/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server/server');

chai.use(chaiHttp);

describe('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  it('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentCount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });

  describe('Routing tests', function() {

    describe('POST /api/books with title => create book object/expect book object', function() {
      
      it('Test POST /api/books with title', function(done) {
        let title = `test title #${Date.now()}`;
        chai.request(server)
          .post('/api/books')
          .send({title})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'response should be an Object');
            assert.property(res.body, '_id', 'returned object should have a unique id');
            assert.property(res.body, 'title', 'returned object should have a title property');
            assert.equal(res.body.title, title);
            assert.isArray(res.body.comments, 'response should contain a comments array');
            assert.isEmpty(res.body.comments, 'the comments array should be empty');
            done();
          });
      });
      
      it('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          });
      });
      
    });


    // describe('GET /api/books/:id => returns a Book object with populated comments Array', function(){
      
    //   it('Test GET /api/books/:id',  function(done){
    //     let title = 'test title for comments Array'
    //     let text = 'test comment'
    //     const requester = chai.request(server).keepOpen();
        
    //     requester
    //       .post('/api/books')
    //       .send({title})
    //       .then(res => {
    //         requester
    //           .post(`/api/books/${res._id}`)
    //           .send({text})
    //           .then(book => {
    //             requester
    //               .get(`api/books/${book._id}`)
    //               .then(function (res) {
    //                 console.log(res);
    //                 assert.equal(res.status, 200);
    //                 assert.isArray(res.body, 'response is an Array');
    //               })
    //           })
    //         })
    //       done();
    //       requester.close();
    //   });      
    // });


    describe('GET /api/books/[id] => book object with [id]', function(){
      
      it('Test GET /api/books/[id] with id not in db',  function(done){
        let invalidId = 'abc123'
        chai.request(server)
          .get(`/api/books/${invalidId}`)
          .end(function(err, res) {
            assert.equal(res.status, 400);
            done();
          })
      });
      
      it('Test GET /api/books/[id] with valid id in db',  function(done){
        let title = `test title for get request #${Date.now()}`;
        chai.request(server)
          .post('/api/books')
          .send({title})
          .end(function(err, book) {
            // let book = res;
            chai.request(server)
              .get(`/api/books/${book.body._id}`)
              .end(function(err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body._id, book.body._id);
                assert.isArray(res.body.comments, 'comments is an Array');
                done();
              })
          })
      });
      
    });


    describe('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      it('Test POST /api/books/[id] with comment', function(done){
        let title = `test title for POST request #${Date.now()}`;
        let text = `test comment for POST request #${Date.now()}`;
        chai.request(server)
          .post('/api/books')
          .send({title})
          .end(function(err, newBook) {
            assert.equal(newBook.status, 200);
            chai.request(server)
              .post(`/api/books/${newBook.body._id}`)
              .send({text})
              .end(function(error, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body._id, newBook.body._id);
                assert.isArray(res.body.comments, 'comments is an Array');
                assert.equal(res.body.comments[0].text, text);
                done();
              })
          })
      });
      
    });

  });

});
