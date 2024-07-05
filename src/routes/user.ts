import express, { Router } from 'express';
import { createUser, deleteUser, getAllUsers, getUserById } from '../controllers/user.js';
import { isAdmin } from '../middlewares/auth.js';
// import { createUser, getUsers } from '../controllers/user.controller';

const app: Router = express.Router();

app.post('/', createUser);
app.get('/getAll',isAdmin, getAllUsers)
app.get('/:id', getUserById)
app.delete('/:id', deleteUser)

export default app;