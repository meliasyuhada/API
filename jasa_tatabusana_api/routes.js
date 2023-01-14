'use strict';

module.exports = function(app) {
    var todoList = require('./controller');
    //index
    app.route('/').get(todoList.index);

    //users
    app.route('/users').get(todoList.users);
    app.route('/users/:user_id').get(todoList.findUsers);
    app.route('/login').get(todoList.loginUser);
    app.route('/users').post(todoList.registerUser);
    app.route('/users').put(todoList.updateUser);
    app.route('/users/:id').delete(todoList.deleteUser);
 
    //jasa
    app.route('/services').post(todoList.addService);
    app.route('/services').get(todoList.getServices);
    app.route('/services/:id').get(todoList.getUserServices);
    app.route('/services/:id_jasa').delete(todoList.deleteService);
    app.route('/services').put(todoList.editServiceReplaceImage);
    app.route('/services/:id_jasa').put(todoList.editService);
    
};