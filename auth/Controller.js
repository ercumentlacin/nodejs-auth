const bcrypt = require('bcryptjs');

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
        res.status(400).json({
          message: 'Username does not exist',
        });
      }

      const isMatch = await bcrypt.compare(doc.password, user['password']);
      if (!isMatch) {
        res.status(400).json({
          message: 'Password is incorrect',
        });
      }

      const { password, ...userWithoutPassword } = user.toObject();
      res.status(200).json(userWithoutPassword);
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createUser,
  loginUser
};