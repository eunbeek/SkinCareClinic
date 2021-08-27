const AccountLevel = require('../../models/accountLevel');

//Create
exports.addNewAccountLevel = function (data) {
  return new Promise((resolve, reject) => {
    let newAccountLevel = new AccountLevel(data);
    newAccountLevel.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`New Account Level (id: ${newAccountLevel._id}) is created`);
      }
    });
  });
};

//Read All
exports.viewAllAccountLevel = function () {
  return new Promise((resolve, reject) => {
    AccountLevel.find()
      .then((offers) => {
        resolve(offers);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//Read
exports.viewOneAccountLevelById = function (id) {
  return new Promise((resolve, reject) => {
    AccountLevel.findOne({ _id: id })
      .exec()
      .then((offer) => {
        resolve(offer);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//Update
exports.editAccountLevelById = function (data, id) {
  return new Promise((resolve, reject) => {
    AccountLevel.updateOne({ _id: id }, { $set: data })
      .exec()
      .then(() => {
        resolve(`Account Level (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//Delete
exports.deleteAccountLevelById = function (id) {
  return new Promise((resolve, reject) => {
    AccountLevel.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`Account Level (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
