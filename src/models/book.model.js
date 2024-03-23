import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genere: String,
  publication_date: String,
});

export default mongoose.model('Book', bookSchema);
