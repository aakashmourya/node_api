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
    dbHelper.select('users', "email=? and password=? and status=?", [email, password, "A"]).then(function (result) {

      if (result.length) {

        UserModel.getDetail(result[0].user_id).then(function (result) {
          if (result.length) {
            let tokenPayload = {
              user_id: result[0].user_id,
              added_by: result[0].added_by,
              email: result[0].email,
              ref_code: result[0].ref_code
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
    referred_by: Joi.string(),
    percentage: Joi.string(),
    reg_type: Joi.string().required(),
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    let { email, password, reg_type, company_name, gst, name, mobile, address,referred_by,percentage } = req.body;
//console.log(referred_by,percentage);
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

    if(referred_by){
      let result = await dbHelper.select('users', "ref_code=?", [referred_by]).catch(error => resp.errorHandler(res, error, 500))
      if (result !== undefined && result.length==0) {
        res.status(200).json(resp.createResponse(ErrCodes.getMessage(2007), false));
        return;
      }
    }


    let new_user_id = await dbHelper.getNewId("users");
    let ref_code = await dbHelper.getNewRefCode("users", "R");

    let user_data = { user_id: new_user_id, added_by: req.userData.user_id, email, password, ref_code, status: 'A' }
    let user_detail = { user_id: new_user_id, name, company_name, mobile, address, gst, reg_type };

    let user_reference_data =null;
    if(referred_by && percentage){
      user_reference_data={user_id: new_user_id,ref_code:referred_by,percentage}
    }else{
      user_reference_data={user_id: new_user_id,ref_code:'',percentage:'00'}
    }
    
    result = await UserModel.addUser(user_data, user_detail,user_reference_data).catch(error => resp.errorHandler(res, error, 500));

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
    referred_by: Joi.string(),
    percentage: Joi.string(),
    reg_type: Joi.string().required(),
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    var { email, password, reg_type, company_name, gst, name, mobile, address, user_id ,referred_by,percentage } = req.body;

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

      if(referred_by){
        let result = await dbHelper.select('users', "ref_code=?", [referred_by]).catch(error => resp.errorHandler(res, error, 500))
        if (result !== undefined && result.length==0) {
          res.status(200).json(resp.createResponse(ErrCodes.getMessage(2007), false));
          return;
        }
      }

      let insert_data = { email, password }
      let user_detail = { name, company_name, mobile, address, gst, reg_type };

      let user_reference_data =null;
      if(referred_by && percentage){
        user_reference_data={user_id: user_id,ref_code:referred_by,percentage}
      }else{
        user_reference_data={user_id: user_id,ref_code:'',percentage:'00'}
      }

      //console.log(insert_data,user_detail)
      let result = await UserModel.editUser(insert_data, user_detail, user_reference_data,user_id).catch(error => resp.errorHandler(res, error, 500))

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
    user_id: Joi.string().required(),
    ref_code: Joi.string().required()
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    UserModel.getAllUsers(req.body.user_id,req.body.ref_code).then(function (result) {
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

exports.addContract = async (req, res, next) => {
  console.log(req.body, req.file);
  const schema = Joi.object({
    user_id: Joi.string().required(),
    from_date: Joi.string().required(),
    to_date: Joi.string().required(),
    tests: Joi.string().required(),
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    let { user_id, from_date, to_date, tests } = req.body;

    let test_data = JSON.parse(tests);


    let result = await dbHelper.select('user_contracts', "user_id=?", [user_id]).catch(error => resp.errorHandler(res, error, 500))
    if (result !== undefined && result.length) {
      res.status(200).json(resp.createResponse(ErrCodes.getMessage(2008), false));
      return;
    }

    //console.log(test_data);

    let contract_no = await dbHelper.getNewId("user_contracts", "C-");

    let user_contract = { contract_no, document: req.file.filename, user_id, from_date, to_date }
    //console.log(user_contract);
    let user_contract_tests = test_data.map(item => { return { contract_no, test_id: item.test_id, package_id: item.selected_package, percentage: item.percentage, mrp: item.test_mrp }; });//Object.keys(item).map((key) => item[key]));

     result = await UserModel.addContract(user_contract, user_contract_tests).catch(error => resp.errorHandler(res, error, 500))

    if (result !== undefined) {
      res.status(200).json(resp.createResponse(ErrCodes.getMessage(2006), true));
      return;
    }

  }
}

exports.checkReferenceCode = (req, res, next) => {
  const schema = Joi.object({
    reference_code: Joi.string().required()
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    let {reference_code}=req.body;
    dbHelper.select('users','ref_code=?',[reference_code],'ref_code').then(function (result) {
      if (result.length) {
        res.status(200).json(resp.createResponse({exist:true}));
      } else {
        res.status(200).json(resp.createResponse({exist:false}));
      }
    }).catch(function (error) {
      res.status(500).json(resp.createError(error, 500));
    });
  }
}

exports.getContractDetails = (req, res, next) => {
  const schema = Joi.object({
    contract_no: Joi.string().required()
  })

  let result = schema.validate(req.body);

  if (result.error) {
    res.status(400).json(resp.createResponse(resp.createError(result.error, 400, true), false));
  } else {
    UserModel.getContractDetails(req.body.contract_no).then(function (result) {
      if (result.length) {


        let contract=result[0];
        UserModel.getContractTests(req.body.contract_no).then(function (r) {
          contract.tests=r;
          res.status(200).json(resp.createResponse(contract));
       
        }).catch(function (error) {
          res.status(500).json(resp.createError(error, 500));
        });
       


      } else {
        res.status(200).json(resp.createResponse({}));
      }
    }).catch(function (error) {
      res.status(500).json(resp.createError(error, 500));
    });
  }
}
