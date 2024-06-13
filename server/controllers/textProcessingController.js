// controllers/textProcessingController.js

const {
  parseTextContent,
  generateInsertQuery,
} = require("../services/textProcessingService");
const pool = require("../db"); // Assuming you are using a connection pool from pg

async function updateBookings(req, res) {
  try {
    const text = req.body.body; //yay!
    const chunks = text.split("Skip to content\n");
    const alt = [];
    // const parsedData = await parseTextContent(text);
    for (let i = 0; i < chunks.length; i++) {
      await parseTextContent(chunks[i], alt);
    }

    const parsedData = alt;

    // Create temporary table
    await pool.query(`
      DROP TABLE IF EXISTS temp_bookings;
      CREATE TABLE IF NOT EXISTS temp_bookings (
        booking_id SERIAL PRIMARY KEY,
        property_id INT NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        guest_number INT NOT NULL,
        confirmation_code VARCHAR(48) NOT NULL UNIQUE,
        turn_off_pool BOOLEAN DEFAULT FALSE,
        clean_grill BOOLEAN DEFAULT FALSE,
        clean_pet_fur BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (property_id) REFERENCES Property(property_id)
    );
    `);

    // Insert parsed data into temporary table
    console.log(parsedData);
    const tempQuery = generateInsertQuery(parsedData);

    console.log("yay!");
    await pool.query(tempQuery);
    console.log("nay");

    const newInfo = await pool.query(`
      INSERT INTO Booking (confirmation_code, start_date, end_date, guest_number, property_id)
      SELECT confirmation_code, start_date, end_date, guest_number, property_id FROM temp_bookings
      ON CONFLICT (confirmation_code) 
      DO UPDATE SET 
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          guest_number = EXCLUDED.guest_number
      RETURNING *;
    `);
    // Delete bookings not in the new data
    const deleted = await pool.query(`
      DELETE FROM Booking
      WHERE confirmation_code NOT IN (SELECT confirmation_code FROM temp_bookings);
    `);

    // Drop the temporary table
    await pool.query("DROP TABLE temp_bookings;");

    res.status(200).json({ message: "Bookings updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  updateBookings,
};
