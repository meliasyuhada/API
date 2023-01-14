'use strict';
//jika query sukses maka format json yang dikembalikan yaitu message, error = false dan data
exports.ok_with_data = function(message, values, res) {
 var data = {
 'message': message,
 'error': false,
 'data': values
 };
 res.end(JSON.stringify(data));
};
//jika query sukses maka format json yang dikembalikan yaitu message, error = false
exports.ok = function(message, res) {
 var data = {
 'message': message,
 'error': false
 };
 res.end(JSON.stringify(data));
};
//jika query gagal maka format json yang dikembalikan yaitu message, error = true
exports.gagal = function(message, res){
 var data = {
 'message': message,
 'error': true
 };
 res.end(JSON.stringify(data));
};