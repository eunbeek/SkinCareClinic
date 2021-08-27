const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkScheduleSchema = new Schema(
  {
    staff: {
      type: Schema.Types.ObjectId,
      ref: 'staffs',
      required: true,
    },
    date: {
      type: Schema.Types.ObjectId,
      ref: 'dates',
      required: true,
    },
    time: {
      type: Schema.Types.ObjectId,
      ref: 'times',
    },
    description: {
      type: String,
    },
    booked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const WorkSchedule = mongoose.model('workSchedules', WorkScheduleSchema);

module.exports = WorkSchedule;
