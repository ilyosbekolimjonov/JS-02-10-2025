import pool from "../db.js"



export const getPosts = async (req, res) => {
    try {
        const result = await pool.query(`
      SELECT posts.*, users.first_name, users.last_name
      FROM posts
      JOIN users ON users.id = posts.user_id
      ORDER BY posts.id DESC
    `)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}



export const getPostById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query(
            `SELECT posts.*, users.first_name, users.last_name 
            FROM posts 
            JOIN users ON users.id = posts.user_id 
            WHERE posts.id = $1`,
            [id]
        )
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Post topilmadi" })
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}



export const createPost = async (req, res) => {
    const { title, content, slug, user_id } = req.body
    try {
        const result = await pool.query(
            `INSERT INTO posts (title, content, slug, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [title, content, slug, user_id]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}



export const updatePost = async (req, res) => {
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
        UPDATE posts
        SET ${setClauses.join(", ")}
        WHERE id = $${index}
        RETURNING *
        `

        const result = await pool.query(query, values)

        if (result.rows.length === 0)
            return res.status(404).json({ message: "Post not found" })

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}



export const deletePost = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query("DELETE FROM posts WHERE id=$1 RETURNING *", [id])
        if (result.rows.length === 0)
            return res.status(404).json({ message: "Post topilmadi" })
        res.json({ message: "Post o'chirildi" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}