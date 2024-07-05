import express, { Express} from 'express';
import { connectDB } from './utils/features.js';
// import connectDB from './utils/db';
import userRoutes from './routes/user.js';
import productRoutes from './routes/products.js';
import { errorMiddleware } from './middlewares/error.js';

const app: Express = express();

// Middleware
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// this is use to get image or file
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});