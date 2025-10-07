import express from "express"
import dotenv from "dotenv"
import { initTables } from "./src/db.js"

import tournamentRoutes from "./src/routes/tournament.routes.js"
import groupRoutes from "./src/routes/group.routes.js"
import clubRoutes from "./src/routes/club.routes.js"
import teamRoutes from "./src/routes/team.routes.js"
import playerRoutes from "./src/routes/player.routes.js"
import matchRoutes from "./src/routes/match.routes.js"

dotenv.config()

const app = express()
app.use(express.json())

app.use("/tournaments", tournamentRoutes)
app.use("/groups", groupRoutes)
app.use("/clubs", clubRoutes)
app.use("/teams", teamRoutes)
app.use("/players", playerRoutes)
app.use("/matches", matchRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
    await initTables()
    console.log(`Server running on port ${PORT}`)
})