import pool from "../db.js"

// CREATE
export const createTournament = async (req, res) => {
    try {
        const { tournament_name, start_date, end_date, status } = req.body

        const result = await pool.query(
            `INSERT INTO tournaments (tournament_name, start_date, end_date, status)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [tournament_name, start_date, end_date, status]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// READ
export const getTournaments = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM tournaments ORDER BY tournament_id ASC`)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// UPDATE
export const updateTournament = async (req, res) => {
    try {
        const id = req.params.id
        const { tournament_name, start_date, end_date, status } = req.body

        const result = await pool.query(
            `UPDATE tournaments 
             SET tournament_name=$1, start_date=$2, end_date=$3, status=$4 
             WHERE tournament_id=$5 RETURNING *`,
            [tournament_name, start_date, end_date, status, id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Tournament not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE
export const deleteTournament = async (req, res) => {
    try {
        const id = req.params.id
        const result = await pool.query(`DELETE FROM tournaments WHERE tournament_id=$1`, [id])

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Tournament not found" })
        }

        res.json({ message: "Tournament deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}