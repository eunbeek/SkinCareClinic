const Date = require('../../models/date');

// create new
exports.addNewDate = function (data) {
  return new Promise((resolve, reject) => {
    let newDate = new Date(data);
    newDate.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`New date (id: ${newDate._id}) is created.`);
      }
    });
  });
};

// view all
exports.viewAllDates = function () {
  return new Promise((resolve, reject) => {
    Date.find()
      .then((dates) => {
        resolve(dates);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one
exports.viewDateById = function (id) {
  return new Promise((resolve, reject) => {
    Date.findOne({ _id: id })
      .exec()
      .then((date) => {
        resolve(date);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// update one
exports.editDateById = function (data, id) {
  return new Promise((resolve, reject) => {
    Date.updateOne(
      { _id: id },
      {
        $set: data,
      }
    )
      .exec()
      .then(() => {
        resolve(`Date (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// delete one
exports.deleteDateById = function (id) {
  return new Promise((resolve, reject) => {
    Date.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`Date (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.viewDateByInput = function (query) {
  return new Promise((resolve, reject) => {
    Date.find(query)
      .then((dates) => {
        resolve(dates);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
