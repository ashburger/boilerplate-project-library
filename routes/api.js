'use strict';
const bookService = require('../services/bookService')
module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      try{
        let books = await bookService.getBooks();
        return res.status(200).send(books);
      }catch(err){
        // console.log(err);
        return res.status(400).send("Failed to get books");
      }
      
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      try{
        let title = req.body.title;
        let newBook = await bookService.addBook(title);
        if(newBook == false){
          return res.send('missing required field title');
        }
        return res.status(200).send(newBook);
      }catch(err){
        // console.log(err);
        return res.status(400).send("Failed to add book");
      }
      
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async function(req, res){
      try{
        let deleted = await bookService.deleteAllBooks();
        if(deleted.deletedBooksNum){
          return res.status(200).send("complete delete successful");
        }
        return res.send('Complete delete failed');
      }catch(err){
        // console.log(err);
        return res.send("complete delete failed");
      }
      
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      try{
        let bookId = req.params.id;
        let book = await bookService.getComments(bookId)
        if(book == false){
          return res.send('no book exists');
        }
        return res.status(200).send(book);
      }catch(err){
        // console.log(err);
        return res.send('Failed to get book')
      }
      

      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      try{
        let bookId = req.params.id;
        let comment = req.body.comment;
        let commentedBook = await bookService.addComment(bookId, comment)
        if(commentedBook == false){
          return res.send('missing required field comment');
        }
        
        return res.status(200).send(commentedBook);
        
      }catch(err){
        // console.log(err);
        return res.send('no book exists');
      }
      
      //json res format same as .get
    })
    
    .delete(async function(req, res){
      try{
        let bookId = req.params.id;
        let deletedBook = await bookService.deleteBook(bookId);
        if(deletedBook.deletedCount == 1){
          return res.status(200).send('delete successful')
        }
        return res.send('no book exists');
      }catch(err){
        // console.log(err);
        return res.send('error deleting book');
      }
      
      //if successful response will be 'delete successful'
    });
  
};
