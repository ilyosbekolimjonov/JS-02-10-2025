import pool from "../db.js"

// CREATE
export const createGroup = async (req, res) => {
    try {
        const { group_name, tournament_id, created_at } = req.body

        const result = await pool.query(
            `INSERT INTO tournament_groups (group_name, tournament_id, created_at)
             VALUES ($1, $2, $3) RETURNING *`,
            [group_name, tournament_id, created_at]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// READ
export const getGroups = async (req, res) => {
    try {
        const result = await pool.query(`SELECT * FROM tournament_groups ORDER BY group_id ASC`)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// UPDATE
export const updateGroup = async (req, res) => {
    try {
        const id = req.params.id
        const { group_name, tournament_id, created_at } = req.body

        const result = await pool.query(
            `UPDATE tournament_groups 
             SET group_name=$1, tournament_id=$2, created_at=$3 
             WHERE group_id=$4 RETURNING *`,
            [group_name, tournament_id, created_at, id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Group not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE
export const deleteGroup = async (req, res) => {
    try {
        const id = req.params.id

        const result = await pool.query(
            `DELETE FROM tournament_groups WHERE group_id=$1`,
            [id]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Group not found" })
        }

        res.json({ message: "Group deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}