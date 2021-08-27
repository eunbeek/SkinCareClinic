const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimeSchema = new Schema(
  {
    time: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Time = mongoose.model('times', TimeSchema);

module.exports = Time;
