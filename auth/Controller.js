const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('./model');

const createUser = async (req, res, next) => {
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
        const { password, ...userWithoutPassword } = user.toObject();
        res.status(201).json(userWithoutPassword);
      });
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const doc = new User({ username, password });

    doc.validate(async (err) => {
      if (err) {
        res.status(400).json({
          message: err.message,
        });
      }
    })

    User.findOne({ username }, async (err, user) => {
      if (!user) {
        res.status(401).json({
          message: 'Username does not exist',
        });
      }

      const isMatch = await bcrypt.compare(doc.password, user['password']);
      if (!isMatch) {
        res.status(403).json({
          message: 'Password is incorrect',
        });
      }

      const payload = {
        userId: user._id,
        username: user.username,
      }

      jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1d',
      }, (err, token) => {
        if (err) {
          res.status(500).json({
            message: 'Error signing token',
          });
        } else {

          res.cookie('token', token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24 * 1,  // 1 day
          });

          res.status(200).json({
            token,
          });
        }
      });
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  loginUser
};