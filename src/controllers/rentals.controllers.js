import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
    try {
        const rentals = await db.query(`
        SELECT rentals.*,
          customers.id AS "customerId", customers.name AS "customerName",
          games.id AS "gameId", games.name AS "gameName"
        FROM rentals
        JOIN customers ON rentals."customerId" = customers.id
        JOIN games ON rentals."gameId" = games.id
      `);

        const formattedRentals = rentals.rows.map(rental => ({
            id: rental.id,
            customerId: rental.customerId,
            gameId: rental.gameId,
            rentDate: rental.rentDate.toISOString().substring(0, 10),
            daysRented: rental.daysRented,
            returnDate: rental.returnDate ? rental.returnDate.toISOString().substring(0, 10) : null,
            originalPrice: rental.originalPrice,
            delayFee: rental.delayFee,
            customer: {
                id: rental.customerId,
                name: rental.customerName
            },
            game: {
                id: rental.gameId,
                name: rental.gameName
            }
        }));

        console.log(formattedRentals);
        res.send(formattedRentals);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function insertRental(req, res) {
    const { customerId, gameId, daysRented } = req.body
    const rentDate = new Date().toISOString().slice(0, 10)

    try {
        const checkCustomerId = await db.query(`SELECT * FROM customers WHERE id=$1`, [customerId])
        if (checkCustomerId.rows.length === 0) return res.sendStatus(400)

        const checkGame = await db.query(`SELECT * FROM games WHERE id=$1`, [gameId])
        if (checkGame.rows.length === 0) return res.sendStatus(400)
        const pricePerDay = checkGame.rows[0].pricePerDay
        const originalPrice = daysRented * pricePerDay

        const checkRentals = await db.query(`SELECT * FROM rentals WHERE "gameId"=$1 AND "returnDate" IS NULL`, [gameId])

        if (checkGame.rows[0].stockTotal <= checkRentals.rows.length) return res.sendStatus(400)
        console.log(checkGame.rows[0])
        console.log(checkRentals.rows)

        await db.query(`insert INTO rentals ("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee") 
        VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [customerId, gameId, rentDate, daysRented, null, originalPrice, null])

        res.sendStatus(201)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function returnRental(req, res) {
    const id = parseInt(req.params.id)
    const returnDate = new Date().toISOString().slice(0, 10)

    try {
        const checkRentals = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id])
        const rental = checkRentals.rows[0]
        if (!rental) return res.sendStatus(404)

        if (rental.returnDate !== null) return res.sendStatus(400)

        const rentDate = new Date(rental.rentDate)
        const daysRented = rental.daysRented
        const expectedReturnDate = new Date(rentDate.getTime() + daysRented * 24 * 60 * 60 * 1000)
        const delayInDays = Math.round((new Date(returnDate) - expectedReturnDate) / (24 * 60 * 60 * 1000))

        const originalPrice = rental.originalPrice
        const delayFee = delayInDays > 0 ? delayInDays * (originalPrice / daysRented) : null

        await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`,
            [returnDate, delayFee, id])

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}

export async function deleteRental(req, res) {
    const id = parseInt(req.params.id)

    try{
        const checkRentals = await db.query(`SELECT * FROM rentals WHERE id=$1`, [id])

        if (checkRentals.rows.length === 0) return res.sendStatus(404)
        if (checkRentals.rows[0].returnDate === null) return res.sendStatus(400)

        await db.query(`DELETE FROM rentals WHERE id=$1`, [id])

        res.sendStatus(200)
    } catch (err) {
        res.status(500).send(err.message)
    }
}