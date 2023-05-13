import express from "express"
import cors from "cors"
import router from "./routes/index.routes.js"
import dotenv from "dotenv"

const app = express()
dotenv.config()

app.use(cors())
app.use(express.json())
app.use(router)


const port = process.env.PORT || 5000
app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`)
})