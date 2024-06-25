const Router = require("express").Router;
const acct = require("../models/user");
const {loginCheck, usrCheck} = require("../middleware/auth");

const rtr = new Router();

rtr.get("/", loginCheck, async function (req, res, next) {
  try {
    let users = await acct.all();
    return res.json({users});
  }

  catch (err) {
    return next(err);
  }
});


rtr.get("/:username", usrCheck, async function (req, res, next) {
  try {
    let user = await acct.get(req.params.username);
    return res.json({user});
  }

  catch (err) {
    return next(err);
  }
});


rtr.get("/:username/to", usrCheck, async function (req, res, next) {
  try {
    let msgs = await acct.msgsTo(req.params.username);
    return res.json({msgs});
  }

  catch (err) {
    return next(err);
  }
});

rtr.get("/:username/from", usrCheck, async function (req, res, next) {
  try {
    let msgs = await acct.msgsFrom(req.params.username);
    return res.json({msgs});
  }

  catch (err) {
    return next(err);
  }
});



module.exports = rtr;