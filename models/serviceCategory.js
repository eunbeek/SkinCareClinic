const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ServiceCategory = mongoose.model('serviceCategories', serviceCategorySchema);

module.exports = ServiceCategory;
