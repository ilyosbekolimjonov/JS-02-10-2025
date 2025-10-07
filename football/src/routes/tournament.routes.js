import express from "express"
import {
    createTournament,
    getTournaments,
    updateTournament,
    deleteTournament
} from "../controllers/tournament.controller.js"

const router = express.Router()

router.post("/", createTournament)
router.get("/", getTournaments)
router.put("/:id", updateTournament)
router.delete("/:id", deleteTournament)

export default router