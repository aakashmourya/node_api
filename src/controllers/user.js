var express = require('express');
var router = express.Router();
var User = require('../models/user')
var SCodes = require('../helper/success-codes')
var ErrCodes = require('../helper/error-codes')
var resp = require("../helper/response.helper")
var validate = require('../helper/validate.helper')
var dbHelper = require('../helper/db.helper')
const date = require('date-and-time');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const checkAuth=require('../middleware/check-auth');

exports.login=(req, res, next) =>{
    const schema = Joi.object({
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required()
    })
  
    let result = schema.validate(req.body);
  
    if (result.error) {
      res.status(400).json(resp.createJoiError(result.error));
    } else {
      let { email, password } = req.body;
      dbHelper.select('users', "email=? and password=?", [email, password]).then(function (result) {
       
        if (result.length) {
          let tokenPayload = {
            user_id: result[0].user_id,
            parent_id: result[0].parent_id,
            email: result[0].email
          }
          console.log(tokenPayload);
          const token = jwt.sign(tokenPayload, process.env.JWT_KEY, { expiresIn: "1h" })
  
          res.status(200).json(resp.createResponse({token}, true, "result"));
        } else {
          res.status(200).json(resp.createResponse(ErrCodes.getMessage(109), false));
        }
  
      }).catch(function (error) {
        res.status(500).json(resp.createError(error));
      });
    }
  }

  exports.user=(req, res, next)=> {
    const schema = Joi.object({
      password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    })
  
    let result = schema.validate(req.body);
  
    if (result.error) {
      res.status(400).json(resp.createJoiError(result.error));
    } else {
      let { email, password } = req.body;
      res.status(200).json(resp.createResponse({body:req.userData}, true, "result"));
  
      // dbHelper.select('users', "email=? and password=?", [email, password]).then(function (result) {
       
      //   if (result.length) {
      //     let tokenPayload = {
      //       user_id: result[0].user_id,
      //       parent_id: result[0].parent_id,
      //       email: result[0].email
      //     }
      //     console.log(tokenPayload);
      //     const token = jwt.sign(tokenPayload, process.env.JWT_KEY, { expiresIn: "1h" })
  
      //     res.status(200).json(resp.createResponse({token}, true, "result"));
      //   } else {
      //     res.status(200).json(resp.createResponse(ErrCodes.getMessage(109), false));
      //   }
  
      // }).catch(function (error) {
      //   res.status(500).json(resp.createError(error));
      // });
    }
  }
  