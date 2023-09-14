
DROP TABLE IF EXISTS Feedback;
DROP TABLE IF EXISTS Confirmation;
DROP TABLE IF EXISTS Reservation;
DROP TABLE IF EXISTS Room;
DROP TABLE IF EXISTS User;


CREATE TABLE User (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  Role VARCHAR(255),
  email VARCHAR(255),
  phoneNumber BIGINT,
  password VARCHAR(255)
);


CREATE TABLE Room (
  room_number INT PRIMARY KEY,
  room_type VARCHAR(255),
  capacity INT,
  price_per_night FLOAT,
  images VARCHAR(255),
  ac_non_ac VARCHAR(255),
  bed_type VARCHAR(255),
  room_size VARCHAR(255)
);


CREATE TABLE Reservation (
  reservation_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  room_number INT,
  check_in_date VARCHAR(255),
  check_out_date VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  FOREIGN KEY (room_number) REFERENCES Room(room_number) ON DELETE CASCADE
);





CREATE TABLE Confirmation (
  confirmation_id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id INT UNIQUE,
  amount FLOAT,
  payment_date VARCHAR(255),
  FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id) ON DELETE CASCADE
);


CREATE TABLE Feedback (
  feedback_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reservation_id INT UNIQUE,
  feedback_text TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
  FOREIGN KEY (reservation_id) REFERENCES Reservation(reservation_id) ON DELETE CASCADE
);
