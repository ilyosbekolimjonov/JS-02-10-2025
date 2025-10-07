import pkg from "pg"
import dotenv from "dotenv"
dotenv.config()

const { Pool } = pkg

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
})


export const initTables = async () => {
    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            first_name VARCHAR,
            last_name VARCHAR,
            email VARCHAR UNIQUE,
            password VARCHAR,
            phone_number VARCHAR,
            address VARCHAR
            )`)


        await pool.query(`
            CREATE TABLE IF NOT EXISTS posts (
            id SERIAL PRIMARY KEY,
            title VARCHAR,
            content TEXT,
            slug VARCHAR UNIQUE,
            user_id INTEGER REFERENCES users(id)
            )`)


        await pool.query(`
            CREATE TABLE IF NOT EXISTS comments (
            id SERIAL PRIMARY KEY,
            content TEXT,
            post_id INTEGER REFERENCES posts(id),
            user_id INTEGER REFERENCES users(id),
            created_at TIMESTAMP DEFAULT NOW()
            )`)

        console.log("Jadvallar tayyor!")
    } catch (err) {
        console.error("Jadval yaratishda xatolik:", err.message)
    }
}

export default pool