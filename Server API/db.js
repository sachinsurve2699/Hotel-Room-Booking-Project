const mysql = require("mysql")

const connection = mysql.createConnection({
  user: "root",
  password: "root",
  host: "localhost",
  port: 3306,
  database: "project",
})

connection.connect()

module.exports = connection
