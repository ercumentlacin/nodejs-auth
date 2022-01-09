const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

const db = require('../db/connection');
const User = require('./model');

const users = db.get('users');
users.createIndex('username', { unique: true });

router.get('/', (req, res) => {
  res.json({
    message: 'auth!',
  });
});

// @route   POST api/v1/auth/signup
// @desc    Create a new user
router.post('/signup', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const doc = new User({
      username,
      password,
    });

    doc.validate(async (err) => {
      if (err) {
        res.status(400).json({
          message: err.message,
        });
      }
    })

    User.findOne({ username: username }, async (err, user) => {
      if (user) {
        res.status(400).json({
          message: 'Username already exists',
        });
      }

      doc.password = await bcrypt.hash(password, 12).then((hash) => hash)

      await doc.save(async (err, user) => {
        if (err) {
          res.status(400).json({
            message: err.message,
          });
        }
        res.status(201).json(user);
      });
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
