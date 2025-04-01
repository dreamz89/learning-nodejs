const express = require('express')
const { check, body } = require('express-validator')

const authController = require('../controllers/auth')
const User = require('../models/user')

const router = express.Router();

router.get('/login', authController.getLogin);

router.post('/login',
  body('email').isEmail().withMessage('Invalid email').normalizeEmail(),
  body('password').isLength({ min: 5 }).withMessage('Invalid password').trim(),
  authController.postLogin);

router.post('/logout', authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup',
  check('email').isEmail().normalizeEmail().custom((value) => {
    return User
      .findOne({ email: value })
      .then(user => {
        if (user) {
          throw new Error('Email already exists')
        }
      })
  }),
  body('password').isLength({ min: 5 }).trim(),
  body('confirmPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords must match')
    }
    return true
  }),
  authController.postSignup);

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/new-password', authController.postNewPassword);

module.exports = router;