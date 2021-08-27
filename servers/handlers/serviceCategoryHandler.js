const ServiceCategory = require('../../models/serviceCategory');

// create new
exports.addNewServiceCategory = function (data) {
  return new Promise((resolve, reject) => {
    let newServiceCategory = new ServiceCategory(data);
    newServiceCategory.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`new service category (id: ${newServiceCategory._id}) is created.`);
      }
    });
  });
};

// view all
exports.viewAllServiceCategories = function () {
  return new Promise((resolve, reject) => {
    ServiceCategory.find()
      .then((serviceCategories) => {
        resolve(serviceCategories);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one
exports.viewServiceCategoryById = function (id) {
  return new Promise((resolve, reject) => {
    ServiceCategory.findOne({ _id: id })
      .exec()
      .then((serviceCategory) => {
        resolve(serviceCategory);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// update one
exports.editServiceCategoryById = function (data, id) {
  return new Promise((resolve, reject) => {
    ServiceCategory.updateOne(
      { _id: id },
      {
        $set: data,
      }
    )
      .exec()
      .then(() => {
        resolve(`service category (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// delete one
exports.deleteServiceCategoryById = function (id) {
  return new Promise((resolve, reject) => {
    ServiceCategory.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`service category (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
