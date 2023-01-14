"use strict";

var response = require("./res");
var connection = require("./conn");
var encrypt = require("./encrypt_password");

exports.index = function (req, res) {
  response.ok("Hello, pesan ini dari server nodejs restful api!", res);
};

exports.users = function (req, res) {
  connection.query("SELECT * FROM tbl_user", function (error, rows, fields) {
    var message;
    if (error) {
      message = "Error ketika menampilkan semua data user!";
      response.gagal(message, res);
    } else {
      message = "Sukses menampilkan semua data user";
      response.ok_with_data(message, rows, res);
    }
  });
};

exports.findUsers = function (req, res) {
  var user_id = req.params.user_id;
  var message;

  if (!user_id) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }
  connection.query(
    "SELECT * FROM tbl_user where id = ?",
    [user_id],
    function (error, rows, fields) {
      if (error) {
        message = "Error ketika mencari user yang dimaksud!";
        response.gagal(message, res);
      } else {
        if (rows.length > 0) {
          message = "User ditemukan";
          response.ok_with_data(message, rows[0], res);
        } else {
          message = "User tidak ditemukan!";
          response.gagal(message, res);
        }
      }
    });
};

exports.loginUser = async function (req, res) {
  var email = req.query.email;
  var myPassword = req.query.password;
  var message;

  if (!email || !myPassword) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }
  await connection.query(
    "SELECT * FROM tbl_user where email = ?",
    [email],
    function (error, rows, fields) {
      if (rows.length > 0) {
        if (encrypt.compareHashPassword(myPassword, rows[0].password)) {
          message = "Login berhasil";
          response.ok_with_data(message, rows[0], res);
        } else {
          message = "Password user tidak cocok!";
          response.gagal(message, res);
        }
      } else {
        message = "User tidak terdaftar!";
        response.gagal(message, res);
      }
    });
};

exports.registerUser = async function (req, res) {
  var nama = req.body.nama;
  var tanggal_lahir = req.body.tanggal_lahir;
  var jenis_kelamin = req.body.jenis_kelamin;
  var nomor_hp = req.body.nomor_hp;
  var alamat = req.body.alamat;
  var email = req.body.email;
  var plain_password = req.body.password;
  var message;

  if (
    !nama ||!tanggal_lahir ||!jenis_kelamin ||!nomor_hp ||!alamat ||!email ||!plain_password
  ) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }
  await connection.query("SELECT * FROM tbl_user where email = ?",
    [email],
    function (error, rows, fields) {
      if (rows.length > 0) {
        message = "Email user telah terdaftar, silahkan pilih yang lain!";
        response.gagal(message, res);
      } else {
        var encrypt_password = encrypt.saltHashPassword(plain_password);
        connection.query(
          "INSERT INTO tbl_user (nama, tanggal_lahir, jenis_kelamin, nomor_hp, alamat, email, password) values (?,?,?,?,?,?,?)",
          [nama,tanggal_lahir,jenis_kelamin,nomor_hp,alamat,email,encrypt_password],
          function (error, rows, fields) {
            if (error) {
              message = "Error ketika menambahkan user baru!";
              response.gagal(message, res);
            } else {
              message = "Berhasil menambahkan user baru";
              response.ok(message, res);
            }
          });
      }
    });
};

exports.updateUser = async function (req, res) {
  var user_id = req.body.id;
  var nama = req.body.nama;
  var tanggal_lahir = req.body.tanggal_lahir;
  var jenis_kelamin = req.body.jenis_kelamin;
  var nomor_hp = req.body.nomor_hp;
  var alamat = req.body.alamat;
  var email = req.body.email;
  var plain_password = req.body.password;
  var message;

  if (!nama ||!tanggal_lahir ||!jenis_kelamin ||!nomor_hp ||!alamat ||!email ) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }

  var sql_query;
  var params;
  if (plain_password == "") {
    sql_query =
      "UPDATE tbl_user SET nama = ?, tanggal_lahir = ?, jenis_kelamin = ?, nomor_hp = ?, alamat = ?, email = ? WHERE id = ?";
    params = [
      nama,tanggal_lahir,jenis_kelamin,nomor_hp,alamat,email,user_id,
    ];
  } else {
    sql_query =
      "UPDATE tbl_user SET nama = ?, tanggal_lahir = ?, jenis_kelamin = ?, nomor_hp = ?, alamat = ?, email = ?, password = ? WHERE id = ?";
    var encrypt_password = encrypt.saltHashPassword(plain_password);
    params = [
      nama,tanggal_lahir,jenis_kelamin,nomor_hp,alamat,email,encrypt_password,user_id,
    ];
  }

  await connection.query(
    "SELECT * FROM tbl_user where email = ? and id <> ?",
    [email, user_id],
    function (error, rows, fields) {
      if (rows.length > 0) {
        message = "Email user telah terdaftar, silahkan pilih yang lain!";
        response.gagal(message, res);
      } else {
        connection.query(sql_query, params, function (error, rows, fields) {
          if (error) {
            message = "Error ketika mengubah data user!";
            response.gagal(message, res);
          } else {
            message = "Berhasil mengubah data user";
            response.ok(message, res);
          }
        });
      }
    });
};

