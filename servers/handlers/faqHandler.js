const FAQ = require('../../models/faq');

// create new
exports.addNewFAQ = function (data) {
  return new Promise((resolve, reject) => {
    let newFAQ = new FAQ(data);
    newFAQ.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`new FAQ (id: ${newFAQ._id}) is created.`);
      }
    });
  });
};

// view all
exports.viewAllFAQs = function () {
  return new Promise((resolve, reject) => {
    FAQ.find()
      .populate('faqCategory')
      .exec()
      .then((faqs) => {
        resolve(faqs);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one
exports.viewFAQById = function (id) {
  return new Promise((resolve, reject) => {
    FAQ.findOne({ _id: id })
      .populate('faqCategory')
      .exec()
      .then((faq) => {
        resolve(faq);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// update one
exports.editFAQById = function (data, id) {
  return new Promise((resolve, reject) => {
    FAQ.updateOne(
      { _id: id },
      {
        $set: data,
      }
    )
      .exec()
      .then(() => {
        resolve(`FAQ (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// delete one
exports.deleteFAQById = function (id) {
  return new Promise((resolve, reject) => {
    FAQ.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`FAQ (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
