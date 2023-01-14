var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_api_jasa_tatabusana",
});
con.connect(function (err) {
  if (err) {
    console.log("error: " + err.message);
    process.exit(1);
  }
  console.log("Mysql terkoneksi...");
});
module.exports = con;