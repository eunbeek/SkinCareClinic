const Time = require('../../models/time');

// create new
exports.addNewTime = function (data) {
  return new Promise((resolve, reject) => {
    let newTime = new Time(data);
    newTime.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`New time (id: ${newTime._id}) is created.`);
      }
    });
  });
};

// view all
exports.viewAllTimes = function () {
  return new Promise((resolve, reject) => {
    Time.find()
      .then((times) => {
        resolve(times);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one
exports.viewTimeById = function (id) {
  return new Promise((resolve, reject) => {
    Time.findOne({ _id: id })
      .exec()
      .then((time) => {
        resolve(time);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// update one
exports.editTimeById = function (data, id) {
  return new Promise((resolve, reject) => {
    Time.updateOne(
      { _id: id },
      {
        $set: data,
      }
    )
      .exec()
      .then(() => {
        resolve(`Time (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// delete one
exports.deleteTimeById = function (id) {
  return new Promise((resolve, reject) => {
    Time.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`Time (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
