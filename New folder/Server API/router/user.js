const express = require("express")
const db = require("../db")
const utils = require("../utils")
// const atob = require('atob');


const router = express.Router()


router.post("/register", (request, response) => {
  // const { credentials } = request.body;
  const role = "user"; // Assuming a default role of "user"
  // const decodedCredentials = JSON.parse(Buffer.from(credentials, 'base64').toString('utf-8'));
  const { firstname, lastname, email, phonenumber, password } = request.body;
  console.log("First Name:", firstname,lastname, email, phonenumber, password );
  db.query(
    "INSERT INTO User (firstName, lastname, Role, email, phoneNumber, password) VALUES (?, ?, ?, ?, ?, ?)",
    [firstname, lastname, role, email, phonenumber, password],
    (error, result) => {
      response.send(utils.createResult(error, result));
    }
  );
});

router.post("/login", (request, response) => {
  console.log("inside login")
  const { email, password } = request.body
  console.log(email);
  console.log(password);
  const statement = "SELECT * FROM User WHERE email=? and password=?"
  db.query(statement, [email, password], (error, result) => {
    console.log(result);
    console.log(error);

    response.send(utils
      .createResult(error, result))
  })
})


//all users DON TESTING
router.get("/all", (request, response) => {
  const statement = "SELECT * FROM User";
  db.query(statement, (error, result) => {
    console.log(result);
    response.send(utils.createResult(error, result));
  });
});

// User Profile Retrieval-done testing
router.get("/:id", (req, res) => {
  console.log("inside get of profile Retrival");
  const userId = req.params.id;
  
  console.log(userId);

  const statement = `
    SELECT user_id, firstName, lastName, email, phoneNumber
    FROM User
    WHERE user_id = ?
  `;

  db.query(statement, [userId], (error, result) => {

    if (error) {
      res.status(500).json({ status: "error", error: "Failed to retrieve user profile" });
      console.log(error);
    } else {
      if (result.length > 0) {
        const userProfile = result[0];
        res.json({ status: "success", data: userProfile });
      } else {
        res.status(404).json({ status: "error", error: "User not found" });
      }
    }
  });
});

// User Bookinghistory BookRetrieval
router.get("/Bookhistory/:id", (req, res) => {
  console.log("inside get of userhistory Retrival");
  const userId = req.params.id;
  
  console.log(userId);

  const statement =
   `
   SELECT
   Reservation.reservation_id,
   Room.room_number,
   Room.room_type,
   Room.images,
   Reservation.check_in_date,
   Reservation.check_out_date
FROM
   Reservation, Room
WHERE
   Reservation.room_number = Room.room_number
   AND Reservation.user_id = ?;

  `;

  db.query(statement, [userId], (error, result) => {

    if (error) {
      res.status(500).json({ status: "error", error: "Failed to retrieve user profile" });
      console.log(error);
    } else {
      if (result.length > 0) {        
        res.json({ status: "success", data: result});
      } else {
        res.status(404).json({ status: "error", error: "User not found" });
      }
    }
  });
});


// User password Update - testing done
router.put("/changepassword/:id", (req, res) => {
  console.log("inside User password Update");

  const userId = req.params.id;
  const {newPassword} = req.body;

  const statement = `
  UPDATE User
  SET password = ?
  WHERE user_id = ?
  `;

  db.query(statement, [newPassword,userId], (error, result) => {
    if (error) {
      res.status(500).json({ status: "error", error: "Failed to update password" });
    } else {
      if (result.affectedRows > 0) {        
        res.json({ status: "success", data: "Password updated successfully" });
      } else {
        res.status(404).json({ status: "error", error: "User not found" });
      }
    }
  });
});




module.exports = router
