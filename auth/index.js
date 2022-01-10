const express = require('express');
const router = express.Router();

const db = require('../db/connection');
const { createUser, loginUser } = require('./Controller');

const users = db.get('users');
users.createIndex('username', { unique: true });

router.get('/', (req, res) => { 
  res.json({
    message: 'auth!',
  });
});

// @route   POST api/v1/auth/signup
// @desc    Create a new user
router.post('/signup', createUser);

// @route   POST api/v1/auth/login
// @desc    Login a user
router.post('/login', loginUser)

module.exports = router;
