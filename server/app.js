require('dotenv').config();
  
const express = require('express');
const app = express();
const cors = require('cors');
const bookingRouter = require('./routes/bookingRouter');
const cleaningCompanyRouter = require('./routes/cleaningCompanyRouter');
const propertyRouter = require('./routes/propertyRouter');
const textProcessingRouter = require('./routes/textProcessingRouter');
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Define routes
app.use('/bookings', bookingRouter);
app.use('/cleaning-companies', cleaningCompanyRouter);
app.use('/properties', propertyRouter);
app.use('/services', textProcessingRouter);

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Airbnb App API');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
