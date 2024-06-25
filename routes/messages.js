const Router = require("express").Router;
const messages = require("../models/messages");
const { loginCheck, usrCheck } = require("../middleware/auth");

const rtr = new Router();

rtr.get("/:id", loginCheck, async function (req, res, next) {
  try {
    const message = await messages.get(req.params.id);
    const user = req.user; // Assuming req.user contains the currently logged-in user
    if (message.from_user.username === user.username || message.to_user.username === user.username) {
      return res.json({ message });
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
  } catch (err) {
    return next(err);
  }
});

rtr.post("/", loginCheck, async function (req, res, next) {
  try {
    const { to_username, body } = req.body;
    const from_username = req.user.username;
    const message = await messages.create({ from_username, to_username, body });
    return res.json({ message });
  } catch (err) {
    return next(err);
  }
});

rtr.post("/:id/read", loginCheck, async function (req, res, next) {
  try {
    const message = await messages.get(req.params.id);
    const user = req.user;
    if (message.to_user.username === user.username) {
      const updatedMessage = await messages.markAsRead(req.params.id);
      return res.json({ message: updatedMessage });
    } else {
      return res.status(403).json({ error: "Unauthorized" });
    }
  } catch (err) {
    return next(err);
  }
});

module.exports = rtr;

