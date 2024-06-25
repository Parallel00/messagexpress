const jsontok = require("jsonwebtoken");
const Router = require("express").Router;
const rtr = new Router();

const usr = require("../models/user");
const {CONF_KY} = require("../config");
const expError = require("../expressError");

rtr.post("/login", async function (req, res, next) {
  try {
    let {username, password} = req.body;
    if (await usr.authenticate(username, password)) {
      let token = jsontok.sign({username}, CONF_KY);
      usr.updateLoginTimestamp(username);
      return res.json({token});
    } else {
      throw new expError("Invalid username/password", 400);
    }
  }

  catch (err) {
    return next(err);
  }
});

rtr.post("/register", async function (req, res, next) {
  try {
    let {username} = await usr.register(req.body);
    let token = jsontok.sign({username}, CONF_KY);
    usr.updateLoginTimestamp(username);
    return res.json({token});
  }

  catch (err) {
    return next(err);
  }
});



module.exports = rtr;