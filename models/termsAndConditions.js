const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TermsAndConditionsSchema = new Schema(
  {
    contents: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const TermsAndConditions = mongoose.model('termsAndConditions', TermsAndConditionsSchema);

module.exports = TermsAndConditions;
