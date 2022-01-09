const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
    maxlength: 30,
    validate: {
      validator: (value) => /^[a-zA-Z0-9]+$/.test(value),
      message: '{VALUE} is not a valid username!',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
