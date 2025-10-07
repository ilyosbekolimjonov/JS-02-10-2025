import pkg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pkg

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

export const initTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tournaments (
                tournament_id SERIAL PRIMARY KEY,
                tournament_name VARCHAR(100) NOT NULL,
                start_date DATE NOT NULL,
                end_date DATE NOT NULL,
                status VARCHAR(20) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS tournament_groups (
                group_id SERIAL PRIMARY KEY,
                group_name VARCHAR(100) NOT NULL,
                tournament_id INTEGER REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
                created_at TIMESTAMP DEFAULT NOW()
            );

            CREATE TABLE IF NOT EXISTS football_clubs (
                club_id SERIAL PRIMARY KEY,
                club_name VARCHAR(100) NOT NULL,
                city VARCHAR(100) NOT NULL,
                country VARCHAR(100) NOT NULL,
                founded_year INTEGER
            );

            CREATE TABLE IF NOT EXISTS teams (
                team_id SERIAL PRIMARY KEY,
                team_name VARCHAR(100) NOT NULL,
                club_id INTEGER REFERENCES football_clubs(club_id) ON DELETE CASCADE,
                group_id INTEGER REFERENCES tournament_groups(group_id) ON DELETE CASCADE,
                coach_name VARCHAR(100)
            );

            CREATE TABLE IF NOT EXISTS players (
                player_id SERIAL PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                date_of_birth DATE NOT NULL,
                position VARCHAR(50) NOT NULL,
                team_id INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
                jersey_number INTEGER
            );

            CREATE TABLE IF NOT EXISTS match_fixtures (
                match_id SERIAL PRIMARY KEY,
                match_date TIMESTAMP NOT NULL,
                venue VARCHAR(100),
                home_team_id INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
                away_team_id INTEGER REFERENCES teams(team_id) ON DELETE CASCADE,
                home_score INTEGER,
                away_score INTEGER,
                tournament_id INTEGER REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
                match_status VARCHAR(20)
            );
        `)

        console.log("Barcha jadvallar muvaffaqiyatli yaratildi!")
    } catch (err) {
        console.error("Jadval yaratishda xatolik:", err.message)
    }
}

export default pool