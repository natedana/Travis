const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bluebird = require('bluebird');

const routes = require('./backend/routes');

const app = express();
app.use(bodyParser.json());

mongoose.Promise = require('bluebird');
mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true,
});
mongoose.connection.on('error', console.log.bind(console, 'MongoDB failed to connect'));
mongoose.connection.on('connected', console.log.bind(console, 'Connected to MongoDB'));

app.use(routes);

const port = 3000;
app.listen(port, () => {
  console.log('Listening on', port);
});

module.exports = app;
