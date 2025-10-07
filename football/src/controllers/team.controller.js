import pool from "../db.js"

// CREATE
export const createTeam = async (req, res) => {
    try {
        const { team_name, club_id, group_id, coach_name } = req.body

        // Majburiy maydonlarni tekshirish
        if (!team_name || !club_id) {
            return res.status(400).json({ error: "team_name va club_id majburiy maydonlar!" })
        }

        const result = await pool.query(
            `INSERT INTO teams (team_name, club_id, group_id, coach_name)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [team_name, club_id, group_id || null, coach_name || null]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// READ
export const getTeams = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT t.*, c.club_name, g.group_name
            FROM teams t
            LEFT JOIN football_clubs c ON t.club_id = c.club_id
            LEFT JOIN tournament_groups g ON t.group_id = g.group_id
            ORDER BY t.team_id ASC
        `)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// UPDATE
export const updateTeam = async (req, res) => {
    try {
        const id = req.params.id
        const { team_name, club_id, group_id, coach_name } = req.body

        const result = await pool.query(
            `UPDATE teams
             SET team_name=$1, club_id=$2, group_id=$3, coach_name=$4
             WHERE team_id=$5 RETURNING *`,
            [team_name, club_id, group_id, coach_name, id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Team not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE
export const deleteTeam = async (req, res) => {
    try {
        const id = req.params.id

        const result = await pool.query(
            `DELETE FROM teams WHERE team_id=$1`,
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Team not found" })
        }

        res.json({ message: "Team deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}