const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const balanceSchema = new Schema(
  {
    balanceAccount: {
      type: Number,
      required: true,
    },
    info: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Balance = mongoose.model('balances', balanceSchema);

module.exports = Balance;
