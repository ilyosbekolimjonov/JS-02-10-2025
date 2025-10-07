import pool from "../db.js"


export const getComments = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT comments.*, users.first_name, users.last_name, posts.title AS post_title
            FROM comments
            JOIN users ON users.id = comments.user_id
            JOIN posts ON posts.id = comments.post_id
            ORDER BY comments.id DESC
        `)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


export const getCommentById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(
            `SELECT comments.*, users.first_name, users.last_name, posts.title AS post_title
            FROM comments
            JOIN users ON users.id = comments.user_id
            JOIN posts ON posts.id = comments.post_id
            WHERE comments.id = $1`,
            [id]
        )
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Comment topilmadi" })
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


export const createComment = async (req, res) => {
    const { content, post_id, user_id } = req.body
    try {
        const result = await pool.query(
            `INSERT INTO comments (content, post_id, user_id)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [content, post_id, user_id]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


export const updateComment = async (req, res) => {
    try {
        const { id } = req.params
        const fields = req.body

        if (Object.keys(fields).length === 0) {
            return res.status(400).json({ message: "Hech qanday o'zgarish yuborilmadi" })
        }

        const setClauses = []
        const values = []
        let index = 1

        for (const [key, value] of Object.entries(fields)) {
            setClauses.push(`${key} = $${index}`)
            values.push(value)
            index++
        }

        values.push(id)
        const query = `
            UPDATE comments
            SET ${setClauses.join(", ")}
            WHERE id = $${index}
            RETURNING *`;

        const result = await pool.query(query, values)

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Comment not found" })

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


export const deleteComment = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query("DELETE FROM comments WHERE id=$1 RETURNING *", [id])
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Comment topilmadi" })
        res.json({ message: "Comment o'chirildi" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}