"use strict";

exports.ok_with_data = function (message, values, res) {
  var data = {
    message: message,
    error: false,
    data: values,
  };
  res.end(JSON.stringify(data));
};

exports.ok = function (message, res) {
  var data = {
    message: message,
    error: false,
  };
  res.end(JSON.stringify(data));
};

exports.gagal = function (message, res) {
  var data = {
    message: message,
    error: true,
  };
  res.end(JSON.stringify(data));
};
