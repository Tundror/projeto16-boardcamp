import Joi from "joi";

export const rentalsSchema = Joi.object({
    customerId: Joi.number().required(),
    gameId: Joi.number().required(),
    daysRented: Joi.number().required().positive(),
})