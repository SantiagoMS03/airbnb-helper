// controllers/textProcessingController.js
const { parseTextContent, generateInsertQuery } = require('../services/textProcessingService');
const { pool } = require('../db'); // Assuming you are using a connection pool from pg

async function updateBookings(req, res) {
  try {
    const text = req.body.text;
    const parsedData = parseTextContent(text);

    // Create temporary table
    await pool.query(`
      CREATE TEMP TABLE temp_bookings (
        start_date DATE,
        end_date DATE,
        guest_number INTEGER,
        booking_number VARCHAR(50),
        confirmation_code VARCHAR(50)
      );
    `);

    // Insert parsed data into temporary table
    const insertQuery = generateInsertQuery(parsedData);
    await pool.query(insertQuery);

    // Delete bookings not in the new data
    await pool.query(`
      DELETE FROM bookings
      WHERE booking_number NOT IN (SELECT booking_number FROM temp_bookings);
    `);

    // Update bookings with different values
    await pool.query(`
      UPDATE bookings
      SET
        start_date = temp_bookings.start_date,
        end_date = temp_bookings.end_date,
        guest_number = temp_bookings.guest_number,
        confirmation_code = temp_bookings.confirmation_code
      FROM temp_bookings
      WHERE bookings.booking_number = temp_bookings.booking_number
      AND (
        bookings.start_date <> temp_bookings.start_date OR
        bookings.end_date <> temp_bookings.end_date OR
        bookings.guest_number <> temp_bookings.guest_number OR
        bookings.confirmation_code <> temp_bookings.confirmation_code
      );
    `);

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
