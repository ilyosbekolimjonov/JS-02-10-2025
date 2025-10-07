import express from "express"
import dotenv from "dotenv"
import { initTables } from "./src/db.js"
import usersRouter from "./src/routes/users.routes.js"
import postsRouter from "./src/routes/posts.routes.js"
import commentsRouter from "./src/routes/comments.routes.js"

dotenv.config()

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Blog API working.. ")
})

app.use("/users", usersRouter)
app.use("/posts", postsRouter)
app.use("/comments", commentsRouter)

const PORT = process.env.PORT || 3000

app.listen(PORT, async () => {
  console.log(`Server ${PORT}-portda ishlamoqda`)
  await initTables()
})