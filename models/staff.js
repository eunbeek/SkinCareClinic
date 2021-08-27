const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const staffSchema = new Schema(
  {
    account: {
      type: Schema.Types.ObjectId,
      ref: 'accounts',
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
    sin: {
      type: Number,
      required: true,
    },
    workSchedules: [
      {
        type: Schema.Types.ObjectId,
        ref: 'workSchedules',
      },
    ],
  },
  { timestamps: true }
);

const Staff = mongoose.model('staffs', staffSchema);

module.exports = Staff;
