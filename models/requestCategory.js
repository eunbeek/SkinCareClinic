const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RequestCategory = mongoose.model('requestCategories', requestCategorySchema);

module.exports = RequestCategory;
