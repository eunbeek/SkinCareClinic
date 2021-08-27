const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DateSchema = new Schema(
  {
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Date = mongoose.model('dates', DateSchema);

module.exports = Date;
