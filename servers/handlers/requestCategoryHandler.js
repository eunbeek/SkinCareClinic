const RequestCategory = require('../../models/requestCategory');

// create new
exports.addNewRequestCategory = function (data) {
  return new Promise((resolve, reject) => {
    let newRequestCategory = new RequestCategory(data);
    newRequestCategory.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`new request category (id: ${newRequestCategory._id}) is created.`);
      }
    });
  });
};

// view all
exports.viewAllRequestCategories = function () {
  return new Promise((resolve, reject) => {
    RequestCategory.find()
      .then((requestCategories) => {
        resolve(requestCategories);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one
exports.viewRequestCategoryById = function (id) {
  return new Promise((resolve, reject) => {
    RequestCategory.findOne({ _id: id })
      .exec()
      .then((requestCategory) => {
        resolve(requestCategory);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one by input
exports.viewRequestCategoryByInput = function (query) {
  return new Promise((resolve, reject) => {
    RequestCategory.find(query)
      .then((requestCategories) => {
        resolve(requestCategories);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// update one
exports.editRequestCategoryById = function (data, id) {
  return new Promise((resolve, reject) => {
    RequestCategory.updateOne(
      { _id: id },
      {
        $set: data,
      }
    )
      .exec()
      .then(() => {
        resolve(`request category (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// delete one
exports.deleteRequestCategoryById = function (id) {
  return new Promise((resolve, reject) => {
    RequestCategory.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`request category (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
