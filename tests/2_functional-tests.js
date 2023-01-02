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
const server = require('../server');
const ObjectId = require('mongoose').Types.ObjectId;
const Book = require('../models/book');
chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
//   test('#example Test GET /api/books', function(done){
//     chai.request(server)
//      .get('/api/books')
//      .end(function(err, res){
//        assert.equal(res.status, 200);
//        assert.isArray(res.body, 'response should be an array');
//        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
//        assert.property(res.body[0], 'title', 'Books in array should contain title');
//        assert.property(res.body[0], '_id', 'Books in array should contain _id');
//        done();
//      });
//  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title:'funcTestTitle'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.equal(res.body.title, 'funcTestTitle');
            assert.equal(res.body._id, new ObjectId(res.body._id));
            done();
          });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res){
            assert.equal(res.text, 'missing required field title');
            done();
          });
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array');
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
            assert.property(res.body[0], 'title', 'Books in array should contain title');
            assert.property(res.body[0], '_id', 'Books in array should contain _id');
            done();
          });
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db', function(done){
        chai.request(server)
          .get('/api/books/invalidId123')
          .end(function(err, res){
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
      test('Test GET /api/books/[id] with valid id in db', async function(){
        let book = await Book.findOne({title:'funcTestTitle'});
        let bookId = book._id;
        chai.request(server)
          .get('/api/books/'+bookId)
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'comments property should be an array');
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
          });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', async function(){
        let book = await Book.findOne({title:'funcTestTitle'});
        let bookId = book._id;
        chai.request(server)
          .post('/api/books/'+ bookId)
          .send({comment: 'funcTestComment'})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'comments property should be an array');
            assert.includeMembers(res.body.comments, ['funcTestComment']);
            assert.property(res.body, 'title', 'Books in array should contain title');
            assert.property(res.body, '_id', 'Books in array should contain _id');
          });
      });

      test('Test POST /api/books/[id] without comment field', async function(){
        let book = await Book.findOne({title:'funcTestTitle'});
        let bookId = book._id;
        chai.request(server)
          .post('/api/books/'+ bookId)
          .end(function(err, res){
            assert.equal(res.text, 'missing required field comment');
          });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
          .post('/api/books/invalidId123')
          .send({comment: 'funcTestComment'})
          .end(function(err, res){
            assert.equal(res.text, 'no book exists');
            done();
          });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      
      test('Test DELETE /api/books/[id] with valid id in db', async function(){
        let book = await Book.findOne({title:'funcTestTitle'});
        let bookId = book._id;
        chai.request(server)
        .delete('/api/books/' + bookId)
        .end(function(err, res){
          assert.equal(res.text, 'delete successful');
        })
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/invalidId123')
        .end(function(err, res){
          assert.equal(res.text, 'no book exists');
          done()
        })
      });

    });

  });

});
