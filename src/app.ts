import express, { Express} from 'express';
import { connectDB } from './utils/features.js';
// import connectDB from './utils/db';
import userRoutes from './routes/user.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/order.js'
import { errorMiddleware } from './middlewares/error.js';
import NodeCache from "node-cache";
import {config} from "dotenv";
import morgan from "morgan"


config({
  path:"./.env"
})

console.log('process.env>PORT',process.env.PORT)
const app: Express = express();

// Middleware
app.use(express.json());
app.use(morgan("dev"));
// Connect to MongoDB
connectDB(process.env.MONGODB_URL, process.env.DB_NAME);
export const nodeCache = new NodeCache();
// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.unsubscribe('/api/orders', orderRoutes)

// this is use to get image or file
app.use("/uploads", express.static("uploads"));
app.use(errorMiddleware)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});