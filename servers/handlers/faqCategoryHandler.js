const FAQCategory = require('../../models/faqCategory');

// create new
exports.addNewFAQCategory = function (data) {
  return new Promise((resolve, reject) => {
    let newFAQCategory = new FAQCategory(data);
    newFAQCategory.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`new request category (id: ${newFAQCategory._id}) is created.`);
      }
    });
  });
};

// view all
exports.viewAllFAQCategories = function () {
  return new Promise((resolve, reject) => {
    FAQCategory.find()
      .then((faqCategories) => {
        resolve(faqCategories);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one
exports.viewFAQCategoryById = function (id) {
  return new Promise((resolve, reject) => {
    FAQCategory.findOne({ _id: id })
      .exec()
      .then((faqCategory) => {
        resolve(faqCategory);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// update one
exports.editFAQCategoryById = function (data, id) {
  return new Promise((resolve, reject) => {
    FAQCategory.updateOne(
      { _id: id },
      {
        $set: data,
      }
    )
      .exec()
      .then(() => {
        resolve(`FAQ category (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// delete one
exports.deleteFAQCategoryById = function (id) {
  return new Promise((resolve, reject) => {
    FAQCategory.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`FAQ category (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
