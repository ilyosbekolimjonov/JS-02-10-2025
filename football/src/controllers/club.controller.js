import pool from "../db.js"

// CREATE
export const createClub = async (req, res) => {
    try {
        const { club_name, city, country, founded_year } = req.body

        if (!club_name || !city || !country) {
            return res.status(400).json({ error: "club_name, city va country majburiy!" })
        }

        const result = await pool.query(
            `INSERT INTO football_clubs (club_name, city, country, founded_year)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [club_name, city, country, founded_year || null]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// READ
export const getClubs = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT * FROM football_clubs
            ORDER BY club_id ASC
        `)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// UPDATE
export const updateClub = async (req, res) => {
    try {
        const id = req.params.id
        const { club_name, city, country, founded_year } = req.body

        const result = await pool.query(
            `UPDATE football_clubs
             SET club_name=$1, city=$2, country=$3, founded_year=$4
             WHERE club_id=$5 RETURNING *`,
            [club_name, city, country, founded_year, id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Club not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE
export const deleteClub = async (req, res) => {
    try {
        const id = req.params.id

        const result = await pool.query(
            `DELETE FROM football_clubs WHERE club_id=$1`,
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Club not found" })
        }

        res.json({ message: "Club deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}