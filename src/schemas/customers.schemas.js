import Joi from "joi";

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required().min(10).max(11).pattern(/^[0-9]+$/),
    cpf: Joi.string().required().min(11).max(11).pattern(/^[0-9]+$/),
    birthday: Joi.date().iso().required()
})