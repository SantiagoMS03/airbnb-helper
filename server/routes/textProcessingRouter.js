// routes/textProcessingRoutes.js
const express = require('express');
const router = express.Router();
const { updateBookings } = require('../controllers/textProcessingController');

router.post('/update-bookings', updateBookings);

module.exports = router;
