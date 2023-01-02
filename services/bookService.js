const Book = require('../models/book');
const Comment = require('../models/comment');
var sanitize = require('mongo-sanitize');

async function getBooks(){
    let books = await Book.find();
    for(let i in books){
        let num_of_comments = await Comment.count({book:books[i]._id});
        books[i] = books[i].toObject();
        books[i]["commentcount"] = num_of_comments;
    }
    return books
      
}

async function addBook(title){
    if(!title || title.trim() == ''){
        return false;
    }
    let newBook = new Book({title:sanitize(title)});
    newBook = await newBook.save();
    return newBook;
}

async function deleteAllBooks(){
    let isBooksDeleted = await Book.deleteMany();
    let isCommentsDeleted = await Comment.deleteMany();
    return {deletedBooksNum:isBooksDeleted.deletedCount, 
        deletedCommentsNum:isCommentsDeleted.deletedCount};
}

async function getComments(bookId){
    let book = await Book.findOne({_id:sanitize(bookId)});
    if(!book){
      return false;
    }
    let commentObjects = await Comment.find({book:bookId});
    book = attachCommentsToBook(book, commentObjects)
    return book;
}

async function addComment(bookId, comment){
    bookId = sanitize(bookId);
    comment = sanitize(comment);
    if(!comment || comment == ''){
        return false;
      }
      let newComment = new Comment({
        comment:comment.trim(),
        book:bookId
      });
      newComment = await newComment.save();
      if(newComment){
        let commentedBook = await Book.findOne({_id:bookId});
        let commentObjects = await Comment.find({book:bookId});
        commentedBook = attachCommentsToBook(commentedBook, commentObjects);
        return commentedBook;
      }
      throw Error;
}

async function deleteBook(bookId){
    bookId = sanitize(bookId)
    let deletedBook = await Book.deleteOne({_id:bookId});
    let deletedComments = await Comment.deleteMany({book:bookId});
    return deletedBook;
}

function attachCommentsToBook(book, commentObjects){
    let comments = []
    for(let comment of commentObjects){
      comments.push(comment.comment);
    }
    book = book.toObject();
    book['comments'] = comments;
    return book;
  }

module.exports = {getBooks, addBook, deleteAllBooks, getComments, addComment, deleteBook}