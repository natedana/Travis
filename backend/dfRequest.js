const dialogflow = require('apiai');
const app = dialogflow(process.env.DF_CLIENT_ACCESS_TOKEN);

function dfRequest(textQuery, sessionId) {
  return new Promise(function(resolve, reject) {
    var request = app.textRequest(textQuery, {
      sessionId: sessionId
    });
    request.on('response', function(response) {
      resolve(response);
    });
    request.on('error', function(error) {
      reject(error)
    });
    request.end();
  })
}
module.exports = dfRequest
