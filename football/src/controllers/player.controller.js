import pool from "../db.js"

// CREATE
export const createPlayer = async (req, res) => {
    try {
        const { full_name, date_of_birth, position, team_id, jersey_number } = req.body

        if (!full_name || !date_of_birth || !position || !team_id) {
            return res.status(400).json({ error: "full_name, date_of_birth, position va team_id majburiy maydonlar!" })
        }

        const result = await pool.query(
            `INSERT INTO players (full_name, date_of_birth, position, team_id, jersey_number)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [full_name, date_of_birth, position, team_id, jersey_number || null]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// READ (barcha o‘yinchilarni olish)
export const getPlayers = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, t.team_name, c.club_name
            FROM players p
            LEFT JOIN teams t ON p.team_id = t.team_id
            LEFT JOIN football_clubs c ON t.club_id = c.club_id
            ORDER BY p.player_id ASC
        `)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// UPDATE
export const updatePlayer = async (req, res) => {
    try {
        const id = req.params.id
        const { full_name, date_of_birth, position, team_id, jersey_number } = req.body

        const result = await pool.query(
            `UPDATE players
             SET full_name=$1, date_of_birth=$2, position=$3, team_id=$4, jersey_number=$5
             WHERE player_id=$6 RETURNING *`,
            [full_name, date_of_birth, position, team_id, jersey_number, id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Player not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE
export const deletePlayer = async (req, res) => {
    try {
        const id = req.params.id
        const result = await pool.query(`DELETE FROM players WHERE player_id=$1`, [id])

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Player not found" })
        }

        res.json({ message: "Player deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}