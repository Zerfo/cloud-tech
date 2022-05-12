import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';

import { AuthController, ReqController } from '../controllers';
import { authMiddleware, roleMiddleware } from '../middleware';
import { storageConfig } from '../configs';
import { ROLE_ADMIN, ROLE_USER } from '../constants';

const router = express.Router();

router.post(
  '/registration',
  roleMiddleware([ROLE_ADMIN]),
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  AuthController.register,
);
router.post('/login', AuthController.login);
router.post('/change-password', authMiddleware, AuthController.changePassword);
router.post('/logout', AuthController.logout);
router.get('/user:id', authMiddleware, AuthController.getUser);
router.get('/users', authMiddleware, roleMiddleware([ROLE_ADMIN]), AuthController.getUsers);

router.get('requests', authMiddleware, roleMiddleware([ROLE_ADMIN]), ReqController.getAllRequests);
router.get('requests:id', authMiddleware, ReqController.getAllRequestsByUserId);
router.post(
  '/request/add',
  authMiddleware,
  roleMiddleware([ROLE_ADMIN, ROLE_USER]),
  ReqController.addRequest,
);
router.post(
  '/request/add-file',
  authMiddleware,
  multer({ storage: storageConfig }).single('file'),
  roleMiddleware([ROLE_ADMIN, ROLE_USER]),
  ReqController.addRequest,
);
router.post(
  '/request/change-status',
  authMiddleware,
  roleMiddleware([ROLE_ADMIN, ROLE_USER]),
  ReqController.addRequest,
);

router.all('/ping', (req, res) => res.status(200).json({ method: req.method, text: 'ping' }));
router.all('*', (req, res) => res.status(400).json({ error: 'Bad Request.' }));

export default router;
