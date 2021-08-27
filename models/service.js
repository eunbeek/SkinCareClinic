const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const serviceSchema = new Schema(
  {
    serviceCategory: {
      type: Schema.Types.ObjectId,
      ref: 'serviceCategories',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Service = mongoose.model('services', serviceSchema);

module.exports = Service;
