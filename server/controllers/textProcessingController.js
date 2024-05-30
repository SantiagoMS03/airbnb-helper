// controllers/textProcessingController.js

const { parseTextContent, generateInsertQuery } = require('../services/textProcessingService');
const pool = require('../db'); // Assuming you are using a connection pool from pg

async function updateBookings(req, res) {
  console.log("received!")
  try {
    const text = req.body.body; //yay!
    const parsedData = await parseTextContent(text);
    // Create temporary table
    await pool.query(`
      CREATE TEMP TABLE temp_bookings (
        start_date DATE,
        end_date DATE,
        guest_number INTEGER,
        property_id INTEGER,
        confirmation_code VARCHAR(50)
      );
    `);

    // Insert parsed data into temporary table
    console.log("here!")
    const insertQuery = generateInsertQuery(parsedData);
    console.log(insertQuery)
    await pool.query(insertQuery);
    console.log("a")
    // Delete bookings not in the new data
    await pool.query(`
      DELETE FROM Booking
      WHERE confirmation_code NOT IN (SELECT confirmation_code FROM temp_bookings);
    `);
    console.log("b")

    // Update Booking with different values
    await pool.query(`
      UPDATE Booking
      SET
        start_date = temp_bookings.start_date,
        end_date = temp_bookings.end_date,
        guest_number = temp_bookings.guest_number
      FROM temp_bookings
      WHERE Booking.confirmation_code = temp_bookings.confirmation_code
      AND (
        Booking.start_date <> temp_bookings.start_date OR
        Booking.end_date <> temp_bookings.end_date OR
        Booking.guest_number <> temp_bookings.guest_number
      );
    `);
    console.log("c")

    // Drop the temporary table
    await pool.query('DROP TABLE temp_bookings;');

    res.status(200).json({ message: 'Bookings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  updateBookings
};
