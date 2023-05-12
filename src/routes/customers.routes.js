import { Router } from "express";
import { getCustomers } from "../controllers/customers.controllers.js";

const customerRouter = Router()

customerRouter.get("/customers", getCustomers)

export default customerRouter