const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pageSchema = new Schema(
  {
    isActive: {
      type: Boolean,
      required: true,
    },
    accountLevels: [
      {
        type: Schema.Types.ObjectId,
        ref: 'accountLevels',
        required: true,
      },
    ],
  },
  { timestamps: true }
);

const Page = mongoose.model('pages', pageSchema);

module.exports = Page;
