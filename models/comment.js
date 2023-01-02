const mongoose = require('mongoose');
const Book = require('./book');
const commentSchema = mongoose.Schema({
  comment: {type:String, required:true, unique:false},
  book:{type: mongoose.Schema.Types.ObjectId, ref: Book, required:true}
}, { versionKey: false });

module.exports = mongoose.model('Comment', commentSchema);