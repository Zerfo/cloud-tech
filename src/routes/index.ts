import express from 'express';
import {body} from 'express-validator';

import {AuthController} from '../controllers';
import {authMiddleware} from '../middleware';
import {roleMiddleware} from '../middleware';

// import {ROLE_ADMIN, ROLE_USER, ROLE_SECURITY} from '../constants';
import {ROLE_ADMIN} from '../constants';

const router = express.Router();

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 32}),
  AuthController.register,
);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get(
  '/user',
  authMiddleware,
  AuthController.getUser,
);
router.get(
  '/users',
  authMiddleware,
  roleMiddleware(ROLE_ADMIN),
  AuthController.getUsers,
);

router.all('*', (req, res) => res.status(400).json({error: 'Bad Request.'}));

export default router;
