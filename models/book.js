const mongoose = require('mongoose');
const bookSchema = mongoose.Schema({
  title: {type:String, required:true, unique:false}
}, { versionKey: false });

module.exports = mongoose.model('Book', bookSchema);