const Offer = require('../../models/offer');

// create new
exports.addNewOffer = function (data) {
  return new Promise((resolve, reject) => {
    let newOffer = new Offer(data);
    newOffer.save((err) => {
      if (err) {
        reject(err);
      } else {
        resolve(`new offer (id: ${newOffer._id}) is created`);
      }
    });
  });
};

// view all
exports.viewAllOffers = function () {
  return new Promise((resolve, reject) => {
    Offer.find()
      .populate('service')
      .then((offers) => {
        resolve(offers);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// view one
exports.viewOneOfferById = function (id) {
  return new Promise((resolve, reject) => {
    Offer.findOne({ _id: id })
      .populate('service')
      .exec()
      .then((offer) => {
        resolve(offer);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// update one
exports.editOfferById = function (data, id) {
  return new Promise((resolve, reject) => {
    Offer.updateOne({ _id: id }, { $set: data })
      .exec()
      .then(() => {
        resolve(`offer (id: ${id}) is updated`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// delete one
exports.deleteOfferById = function (id) {
  return new Promise((resolve, reject) => {
    Offer.deleteOne({ _id: id })
      .exec()
      .then(() => {
        resolve(`offer (id: ${id}) is deleted`);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
