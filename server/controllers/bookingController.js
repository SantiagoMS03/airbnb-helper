const pool = require('../db');

const getAllBookings = async (req, res) => {
    try {
        const bookings = await pool.query('SELECT * FROM Booking');
        res.json(bookings.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await pool.query('SELECT * FROM Booking WHERE booking_id = $1', [id]);
        if (booking.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const createBooking = async (req, res) => {
    try {
        const { property_id, start_date, end_date, guest_number, turn_off_pool, clean_grill, clean_pet_fur } = req.body;
        const newBooking = await pool.query(
            'INSERT INTO Booking (property_id, start_date, end_date, guest_number, turn_off_pool, clean_grill, clean_pet_fur) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [property_id, start_date, end_date, guest_number, turn_off_pool, clean_grill, clean_pet_fur]
        );
        res.json(newBooking.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const { property_id, start_date, end_date, guest_number, turn_off_pool, clean_grill, clean_pet_fur } = req.body;
        const updateBooking = await pool.query(
            'UPDATE Booking SET property_id = $1, start_date = $2, end_date = $3, guest_number = $4, turn_off_pool = $5, clean_grill = $6, clean_pet_fur = $7, updated_at = CURRENT_TIMESTAMP WHERE booking_id = $8 RETURNING *',
            [property_id, start_date, end_date, guest_number, turn_off_pool, clean_grill, clean_pet_fur, id]
        );
        if (updateBooking.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(updateBooking.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteBooking = await pool.query('DELETE FROM Booking WHERE booking_id = $1 RETURNING *', [id]);
        if (deleteBooking.rows.length === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Booking deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getAllBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking
};
