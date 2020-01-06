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
      res.status(500).json(resp.createError(error), 500);
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
    res.status(500).json(resp.createError(error), 500);
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
    res.status(500).json(resp.createError(error), 500);
  });
}

exports.addUser = (req, res, next) => {
  
  const schema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    parent_id: Joi.string().required(),
    name: Joi.string().required(),
    company_name: Joi.string().required(),
    mobile: Joi.string().required(),
    gst: Joi.string().required(),
    reg_type: Joi.string().required(),
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    res.status(200).json(resp.createResponse(req.body, true));
   
  }
}
