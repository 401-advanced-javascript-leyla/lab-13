'use strict';

const express = require('express');
const authRouter = express.Router();

const User = require('./users-model.js');
const auth = require('./middleware.js');
const oauth = require('./oauth/google.js');

/**
 *This creates a new user and save it to database and append token, user to req
 *
 * @route POST /signup
 * @param username the username
 * @param password the password
 *
 */

authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
    }).catch(next);
});

/**
 *This allows user with valid information to signin and response send out req.token
 *
 * @route POST /signin
 * @param req
 * @param res
 * @param next
 *
 */

authRouter.post('/signin', auth, (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});

/**
 *This creates a token by oauth and send token back
 *
 * @route GET /oauth
 * @param req
 * @param res
 * @param next
 *
 */

authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});

/**
 *This creates a key and append it to req, then send req.key
 *
 * @route POST /key
 * @param req
 * @param res
 * @param next
 *
 */

authRouter.post('/key', auth, (req,res,next)=>{
  res.cookie('auth', req.key);
  res.send(req.key);
});

module.exports = authRouter;
