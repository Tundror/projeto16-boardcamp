import { Router } from "express";
import { getRentals, insertRental } from "../controllers/rentals.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { rentalsSchema } from "../schemas/rentals.schemas.js";


const rentalsRouter = Router()

rentalsRouter.get("/rentals", getRentals)
rentalsRouter.post("/rentals", validateSchema(rentalsSchema), insertRental)

export default rentalsRouter