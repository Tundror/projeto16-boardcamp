import { Router } from "express";
import { getCustomers, getCustomersById, insertCustomer } from "../controllers/customers.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { customerSchema } from "../schemas/customers.schemas.js";

const customerRouter = Router()

customerRouter.get("/customers", getCustomers)
customerRouter.get("/customers/:id", getCustomersById)
customerRouter.post("/customers", validateSchema(customerSchema), insertCustomer)


export default customerRouter