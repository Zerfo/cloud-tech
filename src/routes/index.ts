import express from 'express';
import { body } from 'express-validator';

import { AuthController } from '../controllers';
import { authMiddleware, roleMiddleware } from '../middleware';

import { ROLE_ADMIN } from '../constants';

const router = express.Router();

router.post(
  '/registration',
  roleMiddleware(ROLE_ADMIN),
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  AuthController.register,
);
router.post('/login', AuthController.login);
router.post('/change-password', authMiddleware, AuthController.changePassword);
router.post('/logout', AuthController.logout);
router.get('/user', authMiddleware, AuthController.getUser);
router.get('/users', authMiddleware, roleMiddleware(ROLE_ADMIN), AuthController.getUsers);

router.all('/ping', (req, res) => res.status(200).json({ method: req.method, text: 'ping' }));
router.all('*', (req, res) => res.status(400).json({ error: 'Bad Request.' }));

export default router;
