const express = require('express');
const app = express();
const port = process.env.PORT || 3001;
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./dbConnection');
const mongoose = require('mongoose');
const accountHandler = require('./handlers/accountHandler');
const accountLevelHandler = require('./handlers/accountLevelHandler');
const balanceHandler = require('./handlers/balanceHandler');
const balanceHistoryHandler = require('./handlers/balanceHistoryHandler');
const serviceCategoryHandler = require('./handlers/serviceCategoryHandler');
const serviceHandler = require('./handlers/serviceHandler');
const pageHandler = require('./handlers/pageHandler');
const offerHandler = require('./handlers/offerHandler');
const requestCategoryHandler = require('./handlers/requestCategoryHandler');
const staffHandler = require('./handlers/staffHandler');
const customerHandler = require('./handlers/customerHandler');
const requestHandler = require('./handlers/requestHandler');
const dateHandler = require('./handlers/dateHandler');
const timeHandler = require('./handlers/timeHandler');
const workScheduleHandler = require('./handlers/workScheduleHandler');
const appointmentHandler = require('./handlers/appointmentHandler');
const faqHandler = require('./handlers/faqHandler');
const faqCategoryHandler = require('./handlers/faqCategoryHandler');
const Account = require('../models/account');
const cookieParser = require('cookie-parser');
const termsAndConditionsHandler = require('./handlers/termsAndConditionsHandler');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
db();

mongoose.set('useFindAndModify', false);

