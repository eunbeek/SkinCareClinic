const Service = require('../../models/service');

// create new
exports.addNewService = function (data) {
  return new Promise((resolve, reject) => {
    let newService = new Service(data);
    newService.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`new service (id: ${newService._id}) is created`);
      }
    });
  });
};

// view all
exports.viewAllServices = function () {
  return new Promise((resolve, reject) => {
    Service.find()
      .then((services) => {
        resolve(services);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one
exports.viewOneServiceById = function (id) {
  return new Promise((resolve, reject) => {
    Service.findOne({ _id: id })
      .exec()
      .then((service) => {
        resolve(service);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// update one
exports.editServiceById = function (data, id) {
  return new Promise((resolve, reject) => {
    Service.updateOne(
      { _id: id },
      {
        $set: data,
      }
    )
      .exec()
      .then(() => {
        resolve(`service (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// delete one
exports.deleteServiceById = function (id) {
  return new Promise((resolve, reject) => {
    Service.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`service (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
