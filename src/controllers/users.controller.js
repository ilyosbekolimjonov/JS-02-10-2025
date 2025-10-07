import pool from "../db.js"


export const getUsers = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users")
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


export const getUserById = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query("SELECT * FROM users WHERE id = $1", [id])
        if (result.rows.length === 0)
            return res.status(404).json({ message: "User topilmadi" })
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


export const createUser = async (req, res) => {
    const { first_name, last_name, email, password, phone_number, address } =
        req.body

    try {
        const result = await pool.query(
            `INSERT INTO users (first_name, last_name, email, password, phone_number, address)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [first_name, last_name, email, password, phone_number, address]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}


export const updateUser = async (req, res) => {
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
        UPDATE users
        SET ${setClauses.join(", ")}
        WHERE id = $${index}
        RETURNING *
        `

        const result = await pool.query(query, values)

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


export const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING *", [id])
        if (result.rows.length === 0)
            return res.status(404).json({ message: "User topilmadi" })

        res.json({ message: "User o'chirildi" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}