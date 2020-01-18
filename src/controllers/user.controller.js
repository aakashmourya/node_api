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

        UserModel.getDetail(result[0].user_id).then(function (result) {
          if (result.length) {
            let tokenPayload = {
              user_id: result[0].user_id,
              parent_id: result[0].parent_id,
              email: result[0].email
            }

            const token = jwt.sign(tokenPayload, process.env.JWT_KEY, { expiresIn: "1h" })
            res.status(200).json(resp.createResponse({ user: result[0], token }));

          } else {
            res.status(200).json(resp.createResponse(ErrCodes.getMessage(2000), false));
          }

        }).catch(function (error) {
          res.status(500).json(resp.createError(error), 500);
        });

      } else {
        res.status(200).json(resp.createResponse(ErrCodes.getMessage(2000), false));
      }

    }).catch(function (error) {
      res.status(500).json(resp.createError(error, 500));
    });

  }
}

exports.getUserDetails = (req, res, next) => {
  const schema = Joi.object({
    user_id: Joi.string().required()
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    UserModel.getDetail(req.body.user_id).then(function (result) {
      if (result.length) {
        res.status(200).json(resp.createResponse(result[0]));
      } else {
        res.status(200).json(resp.createResponse({}));
      }
    }).catch(function (error) {
      res.status(500).json(resp.createError(error, 500));
    });
  }
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
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Enter valid password.')),
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
    let { email, password, reg_type, company_name, gst, name, mobile, address } = req.body;

    let result = await dbHelper.select('users', "email=?", [email]).catch(error => resp.errorHandler(res, error, 500))
    if (result !== undefined && result.length) {
      res.status(200).json(resp.createResponse(ErrCodes.getMessage(2001), false));
      return;
    }

    if (reg_type == constant.REG_TYPE_COMPANY) {
      let result = await dbHelper.select('user_details', "company_name=?", [company_name]).catch(error => resp.errorHandler(res, error, 500))
      if (result !== undefined && result.length) {
        res.status(200).json(resp.createResponse(ErrCodes.getMessage(2002), false));
        return;
      }
    } else {
      company_name = "";
      gst = "";
    }

    let new_user_id = await dbHelper.getNewId("users");

    let insert_data = { user_id: new_user_id, parent_id: req.userData.user_id, email, password, status: 'A' }
    let user_detail = { user_id: new_user_id, name, company_name, mobile, address, gst, reg_type };
    result = await UserModel.addUser(insert_data, user_detail).catch(error => resp.errorHandler(res, error, 500))

    if (result !== undefined) {
      res.status(200).json(resp.createResponse(ErrCodes.getMessage(2003), true));
      return;
    }
  }
}
exports.editUser = async (req, res, next) => {

  const schema = Joi.object({
    user_id: Joi.string().required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required().error(new Error('Enter valid password.')),
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
    var { email, password, reg_type, company_name, gst, name, mobile, address,user_id } = req.body;

    let old_user_detail = await UserModel.getDetail(req.body.user_id).catch(error => resp.errorHandler(res, error, 500));
    //console.log(user_detail[0].email);
    if (old_user_detail !== undefined && old_user_detail.length) {
      
      old_user_detail = old_user_detail[0];

      if (email != old_user_detail.email) {
        let result = await dbHelper.select('users', "email=?", [email]).catch(error => resp.errorHandler(res, error, 500))
        if (result !== undefined && result.length) {
          res.status(200).json(resp.createResponse(ErrCodes.getMessage(2001), false));
          return;
        }
      }

      if (reg_type == constant.REG_TYPE_COMPANY) {
        if (company_name != old_user_detail.company_name) {
          let result = await dbHelper.select('user_details', "company_name=?", [company_name]).catch(error => resp.errorHandler(res, error, 500))
          if (result !== undefined && result.length) {
            res.status(200).json(resp.createResponse(ErrCodes.getMessage(2002), false));
            return;
          }
        }
      } else {
        company_name = "";
        gst = "";
      }

      let insert_data = {  email, password}
      let user_detail = { name, company_name, mobile, address, gst, reg_type };
      //console.log(insert_data,user_detail)
      let result = await UserModel.editUser(insert_data, user_detail,user_id).catch(error => resp.errorHandler(res, error, 500))

      if (result !== undefined) {
        res.status(200).json(resp.createResponse(ErrCodes.getMessage(2005), true));
        return;
      }
    } else {
      res.status(200).json(resp.createResponse(ErrCodes.getMessage(2004), false));
    }
  }
}


exports.getAllUsers = (req, res, next) => {
  const schema = Joi.object({
    user_id: Joi.string().required()
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    UserModel.getAllUsers(req.body.user_id).then(function (result) {
      if (result.length) {
        res.status(200).json(resp.createResponse(result));
      } else {
        res.status(200).json(resp.createResponse({}));
      }
    }).catch(function (error) {
      res.status(500).json(resp.createError(error, 500));
    });
  }
}

