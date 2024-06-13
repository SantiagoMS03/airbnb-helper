const express = require("express");
const router = express.Router();
const downloadController = require("../controllers/downloadController");

router.get("/", downloadController.getBookingsFile);

module.exports = router;
