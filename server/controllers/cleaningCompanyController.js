const pool = require('../db');

const getAllCleaningCompanies = async (req, res) => {
    try {
        const cleaningCompanies = await pool.query('SELECT * FROM CleaningCompany');
        res.json(cleaningCompanies.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getCleaningCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const cleaningCompany = await pool.query('SELECT * FROM CleaningCompany WHERE cleaning_company_id = $1', [id]);
        if (cleaningCompany.rows.length === 0) {
            return res.status(404).json({ message: 'Cleaning company not found' });
        }
        res.json(cleaningCompany.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const createCleaningCompany = async (req, res) => {
    try {
        const { company_name, password, email } = req.body;
        const newCleaningCompany = await pool.query(
            'INSERT INTO CleaningCompany (company_name, password, email) VALUES ($1, $2, $3) RETURNING *',
            [company_name, password, email]
        );
        res.json(newCleaningCompany.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const updateCleaningCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const { company_name, password, email } = req.body;
        const updateCleaningCompany = await pool.query(
            'UPDATE CleaningCompany SET company_name = $1, password = $2, email = $3, updated_at = CURRENT_TIMESTAMP WHERE cleaning_company_id = $4 RETURNING *',
            [company_name, password, email, id]
        );
        if (updateCleaningCompany.rows.length === 0) {
            return res.status(404).json({ message: 'Cleaning company not found' });
        }
        res.json(updateCleaningCompany.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const deleteCleaningCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteCleaningCompany = await pool.query('DELETE FROM CleaningCompany WHERE cleaning_company_id = $1 RETURNING *', [id]);
        if (deleteCleaningCompany.rows.length === 0) {
            return res.status(404).json({ message: 'Cleaning company not found' });
        }
        res.json({ message: 'Cleaning company deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

const getPropertiesForCleaningCompany = async (req, res) => {
    try {
        const { id } = req.params;
        const properties = await pool.query('SELECT * FROM Property WHERE cleaning_company_id = $1', [id]);
        res.json(properties.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getAllCleaningCompanies,
    getCleaningCompanyById,
    createCleaningCompany,
    updateCleaningCompany,
    deleteCleaningCompany,
    getPropertiesForCleaningCompany
};
