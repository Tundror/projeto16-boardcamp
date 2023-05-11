import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(router)


//process.env.PORT
app.listen(process.env.PORT, () => console.log(`servidor rodando na porta ${process.env.PORT}`))