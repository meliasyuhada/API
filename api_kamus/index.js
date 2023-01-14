var express = require('express'),
 app = express(),
 port = process.env.PORT || 3000,
 bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
var routes = require('./routes');
routes(app);
app.listen(port);
console.log('RESTful API Server dimulai pada port: ' + port);