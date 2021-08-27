const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const accountSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userID: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    accountLevelId: {
      type: Schema.Types.ObjectId,
      ref: 'accountLevels',
      required: true,
    },
    balanceHistory: {
      type: Schema.Types.ObjectId,
      ref: 'balanceHistories',
      required: true,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);

accountSchema.pre('save', function (next) {
  let user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

accountSchema.pre('updateOne', function (next) {
  let user = this;
  if (user._update.$set.password) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user._update.$set.password, salt, function (err, hash) {
        if (err) return next(err);
        user._update.$set.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

accountSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt
    .compare(plainPassword, this.password)
    .then((isMatch) => isMatch)
    .catch((err) => err);
};

accountSchema.methods.generateToken = function () {
  const token = jwt.sign(this._id.toHexString(), 'secretToken');
  this.token = token;
  return this.save()
    .then((user) => user)
    .catch((err) => err);
};

accountSchema.statics.findByToken = function (token) {
  let user = this;

  return jwt.verify(token, 'secretToken', function (err, decoded) {
    return user
      .findOne({ _id: decoded, token: token })
      .then((user) => user)
      .catch((err) => err);
  });
};

const Account = mongoose.model('accounts', accountSchema);

module.exports = Account;
