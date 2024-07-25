import express, { Router } from 'express';
import { isAdmin } from '../middlewares/auth.js';
import { createOrder, deleteOrder, getAllOrders, processOrder } from '../controllers/order.js';


const app: Router = express.Router();
// /api/orders/new  route 
app.post('/new',createOrder); 
app.get('/getAll',getAllOrders);
app.route("/:id").put(processOrder).delete(deleteOrder)

export default app; 