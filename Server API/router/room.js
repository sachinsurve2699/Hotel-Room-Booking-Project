const express = require("express")
const db = require("../db")
const router = express.Router()
const utils = require("../utils")
// const multer = require('multer')
// const upload = multer({ dest: 'uploads' })

//all room -tested
router.get("/getAllRooms", (request, response) => {
  console.log("inside getallrooms")
  const statement = `SELECT * FROM Room`
  db.query(statement, (error, result) => {
    response.send(utils.createResult(error, result))
  })
})


// GET room details by room number 
router.get("/:roomNumber", (request, response) => {
  console.log(" GET room details")
  console.log(request.params.roomNumber)
  const roomNumber = request.params.roomNumber;
  const statement = `SELECT * FROM Room WHERE room_number = ?`;

  db.query(statement, [roomNumber], (error, result) => {
    if (error) {
      response.status(500).json({ status: "error", error: "Failed to fetch room details" });
      console.log(error);
    } else {
      if (result.length === 0) {
        response.status(404).json({ status: "error", error: "Room not found" });
      } else {
        response.json({ status: "success", data: result[0] });
      }
    }
  });
});



// API endpoint to check room availability - TSETED
router.get("/availability/:checkInDate/:checkOutDate", (req, res) => {
  console.log(" GET room details")
  const { checkInDate, checkOutDate} = req.params;
  console.log(checkInDate, checkOutDate);
  const query = "SELECT * FROM Room WHERE room_number NOT IN (SELECT room_number FROM Reservation WHERE (check_in_date <= ? AND check_out_date >= ?) OR (check_in_date >= ? AND check_in_date <= ?) OR (check_out_date >= ? AND check_out_date <= ?))";

  db.query(query, [checkInDate, checkOutDate, checkInDate, checkInDate, checkOutDate, checkOutDate], (error, result) => {
    if (error) {
      res.status(500).json({ status: 'error', error: 'Failed to retrieve available rooms' });
    } else {
      console.log(result);
      res.json({ status: 'success', data: result });
    }
  });
});

//Get user bookings -TSETED

router.get("/user/:userId", (request, response) => {
  console.log("inside get use bookings")
  const userId = request.params.userId;

  const statement = `
    SELECT reservation_id AS bookingId, user_id AS userId, room_number AS roomId, check_in_date AS checkInDate, check_out_date AS checkOutDate
    FROM Reservation
    WHERE user_id = ?
  `;

  db.query(statement, [userId], (error, result) => {
    console.log(result);
    if (error) {
      response.status(500).json({ status: "error", error: "Failed to retrieve user bookings" });
    } else {
      response.json({ status: "success", data: result });
    }
  });
});


//add room - tested

router.post("/addroom", (request, response) => {
  console.log("inside post add room")
  console.log(request.body)

  const { room_number, room_type, capacity, price_per_night, images, ac_non_ac, bed_type, room_size } = request.body;

  const statement = `
  insert into Room(room_number,room_type ,capacity , price_per_night ,images , ac_non_ac , bed_type , room_size ) 
  values(?,?,?,?,?,?,?,?)
  `;

  db.query(statement, [room_number, room_type, capacity, price_per_night, images, ac_non_ac, bed_type, room_size], (error, result) => {
    if (error) {
      console.log(error)
      response.status(500).json({ status: "error", error: "Failed to insert into room" });
    }

    else {

      response.json({ status: "success", data: result });
    }
  });
});

//edit room - tested
router.put("/:roomId", (request, response) => {
  const roomId = request.params.roomId;
  const { room_number, room_type, capacity, price_per_night, images, ac_non_ac, bed_type, room_size } = request.body;

  const statement = `
    UPDATE Room
    SET room_number = ?, room_type = ?, capacity = ?, price_per_night = ?, images = ?, ac_non_ac = ?, bed_type = ?, room_size = ?
    WHERE room_number = ?
  `;

  db.query(statement, [room_number, room_type, capacity, price_per_night, images, ac_non_ac, bed_type, room_size, roomId], (error, result) => {
    if (error) {
      response.status(500).json({ status: "error", error: "Failed to update room" });
      console.log(error)
    } else {
      console.log(result)
      response.json({ status: "success", message: "Room updated successfully" });
    }
  });
});

//cancel reservation - tested
router.delete("/:reservationId", (req, res) => {

  console.log("cancel reservation")
  const reservationId = req.params.reservationId;
  console.log(reservationId)

  const statement = "DELETE FROM Reservation WHERE reservation_id = ?";
  db.query(statement, [reservationId], (error, result) => {
    if (error) {
      res.status(500).json({ status: "error", error: "Failed to delete the room" });
      console.log(error)
    } else {
      console.log(result)
      if (result.affectedRows > 0) {
        res.json({ status: "success", message: "Room deleted successfully", result });
      }
      else {
        res.status(500).json({ status: "error", error: "Failed to delete the room" });
      }

    }
  });
});

module.exports = router