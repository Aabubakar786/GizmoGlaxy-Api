import express, { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById } from '../controllers/user.js';
import { isAdmin } from '../middlewares/auth.js';
import { createProducts, deleteProduct, getAdminProducts, getAllCategories, getAllProducts, getProducts, getSingleProducts, updateProduct } from '../controllers/products.js';
import { singleUpload } from '../middlewares/multer.js';
// import { createUser, getUsers } from '../controllers/user.controller';

const app: Router = express.Router();

app.post('/',singleUpload, createProducts);
app.get('/getAll',isAdmin, getProducts);
app.get('/getAllproducts', getAllProducts);
app.get('/getCategories', getAllCategories)
app.get('/admin-products', getAdminProducts)
app.route("/:id").get(getSingleProducts).put(singleUpload, updateProduct).delete(deleteProduct)

// app.get('/:id', getUserById)
// app.delete('/:id', deleteUser)

export default app;