//Account
app.post('/create-account', async (req, res) => {
  try {
    const userNameValidation = await Account.findOne({ userID: req.body.userID }).exec();
    if (userNameValidation) {
      throw Error(`Username ${req.body.userID} has been taken. Please try another username.`);
    }

    const emailValidation = await Account.findOne({ email: req.body.email }).exec();
    if (emailValidation) {
      throw Error(`Email ${req.body.email} has been taken. Please try another username.`);
    }

    accountHandler
      .addNewAccount(req.body)
      .then((body) => res.json(body))
      .catch((err) => res.json(err));
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
});

app.get('/accounts', (req, res) => {
  accountHandler
    .viewAllAccount()
    .then((accounts) => res.json(accounts))
    .catch((err) => res.json(err));
});

app.get('/account/:id', (req, res) => {
  accountHandler
    .viewOneAccountById(req.params.id)
    .then((accounts) => res.json(accounts))
    .catch((err) => res.json(err));
});

app.put('/account/:id', (req, res) => {
  accountHandler
    .editAccountById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/account/:id', (req, res) => {
  accountHandler
    .deleteAccountById(req.params.id)
    .then((accounts) => res.json(accounts))
    .catch((err) => res.json(err));
});

app.get('/account', (req, res) => {
  accountHandler
    .viewOneAccountByInput(req.query)
    .then((accounts) => res.json(accounts))
    .catch((err) => res.json(err));
});

//Account Level
app.post('/create-account-level', (req, res) => {
  accountLevelHandler.addNewAccountLevel(req.body).then((msg) => res.json(msg));
});

app.get('/account-levels', (req, res) => {
  accountLevelHandler
    .viewAllAccountLevel(req.params.id)
    .then((accountLevel) => res.json(accountLevel))
    .catch((err) => res.json(err));
});
app.get('/account-level/:id', (req, res) => {
  accountLevelHandler
    .viewOneAccountLevelById(req.params.id)
    .then((accountLevel) => res.json(accountLevel))
    .catch((err) => res.json(err));
});

app.put('/account-level/:id', (req, res) => {
  accountLevelHandler
    .editAccountLevelById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/account-level/:id', (req, res) => {
  accountLevelHandler
    .deleteAccountLevelById(req.params.id)
    .then((accountLevel) => res.json(accountLevel))
    .catch((err) => res.json(err));
});

//Balance
app.post('/create-balance', (req, res) => {
  balanceHandler.addNewBalance(req.body).then((msg) => res.json(msg));
});

app.get('/balances', (req, res) => {
  balanceHandler
    .viewAllBalance(req.params.id)
    .then((balances) => res.json(balances))
    .catch((err) => res.json(err));
});

app.get('/balance', (req, res) => {
  balanceHandler
    .viewOneBalanceById(req.query)
    .then((balance) => res.json(balance))
    .catch((err) => res.json(err));
});

app.get('/balance/:id', (req, res) => {
  balanceHandler
    .viewOneBalanceById(req.params.id)
    .then((balances) => res.json(balances))
    .catch((err) => res.json(err));
});

app.put('/balance/:id', (req, res) => {
  balanceHandler
    .editBalanceById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/balance/:id', (req, res) => {
  balanceHandler
    .deleteBalanceById(req.params.id)
    .then((balances) => res.json(balances))
    .catch((err) => res.json(err));
});

//Balance History
app.post('/create-balance-history', (req, res) => {
  balanceHistoryHandler.addNewBalanceHistory(req.body).then((msg) => res.json(msg));
});

app.get('/balance-histories', (req, res) => {
  balanceHistoryHandler
    .viewAllBalanceHistory(req.params.id)
    .then((balanceHistory) => res.json(balanceHistory))
    .catch((err) => res.json(err));
});

app.get('/balance-history/:id', (req, res) => {
  balanceHistoryHandler
    .viewOneBalanceHistoryById(req.params.id)
    .then((balanceHistory) => res.json(balanceHistory))
    .catch((err) => res.json(err));
});

app.put('/balance-history/:id', (req, res) => {
  balanceHistoryHandler
    .editBalanceHistoryById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/balance-history/:id', (req, res) => {
  balanceHistoryHandler
    .deleteBalanceHistoryById(req.params.id)
    .then((balanceHistory) => res.json(balanceHistory))
    .catch((err) => res.json(err));
});

app.post('/add-balance/:id', (req, res) => {
  balanceHistoryHandler
    .addBalanceInHistoryById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.post('/subtract-balance/:id', (req, res) => {
  balanceHistoryHandler
    .subtractBalanceInHistoryById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

// service-category
app.post('/create-service-category', (req, res) => {
  serviceCategoryHandler.addNewServiceCategory(req.body).then((msg) => res.json(msg));
});

app.get('/service-categories', (req, res) => {
  serviceCategoryHandler
    .viewAllServiceCategories()
    .then((serviceCategories) => res.json(serviceCategories))
    .catch((err) => res.json(err));
});

app.get('/service-category/:id', (req, res) => {
  serviceCategoryHandler
    .viewServiceCategoryById(req.params.id)
    .then((serviceCategory) => res.json(serviceCategory))
    .catch((err) => res.json(err));
});

app.put('/service-category/:id', (req, res) => {
  serviceCategoryHandler
    .editServiceCategoryById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/service-category/:id', (req, res) => {
  serviceCategoryHandler
    .deleteServiceCategoryById(req.params.id)
    .then((serviceCategory) => res.json(serviceCategory))
    .catch((err) => res.json(err));
});

// service
app.post('/create-service', (req, res) => {
  serviceHandler.addNewService(req.body).then((msg) => res.json(msg));
});

app.get('/services', (req, res) => {
  serviceHandler
    .viewAllServices()
    .then((services) => res.json(services))
    .catch((err) => res.json(err));
});

app.get('/service/:id', (req, res) => {
  serviceHandler
    .viewOneServiceById(req.params.id)
    .then((service) => res.json(service))
    .catch((err) => res.json(err));
});

app.put('/service/:id', (req, res) => {
  serviceHandler
    .editServiceById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/service/:id', (req, res) => {
  serviceHandler
    .deleteServiceById(req.params.id)
    .then((service) => res.json(service))
    .catch((err) => res.json(err));
});

// page
app.post('/create-page', (req, res) => {
  pageHandler.addNewPage(req.body).then((msg) => res.json(msg));
});

app.get('/pages', (req, res) => {
  pageHandler
    .viewAllPages()
    .then((pages) => res.json(pages))
    .catch((err) => res.json(err));
});

app.get('/page/:id', (req, res) => {
  pageHandler
    .viewOnePageById(req.params.id)
    .then((page) => res.json(page))
    .catch((err) => res.json(err));
});

app.put('/page/:id', (req, res) => {
  pageHandler
    .editPageById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/page/:id', (req, res) => {
  pageHandler
    .deletePageById(req.params.id)
    .then((page) => res.json(page))
    .catch((err) => res.json(err));
});

// offer
app.post('/create-offer', (req, res) => {
  offerHandler.addNewOffer(req.body).then((msg) => res.json(msg));
});

app.get('/offers', (req, res) => {
  offerHandler
    .viewAllOffers()
    .then((offers) => res.json(offers))
    .catch((err) => res.json(err));
});

app.get('/offer/:id', (req, res) => {
  offerHandler
    .viewOneOfferById(req.params.id)
    .then((offer) => res.json(offer))
    .catch((err) => res.json(err));
});

app.put('/offer/:id', (req, res) => {
  offerHandler
    .editOfferById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/offer/:id', (req, res) => {
  offerHandler
    .deleteOfferById(req.params.id)
    .then((offer) => res.json(offer))
    .catch((err) => res.json(err));
});

// staff
app.post('/create-staff', (req, res) => {
  staffHandler.addNewStaff(req.body).then((msg) => res.json(msg));
});

app.get('/staffs', (req, res) => {
  staffHandler
    .viewAllStaff()
    .then((staffs) => res.json(staffs))
    .catch((err) => res.json(err));
});

app.get('/staff/:id', (req, res) => {
  staffHandler
    .viewStaffById(req.params.id)
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
});

app.put('/staff/:id', (req, res) => {
  staffHandler
    .editStaffById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/staff/:id', (req, res) => {
  staffHandler
    .deleteStaffById(req.params.id)
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
});

app.get('/staff', (req, res) => {
  staffHandler
    .viewStaffByInput(req.query)
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
});

app.get('/active-staff/:id', (req, res) => {
  staffHandler
    .activeStaffById(req.params.id)
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
});

app.get('/inactive-staff/:id', (req, res) => {
  staffHandler
    .inactiveStaffById(req.params.id)
    .then((staff) => res.json(staff))
    .catch((err) => res.json(err));
});

// customer
app.post('/create-customer', (req, res) => {
  customerHandler.addNewCustomer(req.body).then((msg) => res.json(msg));
});

app.get('/customers', (req, res) => {
  customerHandler
    .viewAllCustomer()
    .then((customers) => res.json(customers))
    .catch((err) => res.json(err));
});

app.get('/customer/:id', (req, res) => {
  customerHandler
    .viewCustomerById(req.params.id)
    .then((customer) => res.json(customer))
    .catch((err) => res.json(err));
});

app.put('/customer/:id', (req, res) => {
  customerHandler
    .editCustomerById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/customer/:id', (req, res) => {
  customerHandler
    .deleteCustomerById(req.params.id)
    .then((customer) => res.json(customer))
    .catch((err) => res.json(err));
});

app.get('/customer', (req, res) => {
  customerHandler
    .viewCustomerByInput(req.query)
    .then((customer) => res.json(customer))
    .catch((err) => res.json(err));
});

// request
app.post('/create-request', (req, res) => {
  requestHandler.addNewRequest(req.body).then((msg) => res.json(msg));
});

app.get('/requests', (req, res) => {
  requestHandler
    .viewAllRequest()
    .then((requests) => res.json(requests))
    .catch((err) => res.json(err));
});

app.get('/request/:id', (req, res) => {
  requestHandler
    .viewRequestById(req.params.id)
    .then((request) => res.json(request))
    .catch((err) => res.json(err));
});

app.get('/request', (req, res) => {
  requestHandler
    .viewRequestByInput(req.query)
    .then((request) => res.json(request))
    .catch((err) => res.json(err));
});

app.put('/request/:id', (req, res) => {
  requestHandler
    .editRequestById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/request/:id', (req, res) => {
  requestHandler
    .deleteRequestById(req.params.id)
    .then((request) => res.json(request))
    .catch((err) => res.json(err));
});

// request-category
app.post('/create-request-category', (req, res) => {
  requestCategoryHandler.addNewRequestCategory(req.body).then((msg) => res.json(msg));
});

app.get('/request-categories', (req, res) => {
  requestCategoryHandler
    .viewAllRequestCategories()
    .then((requestCategory) => res.json(requestCategory))
    .catch((err) => res.json(err));
});

app.get('/request-category/:id', (req, res) => {
  requestCategoryHandler
    .viewRequestCategoryById(req.params.id)
    .then((requestCategory) => res.json(requestCategory))
    .catch((err) => res.json(err));
});

app.get('/request-category', (req, res) => {
  requestCategoryHandler
    .viewRequestCategoryByInput(req.query)
    .then((requestCategory) => res.json(requestCategory))
    .catch((err) => res.json(err));
});

app.put('/request-category/:id', (req, res) => {
  requestCategoryHandler
    .editRequestCategoryById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/request-category/:id', (req, res) => {
  requestCategoryHandler
    .deleteRequestCategoryById(req.params.id)
    .then((requestCategory) => res.json(requestCategory))
    .catch((err) => res.json(err));
});

// date
app.post('/create-date', (req, res) => {
  dateHandler.addNewDate(req.body).then((msg) => res.json(msg));
});

app.get('/dates', (req, res) => {
  dateHandler
    .viewAllDates()
    .then((dates) => res.json(dates))
    .catch((err) => res.json(err));
});

app.get('/date/:id', (req, res) => {
  dateHandler
    .viewDateById(req.params.id)
    .then((date) => res.json(date))
    .catch((err) => res.json(err));
});

app.get('/date', (req, res) => {
  dateHandler
    .viewDateByInput(req.query)
    .then((date) => res.json(date))
    .catch((err) => res.json(err));
});

app.put('/date/:id', (req, res) => {
  dateHandler
    .editDateById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/date/:id', (req, res) => {
  dateHandler
    .deleteDateById(req.params.id)
    .then((date) => res.json(date))
    .catch((err) => res.json(err));
});

// time
app.post('/create-time', (req, res) => {
  timeHandler.addNewTime(req.body).then((msg) => res.json(msg));
});

app.get('/times', (req, res) => {
  timeHandler
    .viewAllTimes()
    .then((times) => res.json(times))
    .catch((err) => res.json(err));
});

app.get('/time/:id', (req, res) => {
  timeHandler
    .viewTimeById(req.params.id)
    .then((time) => res.json(time))
    .catch((err) => res.json(err));
});

app.put('/time/:id', (req, res) => {
  timeHandler
    .editTimeById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/time/:id', (req, res) => {
  timeHandler
    .deleteTimeById(req.params.id)
    .then((time) => res.json(time))
    .catch((err) => res.json(err));
});

// workSchedule
app.post('/create-workSchedule', (req, res) => {
  workScheduleHandler.addNewWorkSchedule(req.body).then((msg) => res.json(msg));
});

app.get('/workSchedules', (req, res) => {
  workScheduleHandler
    .viewAllWorkSchedules()
    .then((workSchedules) => res.json(workSchedules))
    .catch((err) => res.json(err));
});

app.get('/staffWorkSchedules', (req, res) => {
  workScheduleHandler
    .viewAllWorkSchedulesByStaff(req.query)
    .then((workSchedules) => res.json(workSchedules))
    .catch((err) => res.json(err));
});

app.get('/workSchedule', (req, res) => {
  workScheduleHandler
    .viewWorkScheduleByDate(req.query)
    .then((workSchedule) => res.json(workSchedule))
    .catch((err) => res.json(err));
});

app.get('/workSchedule/:id', (req, res) => {
  workScheduleHandler
    .viewWorkScheduleById(req.params.id)
    .then((workSchedule) => res.json(workSchedule))
    .catch((err) => res.json(err));
});

app.put('/workSchedule/:id', (req, res) => {
  workScheduleHandler
    .editWorkScheduleById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/workSchedule/:id', (req, res) => {
  workScheduleHandler
    .deleteWorkScheduleById(req.params.id)
    .then((workSchedule) => res.json(workSchedule))
    .catch((err) => res.json(err));
});

// appointment
app.post('/create-appointment', (req, res) => {
  appointmentHandler.addNewAppointments(req.body).then((msg) => res.json(msg));
});

app.get('/appointments', (req, res) => {
  appointmentHandler
    .viewAllAppointments()
    .then((appointments) => res.json(appointments))
    .catch((err) => res.json(err));
});

app.get('/appointment/:id', (req, res) => {
  appointmentHandler
    .viewAppointmentById(req.params.id)
    .then((appointment) => res.json(appointment))
    .catch((err) => res.json(err));
});

app.put('/appointment/:id', (req, res) => {
  appointmentHandler
    .editAppointmentById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/appointment/:id', (req, res) => {
  appointmentHandler
    .deleteAppointmentById(req.params.id)
    .then((appointment) => res.json(appointment))
    .catch((err) => res.json(err));
});

app.get('/appointment', (req, res) => {
  appointmentHandler
    .viewAllAppointmentsByCustomer(req.query)
    .then((appointment) => res.json(appointment))
    .catch((err) => res.json(err));
});

app.put('/appointment/confirm/:id', (req, res) => {
  appointmentHandler
    .editAppointmentById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

// faq
app.post('/create-faq', (req, res) => {
  faqHandler.addNewFAQ(req.body).then((msg) => res.json(msg));
});

app.get('/faqs', (req, res) => {
  faqHandler
    .viewAllFAQs()
    .then((faqs) => res.json(faqs))
    .catch((err) => res.json(err));
});

app.get('/faq/:id', (req, res) => {
  faqHandler
    .viewFAQById(req.params.id)
    .then((faq) => res.json(faq))
    .catch((err) => res.json(err));
});

app.put('/faq/:id', (req, res) => {
  faqHandler
    .editFAQById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/faq/:id', (req, res) => {
  faqHandler
    .deleteFAQById(req.params.id)
    .then((faq) => res.json(faq))
    .catch((err) => res.json(err));
});

// faq-category
app.post('/create-faq-category', (req, res) => {
  faqCategoryHandler.addNewFAQCategory(req.body).then((msg) => res.json(msg));
});

app.get('/faq-categories', (req, res) => {
  faqCategoryHandler
    .viewAllFAQCategories()
    .then((faqCategories) => res.json(faqCategories))
    .catch((err) => res.json(err));
});

app.get('/faq-category/:id', (req, res) => {
  faqCategoryHandler
    .viewFAQCategoryById(req.params.id)
    .then((faqCategory) => res.json(faqCategory))
    .catch((err) => res.json(err));
});

app.put('/faq-category/:id', (req, res) => {
  faqCategoryHandler
    .editFAQCategoryById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/faq-category/:id', (req, res) => {
  faqCategoryHandler
    .deleteFAQCategoryById(req.params.id)
    .then((faqCategory) => res.json(faqCategory))
    .catch((err) => res.json(err));
});

//login
app.post('/login', (req, res) => {
  Account.findOne({ userID: req.body.userID }, (err, user) => {
    if (err || user == null) {
      return res.json({
        loginSuccess: false,
        message: 'Not available ID',
      });
    }
    user
      .comparePassword(req.body.password)
      .then((isMatch) => {
        if (!isMatch) {
          return res.json({
            loginSuccess: false,
            message: 'Not matched password',
          });
        }
        user
          .generateToken()
          .then((user) => {
            res
              .cookie('x_auth', user.token)
              .status(200)
              .json({ loginSuccess: true, _id: user._id, token: user.token });
          })
          .catch((err) => {
            res.status(400).send(err);
          });
      })
      .catch((err) => res.json({ loginSuccess: false, err }));
  });
});

app.post('/forgot', (req, res) => {
  Account.findOne({ email: req.body.email }, (err, user) => {
    if (err || user == null) {
      return res.json({
        findID: false,
        message: 'Not available email',
      });
    }
    user
      .generateToken()
      .then((user) => {
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, _id: user._id, token: user.token });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  });
});

app.post('/forgotPassword', (req, res) => {
  Account.findOne({ email: req.body.email }, (err, user) => {
    if (err || user == null) {
      return res.json({
        findID: false,
        message: 'Not available email',
      });
    }

    Account.findOne({ userID: req.body.userID }, (err, user) => {
      if (err || user == null) {
        return res.json({
          findID: false,
          message: 'Not available ID',
        });
      }
      user
        .generateToken()
        .then((user) => {
          res
            .cookie('x_auth', user.token)
            .status(200)
            .json({ loginSuccess: true, _id: user._id, token: user.token });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    });
  });
});

// Terms And Conditions
app.post('/create-terms-and-conditions', (req, res) => {
  termsAndConditionsHandler.addNewTAC(req.body).then((msg) => res.json(msg));
});

app.get('/terms-and-conditions', (req, res) => {
  termsAndConditionsHandler
    .viewAllTACs()
    .then((termsAndConditions) => res.json(termsAndConditions))
    .catch((err) => res.json(err));
});

app.get('/terms-and-conditions/:id', (req, res) => {
  termsAndConditionsHandler
    .viewTACById(req.params.id)
    .then((termsAndConditions) => res.json(termsAndConditions))
    .catch((err) => res.json(err));
});

app.put('/terms-and-conditions/:id', (req, res) => {
  termsAndConditionsHandler
    .editTACById(req.body, req.params.id)
    .then((msg) => res.json(msg))
    .catch((err) => res.json(err));
});

app.delete('/terms-and-conditions/:id', (req, res) => {
  termsAndConditionsHandler
    .deleteTACById(req.params.id)
    .then((termsAndConditions) => res.json(termsAndConditions))
    .catch((err) => res.json(err));
});
app.use('/api', (req, res) => res.json({ backServer: 'true' }));

app.listen(port, () => {
  console.log('Express http server listening on: ' + port);
});
