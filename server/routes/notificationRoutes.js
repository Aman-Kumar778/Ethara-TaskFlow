const express = require("express");
const router = express.Router();
const {
  getNotifications,
  markAllRead,
  markOneRead,
} = require("../controllers/notificationController");
const authenticate = require("../middleware/authenticate");

router.use(authenticate);

router.get("/", getNotifications);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", markOneRead);

module.exports = router;
