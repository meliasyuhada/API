'use strict';

module.exports = function(app) {
    var todoList = require('./controller');

    //index
    app.route('/').get(todoList.index);
    //menampilkan data
    app.route('/mahasiswa').get(todoList.mahasiswa);
    //menampilkan data id
    app.route('/mahasiswa/:nim').get(todoList.findMahasiswa);
    //post
    app.route('/mahasiswa').post(todoList.addMahasiswa);
    //put
    app.route('/mahasiswa').put(todoList.updateMahasiswa);
    //delete
    app.route('/mahasiswa/:nim').delete(todoList.deleteMahasiswa);

    //blog
    //menampilkan data
    app.route('/blog').get(todoList.blog);
}