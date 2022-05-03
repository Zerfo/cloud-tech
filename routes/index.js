const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.guard');

const router = express.Router();

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  authController.register
);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/user', authMiddleware, authController.getUser);

router.all('*',  (req, res) => res.status(400).json({'error': 'Bad Request.'}))

module.exports = router;