"use strict";

var response = require("./res");
var connection = require("./conn");

exports.index = function (req, res) {
  response.ok("Hello, pesan ini dari server nodejs restful api!", res);
};

exports.mahasiswa = function (req, res) {
  connection.query("SELECT * FROM tbl_user", function (error, rows, fields) {
    var message;
    if (error) {
      message = "Error ketika menampilkan semua data Mahasiswa!";
      response.gagal(message, res);
    } else {
      message = "Sukses menampilkan semua data Mahasiswa";
      response.ok_with_data(message, rows, res);
    }
  });
};

exports.findMahasiswa = function (req, res) {
  var nim = req.params.nim;
  var message;

  if (!nim) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }
  connection.query(
    "SELECT * FROM tbl_user where nim = ?",
    [nim],
    function (error, rows, fields) {
      if (error) {
        message = "Error ketika mencari Mahasiswa yang dimaksud!";
        response.gagal(message, res);
      } else {
        if (rows.length > 0) {
          message = "Mahasiswa ditemukan";
          response.ok_with_data(message, rows[0], res);
        } else {
          message = "Mahasiswa tidak ditemukan!";
          response.gagal(message, res);
        }
      }
    });
};


exports.addMahasiswa = async function (req, res) {
  var nim = req.body.nim;
  var nama = req.body.nama;
  var email = req.body.email;
  var no_hp = req.body.no_hp;
  var jurusan = req.body.jurusan;
  var prodi = req.body.prodi;
  var kelas = req.body.kelas;
  var paralel = req.body.paralel;
  var message;


  if (
    !nim ||!nama ||!email ||!no_hp ||!jurusan ||!prodi ||!kelas || !paralel
  ) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }
  await connection.query("SELECT * FROM tbl_user where nim = ?",
    [nim],
    function (error, rows, fields) {
      if (rows.length > 0) {
        message = "Nim Mahasiswa telah terdaftar, silahkan pilih yang lain!";
        response.gagal(message, res);
      } else {
        connection.query(
          "INSERT INTO tbl_user (nim, nama, email, no_hp, jurusan, prodi, paralel) values (?,?,?,?,?,?,?)",
          [nim, nama, email, no_hp, jurusan, prodi, paralel],
          function (error, rows, fields) {
            if (error) {
              message = "Error ketika menambahkan Mahasiswa baru!";
              response.gagal(message, res);
            } else {
              message = "Berhasil menambahkan Mahasiswa baru";
              response.ok(message, res);
            }
          });
      }
    });
};

exports.updateMahasiswa = async function (req, res) {
  var user_id = req.body.id;
  var nim = req.body.nim;
  var nama = req.body.nama;
  var email = req.body.email;
  var no_hp = req.body.no_hp;
  var jurusan = req.body.jurusan;
  var prodi = req.body.prodi;
  var kelas = req.body.kelas;
  var paralel = req.body.paralel;
  var message;

  if (!nim ||!nama ||!email ||!no_hp ||!jurusan ||!prodi ||!kelas || !paralel ) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }

  var sql_query;
  var params;
  if (nim == "") {
    sql_query =
      "UPDATE tbl_user SET nim = ?, nama = ?, email = ?, no_hp = ?, jurusan = ?, prodi = ?, kelas = ?, paralel = ? WHERE id = ?";
    params = [
      nim, nama, email, no_hp, jurusan, prodi, kelas, paralel,user_id
    ];
  } else {
    sql_query =
      "UPDATE tbl_user SET nim = ?, nama = ?, email = ?, no_hp = ?, jurusan = ?, prodi = ?, kelas = ?, paralel = ? WHERE id = ?";
    params = [
      nim, nama, email, no_hp, jurusan, prodi, kelas, paralel,user_id
    ];
  }

  await connection.query(
    "SELECT * FROM tbl_user where nim = ? and id <> ?",
    [nim, user_id],
    function (error, rows, fields) {
      if (rows.length > 0) {
        message = "Nim Mahasiswa telah terdaftar, silahkan pilih yang lain!";
        response.gagal(message, res);
      } else {
        connection.query(sql_query, params, function (error, rows, fields) {
          if (error) {
            message = "Error ketika mengubah data mahasiswa!";
            response.gagal(message, res);
          } else {
            message = "Berhasil mengubah data mahasiswa";
            response.ok(message, res);
          }
        });
      }
    });
};

exports.deleteMahasiswa = async function (req, res) {
  var nim = req.params.nim;
  var message;
  if (!nim) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }

  await connection.query(
    "SELECT * FROM tbl_user where nim = ?",
    [nim],
    function (error, rows, fields) {
      if (rows.length > 0) {
        connection.query(
          "DELETE FROM tbl_user WHERE nim = ?",
          [nim],
          function (error, rows, fields) {
            if (error) {
              message = "Error ketika mengahapus user!";
              response.gagal(message, res);
            } else {
              message = "Berhasil mengahapus user";
              response.ok(message, res);
            }
          }
        );
      } else {
        message = "User tidak ditemukan!";
        response.gagal(message, res);
      }
    }
  );
};

exports.blog = function (req, res) {
  connection.query("SELECT * FROM tbl_blog", function (error, rows, fields) {
    var message;
    if (error) {
      message = "Error ketika menampilkan semua data Blog!";
      response.gagal(message, res);
    } else {
      message = "Sukses menampilkan semua data Blog";
      response.ok_with_data(message, rows, res);
    }
  });
};