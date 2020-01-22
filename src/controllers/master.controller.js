var express = require('express');
var router = express.Router();
var UserModel = require('../models/user.model')
var SCodes = require('../helper/success-codes')
var ErrCodes = require('../helper/error-codes')
var resp = require("../helper/response.helper")
var validate = require('../helper/validate.helper')
var dbHelper = require('../helper/db.helper')
const date = require('date-and-time');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const checkAuth = require('../middleware/check-auth');
const constant = require('../constants');

exports.getTests = (req, res, next) => {
  dbHelper.select('test_master').then(function (result) {
    if (result.length) {
      res.status(200).json(resp.createResponse(result));
    } else {

      res.status(200).json(resp.createResponse({}));
    }
  }).catch(function (error) {

    res.status(500).json(resp.createError(error, 500));
  });
}

exports.getPackages = (req, res, next) => {
  dbHelper.select('packages').then(function (result) {
    if (result.length) {
      res.status(200).json(resp.createResponse(result));
    } else {

      res.status(200).json(resp.createResponse({}));
    }
  }).catch(function (error) {

    res.status(500).json(resp.createError(error, 500));
  });
}
