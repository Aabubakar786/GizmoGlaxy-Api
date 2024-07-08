import express, { Router } from 'express';
import { isAdmin } from '../middlewares/auth.js';
import { createOrder } from '../controllers/order.js';


const app: Router = express.Router();
// /api/order/new  route 
app.post('/new',createOrder);

export default app;