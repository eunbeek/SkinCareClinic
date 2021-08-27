const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const faqSchema = new Schema(
  {
    faqCategory: {
      type: Schema.Types.ObjectId,
      ref: 'faqCategories',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    contents: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const FAQ = mongoose.model('faqs', faqSchema);

module.exports = FAQ;
