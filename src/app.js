import Express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bookRoutes from './routes/book.routes.js';

dotenv.config();

// usamos express para los middlewares
const app = Express();
app.use(bodyParser.json()); // Parseador de Bodies

// Conectar la BD
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.MONGO_DB_NAME,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));
const db = mongoose.connection;

// Rutas
app.use('/books', bookRoutes);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));
