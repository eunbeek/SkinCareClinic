const Balance = require('../../models/balance');

//Create
exports.addNewBalance = function (data) {
  return new Promise((resolve, reject) => {
    let newBalance = new Balance(data);
    newBalance.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`New Balance (id: ${newBalance._id}) is created`);
      }
    });
  });
};

//Read All
exports.viewAllBalance = function () {
  return new Promise((resolve, reject) => {
    Balance.find()
      .populate({
        path: 'services',
        populate: [{ path: 'serviceCategory' }],
      })
      .then((balances) => {
        resolve(balances);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//Read
exports.viewOneBalanceById = function (id) {
  return new Promise((resolve, reject) => {
    Balance.findOne({ _id: id })
      .populate({
        path: 'services',
        populate: [{ path: 'serviceCategory' }],
      })
      .exec()
      .then((balance) => {
        resolve(balance);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//Update
exports.editBalanceById = function (data, id) {
  return new Promise((resolve, reject) => {
    Balance.updateOne({ _id: id }, { $set: data })
      .exec()
      .then(() => {
        resolve(`Balance (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

//Delete
exports.deleteBalanceById = function (id) {
  return new Promise((resolve, reject) => {
    Balance.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`Balance (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
