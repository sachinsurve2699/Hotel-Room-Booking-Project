const express = require("express")
const db = require("../db")
const utils = require("../utils")

const router = express.Router()

//see all Booking -TSETED

router.get("/bookings", (req, res) => {
    const query = "SELECT * FROM Reservation";
    db.query(query, (error, result) => {
      if (error) 
      {
        console.log(error);

        res.status(500).json({ status: "error", error: "Failed to retrieve reservations" });
      } else {
        res.json({ status: "success", data: result });
      }
    });
  });


//Book a hotel room -TSETED
router.post("/book_Reservation", (request, response) => {
  console.log(" book room ")
  const { userId, roomId, checkInDate, checkOutDate } = request.body;

  const statement = `
    INSERT INTO Reservation (user_id, room_number, check_in_date, check_out_date)
    VALUES (?, ?, ?, ?)
  `;

  db.query(statement, [userId, roomId, checkInDate, checkOutDate], (error, result) => {
    if (error) {
      console.log(error);

      response.status(500).json({ status: "error", error: "Failed to book the room" });
    } 
    else 
    {

      const bookingId = result.insertId;
      const bookingData = { bookingId, userId, roomId, checkInDate, checkOutDate };
      response.json({ status: "success", data: bookingData });
      console.log(bookingData);

    }
  });
});




module.exports = router