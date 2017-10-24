const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const routes = require('./backend/routes');
app.use(routes);

const port = 3000;
app.listen(port, () => {
  console.log('listening on', port);
});
