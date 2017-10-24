const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const routes = require('./backend/routes');

const app = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true,
});

app.use(routes);

const port = 3000;
app.listen(port, () => {
  console.log('listening on', port);
});

module.exports = app;
