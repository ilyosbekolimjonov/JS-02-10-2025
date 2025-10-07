import express from "express"
import {
    createGroup,
    getGroups,
    updateGroup,
    deleteGroup
} from "../controllers/group.controller.js"

const router = express.Router()

router.post("/", createGroup)
router.get("/", getGroups)
router.put("/:id", updateGroup)
router.delete("/:id", deleteGroup)

export default router