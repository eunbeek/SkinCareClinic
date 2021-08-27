const Customer = require('../../models/customer');

// create new
exports.addNewCustomer = function (data) {
  return new Promise((resolve, reject) => {
    let newCustomer = new Customer(data);
    newCustomer.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`new customer (id: ${newCustomer._id}) is created.`);
      }
    });
  });
};

// view all
exports.viewAllCustomer = function () {
  return new Promise((resolve, reject) => {
    Customer.find()
      .populate({
        path: 'account',
        populate: { path: 'balanceHistory', populate: { path: 'balances' } },
      })
      .exec()
      .then((customer) => {
        resolve(customer);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one
exports.viewCustomerById = function (id) {
  return new Promise((resolve, reject) => {
    Customer.findOne({ _id: id })
      .populate('account')
      .exec()
      .then((customer) => {
        resolve(customer);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// update one
exports.editCustomerById = function (data, id) {
  return new Promise((resolve, reject) => {
    Customer.updateOne(
      { _id: id },
      {
        $set: data,
      }
    )
      .exec()
      .then(() => {
        resolve(`customer (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// delete one
exports.deleteCustomerById = function (id) {
  return new Promise((resolve, reject) => {
    Customer.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`customer (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

exports.viewCustomerByInput = function (query) {
  return new Promise((resolve, reject) => {
    Customer.findOne(query)
      .populate('account')
      .exec()
      .then((customer) => {
        resolve(customer);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
