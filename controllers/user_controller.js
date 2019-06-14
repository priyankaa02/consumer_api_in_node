var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectID;
var User = require('../models/usermodel');
const bcrypt = require('bcrypt');
var db = require('../database_config/db_connect');
var moment = require('moment');
const jwt = require('jsonwebtoken');
let config = require('../config');


exports.register = function(req, res) {
  bcrypt.hash(req.body.password, 10, function(err, hash){
     if(err) {
        return res.status(500).json({
           error: err
        });
     }
     else {
        User.findOne({ email: req.body.email })
          .exec(function (error, user) {
            if (error) {
              return callback(error);
            } else if ( user ) {
              res.status(401).json({
                error: 'A user with that email has already registered. Please use a different email.'
              })
            } else {
              const user = new User({
                 full_name: req.body.full_name,
                 email: req.body.email,
                 dob:  req.body.dob,
                 password: hash,
                 provider: req.body.provider,
                 created_date : moment().format('YYYY-MM-DD HH:mm:ss Z')
              });
              user.save().then(function(result) {
                 console.log(result);
                 res.status(200).json({
                    success: 'New user has been created',
                    id: result._id
                 });
              }).catch(error => {
                 res.status(500).json({
                    error: err
                 });
              });
            }
          });
     }
  });
};

exports.sign_in = function(req, res) {
  User.findOneAndUpdate({email: req.body.email}, {$set:{last_login: moment().format('YYYY-MM-DD HH:mm:ss Z')}}, {new: true},)
   .exec()
   .then(function(user) {
      bcrypt.compare(req.body.password, user.password, function(err, result){
         if(err) {
            return res.status(401).json({
               failed: 'Unauthorized Access'
            });
         }
         if(result) {
           const JWTToken = jwt.sign({
      email: user.email,
      _id: user._id
    },
    config.secret,
     {
       expiresIn: '2h'
     });
     return res.status(200).json({
       success: 'Welcome to the App',
       token: JWTToken,
       full_name: user.full_name
     });
         }
         return res.status(401).json({
            failed: 'Unauthorized Access'
         });
      });
   })
   .catch(error => {
      res.status(500).json({
         error: error
      });
   });;
};

exports.loginRequired = function(req, res, next) {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};

exports.getById = function(req, res) {
  User.findById(req.params.userId).then((result) => {
      result = result.toJSON();
      delete result._id;
      delete result.__v;
      delete result.password;
      res.status(200).send(result);
  });
};

exports.logout = function(req, res) {
  req.session.destroy();
  res.send("logout success!");
};


exports.usersList = function(req, res) {
   new Promise((resolve, reject) => {
       User.find()
           .exec(function (err, users) {
               if (err) {
                   res.status(500).send(err);
               } else {
                   res.status(200).send(users);
               }
           })
   });
};
