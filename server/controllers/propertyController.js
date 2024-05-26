const pool = require('../db');

const getAllProperties = async (req, res) => {
    try {
        const properties = await pool.query('SELECT * FROM Property');
        res.json(properties.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;
        const property = await pool.query('SELECT * FROM Property WHERE property_id = $1', [id]);
        if (property.rows.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(property.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const createProperty = async (req, res) => {
    try {
        const { address, cleaning_company_id } = req.body;
        const newProperty = await pool.query(
            'INSERT INTO Property (address, cleaning_company_id) VALUES ($1, $2) RETURNING *',
            [address, cleaning_company_id]
        );
        res.json(newProperty.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const updateProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const { address, cleaning_company_id } = req.body;
        const updateProperty = await pool.query(
            'UPDATE Property SET address = $1, cleaning_company_id = $2, updated_at = CURRENT_TIMESTAMP WHERE property_id = $3 RETURNING *',
            [address, cleaning_company_id, id]
        );
        if (updateProperty.rows.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json(updateProperty.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteProperty = await pool.query('DELETE FROM Property WHERE property_id = $1 RETURNING *', [id]);
        if (deleteProperty.rows.length === 0) {
            return res.status(404).json({ message: 'Property not found' });
        }
        res.json({ message: 'Property deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getBookingsForProperty = async (req, res) => {
    try {
        const { id } = req.params;
        const bookings = await pool.query('SELECT * FROM Booking WHERE property_id = $1', [id]);
        res.json(bookings.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getAllProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getBookingsForProperty
};
