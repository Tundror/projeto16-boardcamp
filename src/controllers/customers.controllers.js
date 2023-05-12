import { db } from "../database/database.connection.js";

export async function getCustomers(req, res) {
    try {
        const customers = await db.query(`SELECT * FROM customers;`)
        const formattedCustomers = customers.rows.map(customer => {
            const formattedBirthday = customer.birthday.toISOString().substring(0, 10);
            return { ...customer, birthday: formattedBirthday };
        });
        console.table(formattedCustomers)
        res.send(formattedCustomers)
    }
    catch (err) {
        res.status(500).send(err.message)
    }
}

export async function insertCustomer(req, res) {
    const { name, phone, cpf, birthday } = req.body

    try {
        const checkCpf = await db.query(`SELECT * FROM customers WHERE cpf=$1`, [cpf])
        if (checkCpf.rows.length !== 0) return res.sendStatus(409)
        await db.query(`insert INTO customers (name, phone, cpf, birthday) 
        VALUES ($1, $2, $3, $4)`,
            [name, phone, cpf, birthday])

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}