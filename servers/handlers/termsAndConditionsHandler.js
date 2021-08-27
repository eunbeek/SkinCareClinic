const TermsAndConditions = require('../../models/termsAndConditions');

// create new
exports.addNewTAC = function (data) {
  return new Promise((resolve, reject) => {
    let newTAC = new TermsAndConditions(data);
    newTAC.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`new Terms And Conditions (id: ${newTAC._id}) is created.`);
      }
    });
  });
};

// view all
exports.viewAllTACs = function () {
  return new Promise((resolve, reject) => {
    TermsAndConditions.find()
      .then((termsAndConditions) => {
        resolve(termsAndConditions);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one
exports.viewTACById = function (id) {
  return new Promise((resolve, reject) => {
    TermsAndConditions.findOne({ _id: id })
      .exec()
      .then((termsAndConditions) => {
        resolve(termsAndConditions);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// update one
exports.editTACById = function (data, id) {
  return new Promise((resolve, reject) => {
    TermsAndConditions.updateOne(
      { _id: id },
      {
        $set: data,
      }
    )
      .exec()
      .then(() => {
        resolve(`Terms And Conditions (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// delete one
exports.deleteTACById = function (id) {
  return new Promise((resolve, reject) => {
    TermsAndConditions.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`Terms And Conditions (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
