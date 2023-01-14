"use strict";

var response = require("./res");
var connection = require("./conn");

exports.index = function (req, res) {
  response.ok("Hello, pesan ini dari server nodejs restful api!", res);
};

exports.kamus = function (req, res) {
  connection.query("SELECT * FROM tbl_kamus", function (error, rows, fields) {
    var message;
    if (error) {
      message = "Error ketika menampilkan semua data Kamus!";
      response.gagal(message, res);
    } else {
      message = "Sukses menampilkan semua data Kamus";
      response.ok_with_data(message, rows, res);
    }
  });
};

exports.findKamus = function (req, res) {
  var id_kamus = req.params.id_kamus;
  var message;

  if (!id_kamus) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }
  connection.query(
    "SELECT * FROM tbl_kamus where id_kamus = ?",
    [id_kamus],
    function (error, rows, fields) {
      if (error) {
        message = "Error ketika mencari Kata yang dimaksud!";
        response.gagal(message, res);
      } else {
        if (rows.length > 0) {
          message = "Kata ditemukan";
          response.ok_with_data(message, rows[0], res);
        } else {
          message = "Kata tidak ditemukan!";
          response.gagal(message, res);
        }
      }
    });
};


exports.addKata = async function (req, res) {
  var kata_melayu = req.body.kata_melayu;
  var kata_indonesia = req.body.kata_indonesia;
  var message;


  if (
    !kata_melayu ||!kata_indonesia
  ) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }
  await connection.query("SELECT * FROM tbl_kamus where kata_melayu = ?",
    [kata_melayu],
    function (error, rows, fields) {
      if (rows.length > 0) {
        message = "Kata untuk Kamus telah terdaftar, silahkan pilih yang lain!";
        response.gagal(message, res);
      } else {
        connection.query(
          "INSERT INTO tbl_kamus (kata_melayu, kata_indonesia) values (?,?)",
          [kata_melayu, kata_indonesia],
          function (error, rows, fields) {
            if (error) {
              message = "Error ketika menambahkan Kata Kamus baru!";
              response.gagal(message, res);
            } else {
              message = "Berhasil menambahkan Kata Kamus baru";
              response.ok(message, res);
            }
          });
      }
    });
};

exports.updateKamus = async function (req, res) {
  var id_kamus = req.body.id;
  var kata_melayu = req.body.kata_melayu;
  var kata_indonesia = req.body.kata_indonesia;
  var message;

  if (!kata_melayu ||!kata_indonesia ) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }

  var sql_query;
  var params;
  if (kata_melayu == "") {
    sql_query =
      "UPDATE tbl_kamus SET  kata_melayu = ?, kata_indonesia = ? WHERE id = ?";
    params = [
        kata_melayu, kata_indonesia, id_kamus
    ];
  } else {
    sql_query =
      "UPDATE tbl_kamus SET kata_melayu = ? WHERE id = ?";
    params = [
        kata_melayu, kata_indonesia, email, id_kamus
    ];
  }

  await connection.query(
    "SELECT * FROM tbl_kamus where kata_melayu = ? and id <> ?",
    [kata_melayu, id_kamus],
    function (error, rows, fields) {
      if (rows.length > 0) {
        message = "Kata Melayu telah terdaftar, silahkan pilih yang lain!";
        response.gagal(message, res);
      } else {
        connection.query(sql_query, params, function (error, rows, fields) {
          if (error) {
            message = "Error ketika mengubah data kata Kamus!";
            response.gagal(message, res);
          } else {
            message = "Berhasil mengubah data Kamus";
            response.ok(message, res);
          }
        });
      }
    });
};

exports.deleteKamus = async function (req, res) {
  var kata_melayu = req.params.kata_melayu;
  var message;
  if (!kata_melayu) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }

  await connection.query(
    "SELECT * FROM tbl_kamus where kata_melayu = ?",
    [kata_melayu],
    function (error, rows, fields) {
      if (rows.length > 0) {
        connection.query(
          "DELETE FROM tbl_kamus WHERE kata_melayu = ?",
          [kata_melayu],
          function (error, rows, fields) {
            if (error) {
              message = "Error ketika mengahapus Kata!";
              response.gagal(message, res);
            } else {
              message = "Berhasil mengahapus Kata";
              response.ok(message, res);
            }
          }
        );
      } else {
        message = "Kata tidak ditemukan!";
        response.gagal(message, res);
      }
    }
  );
};