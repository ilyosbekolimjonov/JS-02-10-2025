import pool from "../db.js"

// CREATE
export const createMatch = async (req, res) => {
    try {
        const {
            match_date,
            venue,
            home_team_id,
            away_team_id,
            home_score,
            away_score,
            tournament_id,
            match_status
        } = req.body

        // Majburiy maydonlar
        if (!match_date || !home_team_id || !away_team_id || !tournament_id) {
            return res.status(400).json({
                error: "match_date, home_team_id, away_team_id va tournament_id majburiy maydonlar!"
            })
        }

        // Uy va mehmon jamoasi bir xil bo‘lishi mumkin emas
        if (home_team_id === away_team_id) {
            return res.status(400).json({ error: "Uy va mehmon jamoasi bir xil bo‘lishi mumkin emas!" })
        }

        const result = await pool.query(
            `INSERT INTO match_fixtures 
            (match_date, venue, home_team_id, away_team_id, home_score, away_score, tournament_id, match_status)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [
                match_date,
                venue || null,
                home_team_id,
                away_team_id,
                home_score || 0,
                away_score || 0,
                tournament_id,
                match_status || 'scheduled'
            ]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// READ (barcha o‘yinlar)
export const getMatches = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                m.match_id,
                m.match_date,
                m.venue,
                ht.team_name AS home_team,
                at.team_name AS away_team,
                m.home_score,
                m.away_score,
                t.tournament_name,
                m.match_status
            FROM match_fixtures m
            LEFT JOIN teams ht ON m.home_team_id = ht.team_id
            LEFT JOIN teams at ON m.away_team_id = at.team_id
            LEFT JOIN tournaments t ON m.tournament_id = t.tournament_id
            ORDER BY m.match_date ASC
        `)
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// UPDATE
export const updateMatch = async (req, res) => {
    try {
        const id = req.params.id
        const {
            match_date,
            venue,
            home_team_id,
            away_team_id,
            home_score,
            away_score,
            tournament_id,
            match_status
        } = req.body

        const result = await pool.query(
            `UPDATE match_fixtures
             SET match_date=$1, venue=$2, home_team_id=$3, away_team_id=$4,
                 home_score=$5, away_score=$6, tournament_id=$7, match_status=$8
             WHERE match_id=$9
             RETURNING *`,
            [
                match_date,
                venue,
                home_team_id,
                away_team_id,
                home_score,
                away_score,
                tournament_id,
                match_status,
                id
            ]
        )

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Match not found" })
        }

        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// DELETE
export const deleteMatch = async (req, res) => {
    try {
        const id = req.params.id

        const result = await pool.query(`DELETE FROM match_fixtures WHERE match_id=$1`, [id])

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Match not found" })
        }

        res.json({ message: "Match deleted successfully" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}