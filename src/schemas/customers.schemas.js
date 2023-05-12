import Joi from "joi";

export const customerSchema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    cpf: Joi.string().required(),
    birthday: Joi.string().required()
})