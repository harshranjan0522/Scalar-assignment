const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root@123",
    database: "trello_clone",
});

module.exports = pool.promise();