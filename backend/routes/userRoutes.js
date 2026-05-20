import express from 'express';
const router = express.Router();
import { registerUser, authUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', authUser);

router.route('/').get(protect, getUsers);
router.route('/:id').get(protect, getUser).put(protect, updateUser).delete(protect, deleteUser);

export default router;