exports.deleteUser = async function (req, res) {
  var user_id = req.params.id;
  var message;
  if (!user_id) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }

  await connection.query(
    "SELECT * FROM tbl_user where id = ?",
    [user_id],
    function (error, rows, fields) {
      if (rows.length > 0) {
        connection.query(
          "DELETE FROM tbl_user WHERE id = ?",
          [user_id],
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


const MAX_SIZE = 1 * 1000 * 1000; // 1 MB

var helpers = require("./helpers");
var multer = require("multer");
var fs = require("fs");
exports.addService = function (req, res) {
  let upload = multer({
    storage: helpers.storage,
    limits: { fileSize: MAX_SIZE },
    fileFilter: helpers.imageFilter,
  }).single("file");

  upload(req, res, function (err) {
    var message;
    
    if (req.fileValidationError) {
      message = req.fileValidationError;
      return response.gagal(message, res);
    } else if (!req.file) {
      message = "Please select an image to upload or choose image under 1MB";
      return response.gagal(message, res);
    } else if (err instanceof multer.MulterError) {
      message = "MulterError upload image";
      return response.gagal(message, res);
    } else if (err) {
      message = "Error upload image";
      return response.gagal(message, res);
    }

    
    var id_user = req.body.id_user;
    var nama_jasa = req.body.nama_jasa;
    var deskripsi_singkat = req.body.deskripsi_singkat;
    var uraian_deskripsi = req.body.uraian_deskripsi;
    var rating = req.body.rating;
    var gambar = req.body.gambar;

    if (
      !id_user ||
      !nama_jasa ||
      !deskripsi_singkat ||
      !uraian_deskripsi ||
      !rating ||
      !gambar
    ) {
      message = "Kehilangan beberapa parameter yang dibutuhkan!";
      return response.gagal(message, res);
    }

    gambar = req.file.filename;

    connection.query(
      "INSERT INTO tbl_jasa (id_user, nama_jasa, deskripsi_singkat, uraian_deskripsi, rating, gambar) values (?,?,?,?,?,?)",
      [id_user, nama_jasa, deskripsi_singkat, uraian_deskripsi, rating, gambar],
      function (error, rows, fields) {
        if (error) {
          //removeImage;
          fs.unlink("./public/img/" + req.file.filename, function (err) {
            if (err) throw err;
            
          });
          message = "Error ketika menambahkan jasa!";
          response.gagal(message, res);
        } else {
          message = "Berhasil menambahkan jasa";
          response.ok(message, res);
        }
      }
    );
  });
};

exports.getServices = function (req, res) {
  connection.query(
    "SELECT tbl_jasa.id_jasa, tbl_user.nama as nama_penyedia, tbl_user.nomor_hp, tbl_jasa.nama_jasa, tbl_jasa.deskripsi_singkat, tbl_jasa.uraian_deskripsi, tbl_jasa.rating, tbl_jasa.gambar FROM tbl_jasa, tbl_user WHERE tbl_user.id = tbl_jasa.id_user ORDER BY tbl_jasa.id_jasa DESC",
    function (error, rows, fields) {
      var message;
      if (error) {
        message = "Error ketika menampilkan semua data jasa!";
        response.gagal(message, res);
      } else {
        message = "Sukses menampilkan semua data jasa";
        response.ok_with_data(message, rows, res);
      }
    }
  );
};

exports.getUserServices = function (req, res) {
  var user_id = req.params.id;
  var message;

  if (!user_id) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }

  connection.query(
    "SELECT tbl_jasa.id_jasa, tbl_user.nama as nama_penyedia, tbl_user.nomor_hp, tbl_jasa.nama_jasa, tbl_jasa.deskripsi_singkat, tbl_jasa.uraian_deskripsi, tbl_jasa.rating, tbl_jasa.gambar FROM tbl_jasa, tbl_user WHERE tbl_user.id = tbl_jasa.id_user AND tbl_user.id = ? ORDER BY tbl_jasa.id_jasa DESC",
    [user_id],
    function (error, rows, fields) {
      if (error) {
        message = "Error ketika menampilkan semua data jasa pengguna!";
        response.gagal(message, res);
      } else {
        message = "Sukses menampilkan semua data jasa pengguna";
        response.ok_with_data(message, rows, res);
      }
    }
  );
};

exports.deleteService = async function (req, res) {
  var id_jasa = req.params.id_jasa;
  var message;

  if (!id_jasa) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }

  await connection.query(
    "SELECT * FROM tbl_jasa where id_jasa = ?",
    [id_jasa],
    function (error, rows, fields) {
      if (rows.length > 0) {
        var filename = rows[0].gambar;
        connection.query(
          "DELETE FROM tbl_jasa WHERE id_jasa = ?",
          [id_jasa],
          function (error, rows, fields) {
            if (error) {
              message = "Error ketika mengahapus jasa!";
              response.gagal(message, res);
            } else {
              fs.unlink("./public/img/" + filename, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                //console.log('File deleted!');
              });
              message = "Berhasil mengahapus jasa";
              response.ok(message, res);
            }
          }
        );
      } else {
        message = "Jasa tidak ditemukan!";
        response.gagal(message, res);
      }
    }
  );
};

exports.editServiceReplaceImage = function (req, res) {
  let upload = multer({
    storage: helpers.storage,
    limits: { fileSize: MAX_SIZE },
    fileFilter: helpers.imageFilter,
  }).single("file");

  upload(req, res, async function (err) {
    var message;
    // req.file contains information of uploaded file
    if (req.fileValidationError) {
      message = req.fileValidationError;
      return response.gagal(message, res);
    } else if (!req.file) {
      message = "Please select an image to upload or choose image under 1MB";
      return response.gagal(message, res);
    } else if (err instanceof multer.MulterError) {
      message = "MulterError upload image";
      return response.gagal(message, res);
    } else if (err) {
      message = "Error upload image";
      return response.gagal(message, res);
    }

    // req.body contains information of text fields, if there were any
    var id_jasa = req.body.id_jasa;
    var nama_jasa = req.body.nama_jasa;
    var deskripsi_singkat = req.body.deskripsi_singkat;
    var uraian_deskripsi = req.body.uraian_deskripsi;
    var gambar = req.body.gambar;

    if (
      !id_jasa ||
      !nama_jasa ||
      !deskripsi_singkat ||
      !uraian_deskripsi ||
      !gambar
    ) {
      message = "Kehilangan beberapa parameter yang dibutuhkan!";
      return response.gagal(message, res);
    }

    gambar = req.file.filename;
    await connection.query(
      "SELECT * FROM tbl_jasa where id_jasa = ?",
      [id_jasa],
      function (error, rows, fields) {
        if (rows.length > 0) {
          var sql_query =
            "UPDATE tbl_jasa SET nama_jasa = ?, deskripsi_singkat = ?, uraian_deskripsi = ?, gambar = ? WHERE id_jasa = ?";
          var params = [
            nama_jasa,
            deskripsi_singkat,
            uraian_deskripsi,
            gambar,
            id_jasa,
          ];
          var filename = rows[0].gambar;
          connection.query(sql_query, params, function (error, rows, fields) {
            if (error) {
              message = "Error ketika mengubah data jasa!";
              response.gagal(message, res);
            } else {
              fs.unlink("./public/img/" + filename, function (err) {
                if (err) throw err;
              });
              message = "Berhasil mengubah data jasa";
              response.ok(message, res);
            }
          });
        } else {
          message = "Jasa yang mau diubah telah terhapus!";
          response.gagal(message, res);
        }
      }
    );
  });
};

exports.editService = async function (req, res) {
  // req.body contains information of text fields, if there were any
  var id_jasa = req.params.id_jasa;
  var nama_jasa = req.body.nama_jasa;
  var deskripsi_singkat = req.body.deskripsi_singkat;
  var uraian_deskripsi = req.body.uraian_deskripsi;
  var message;

  if (!id_jasa || !nama_jasa || !deskripsi_singkat || !uraian_deskripsi) {
    message = "Kehilangan beberapa parameter yang dibutuhkan!";
    return response.gagal(message, res);
  }

  await connection.query(
    "SELECT * FROM tbl_jasa where id_jasa = ?",
    [id_jasa],
    function (error, rows, fields) {
      if (rows.length > 0) {
        var sql_query =
          "UPDATE tbl_jasa SET nama_jasa = ?, deskripsi_singkat= ?, uraian_deskripsi = ? WHERE id_jasa = ?";
        var params = [nama_jasa, deskripsi_singkat, uraian_deskripsi, id_jasa];
        connection.query(sql_query, params, function (error, rows, fields) {
          if (error) {
            message = "Error ketika mengubah data jasa!";
            response.gagal(message, res);
          } else {
            message = "Berhasil mengubah data jasa";
            response.ok(message, res);
          }
        });
      } else {
        message = "Jasa yang mau diubah telah terhapus!";
        response.gagal(message, res);
      }
    }
  );
}