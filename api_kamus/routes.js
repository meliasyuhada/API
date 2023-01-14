'use strict';
module.exports = function(app) {
 var todoList = require('./controller');
 //routing untuk index
 app.route('/')
 .get(todoList.index);
 //routing untuk user
 app.route('/kamus')
 .get(todoList.kamus);
 
 app.route('/kamus/:id_kamus')
 .get(todoList.findKamus);

 app.route('/kamus')
 .post(todoList.addKata);

 app.route('/kamus')
 .put(todoList.updateKamus);
 
 app.route('/kamus/:id')
 .delete(todoList.deleteKamus);
};