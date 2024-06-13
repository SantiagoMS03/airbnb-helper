const { stringify } = require("csv-stringify");

const getBookingsFile = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM Booking");
    client.release();

    const csvStream = stringify({ header: true });
    res.setHeader("Content-disposition", "attachment; filename=bookings.csv");
    res.set("Content-Type", "text/csv");

    csvStream.pipe(res);
    result.rows.forEach((row) => {
      csvStream.write(row);
    });
    csvStream.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching bookings");
  }
};

module.exports = getBookingsFile;
