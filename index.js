const express = require('express');
const bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var routes = require('./backend/routes');
app.use('/',routes)

let port = 3000;
app.listen(port, function(){
  console.log('listening on', port);
})
