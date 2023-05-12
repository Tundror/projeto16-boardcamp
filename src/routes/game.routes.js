import { Router } from "express";
import { getGames, insertGame } from "../controllers/game.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { gameSchema } from "../schemas/games.schemas.js";

const gameRouter = Router()

gameRouter.get("/games", getGames)
gameRouter.post("/games", validateSchema(gameSchema), insertGame)

export default gameRouter