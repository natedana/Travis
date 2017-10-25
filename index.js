// test commment
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./backend/routes');

const app = express();

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('listening on', port);
});

module.exports = app;
