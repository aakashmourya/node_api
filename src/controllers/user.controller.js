var express = require('express');
var router = express.Router();
var User = require('../models/user.model')
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

exports.login = (req, res, next) => {
  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    let { email, password } = req.body;
    dbHelper.select('users', "email=? and password=?", [email, password]).then(function (result) {

      if (result.length) {

        User.getDetail(result[0].user_id).then(function (result) {
          if (result.length) {
            let tokenPayload = {
              user_id: result[0].user_id,
              parent_id: result[0].parent_id,
              email: result[0].email
            }

            const token = jwt.sign(tokenPayload, process.env.JWT_KEY, { expiresIn: "1h" })
            res.status(200).json(resp.createResponse({ user: result[0], token }));

          } else {
            res.status(200).json(resp.createResponse(ErrCodes.getMessage(1090), false));
          }

        }).catch(function (error) {
          res.status(500).json(resp.createError(error), 500);
        });

      } else {
        res.status(200).json(resp.createResponse(ErrCodes.getMessage(1090), false));
      }

    }).catch(function (error) {
      res.status(500).json(resp.createError(error, 500));
    });

  }
}

exports.getUserDetails = (req, res, next) => {
  User.getDetail(req.userData.user_id).then(function (result) {
    if (result.length) {
      res.status(200).json(resp.createResponse(result[0]));
    } else {
      res.status(200).json(resp.createResponse({}));
    }
  }).catch(function (error) {
    res.status(500).json(resp.createError(error, 500));
  });
}

exports.getUserTypes = (req, res, next) => {
  dbHelper.select('user_types').then(function (result) {
    if (result.length) {
      res.status(200).json(resp.createResponse(result));
    } else {
      res.status(200).json(resp.createResponse({}));
    }
  }).catch(function (error) {
    res.status(500).json(resp.createError(error, 500));
  });
}

exports.addUser = async (req, res, next) => {

  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    parent_id: Joi.string().required(),
    name: Joi.string().required(),
    company_name: Joi.string().required(),
    mobile: Joi.string().required(),
    address: Joi.string().required(),
    gst: Joi.string().required(),
    reg_type: Joi.string().required(),
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    let { email, password, reg_type, company_name, gst, parent_id, name, mobile,address } = req.body;

    let result = await dbHelper.select('users', "email=?", [email]).catch(error => resp.errorHandler(res, error, 500))
    if (result !== undefined && result.length) {
      res.status(200).json(resp.createResponse(ErrCodes.getMessage(1000), false));
      return;
    }

    if (reg_type == constant.REG_TYPE_COMPANY) {
      let result = await dbHelper.select('user_details', "company_name=?", [company_name]).catch(error => resp.errorHandler(res, error, 500))
      if (result !== undefined && result.length) {
        res.status(200).json(resp.createResponse(ErrCodes.getMessage(1010), false));
        return;
      }
    } else {
      company_name = "";
      gst = "";
    }

    let new_user_id = await dbHelper.getNewId("users");

    let insert_data = { user_id: new_user_id, parent_id, email, password, status: 'A' }
    let user_detail = { user_id: new_user_id,name, company_name, mobile, address, gst, reg_type };
    result = await dbHelper.insert('users', insert_data).catch(error => resp.errorHandler(res, error, 500))
    let result1 = await dbHelper.insert('user_details', user_detail).catch(error => resp.errorHandler(res, error, 500))
   
    if (result !== undefined && result1 !== undefined) {
      res.status(200).json(resp.createResponse(ErrCodes.getMessage(1020), true));
      return;
    }
  }
}
