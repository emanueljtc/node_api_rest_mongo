import Express from 'express';
import { Router } from 'express';
import Book from '../models/book.model.js';
const express = Express();
const router = Router();

//MIDDLEWARE
const getBook = async (req, res, next) => {
  let book;
  const { id } = req.params;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(404).json({ message: 'Book id not found' });
  }

  try {
    book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.book = book;
  next();
};
// ALL BOOKS
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    console.log('GET ALLS:', books);
    if (books.length === 0) return res.status(204).json([]);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CREATE BOOK
router.post('/', async (req, res) => {
  const { title, author, genere, publication_date } = req.body;
  if (!title || !author || !genere || !publication_date) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const book = new Book({
    title,
    author,
    genere,
    publication_date,
  });
  try {
    const newBook = await book.save();
    console.log('NEW BOOK:', newBook);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET BOOK
router.get('/:id', getBook, (req, res) => {
  res.json(res.book);
});

// PUT BOOK
router.put('/:id', getBook, async (req, res) => {
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genere = req.body.genere || book.genere;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// Patch
router.patch('/:id', getBook, async (req, res) => {
  if (
    !req.body.title &&
    !req.body.author &&
    !req.body.genere &&
    !req.body.publication_date
  ) {
    return res
      .status(400)
      .json({ message: 'At least one of the fields is required to send' });
  }
  try {
    const book = res.book;
    book.title = req.body.title || book.title;
    book.author = req.body.author || book.author;
    book.genere = req.body.genere || book.genere;
    book.publication_date = req.body.publication_date || book.publication_date;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

// DELETE BOOK
router.delete('/:id', getBook, async (req, res) => {
  try {
    const book = res.book;
    await book.deleteOne({ _id: book._id });
    res.json({ message: `Book ${book.title} deleted` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
