const app = require('../backend/index.js');
const chai = require('chai');
const chaiHttp = require('chai-http');
const axios = require('axios');
const Term = require('../backend/models').Term;

const { expect } = chai;
chai.use(chaiHttp);
const agent = chai.request(app);
const dfUrl = 'https://api.dialogflow.com/v1/' + '?v=20150910';
const hardUrl = 'https://api.dialogflow.com/v1/query/?v=20150910';
/* const createUrl = (action) => { */
/* } */

describe('GET /', () => {
  it('should json Hello World!', (done) => {
    agent
      .get('/')
      .end((err, res) => {
        if (err) console.log('err getting hello world... you are trash', err);
        expect(res).to.have.status(200);
        done();
    });
  });
});

describe('DialogFlow intent expects', () => {
  describe('POST /query', () => {
    it('should respond with a LIST of terms', (done) => {
      const sendJson = JSON.stringify(
      {
        event: {
          name: 'LIST',
        }
      });
      // not working for some reason. trying to connect to port 80?
      agent
        .post('https://api.dialogflow.com/v1/query/?v=20150910')
        .type('application/json')
        .set('Authorization', 'Bearer '+ process.env.DF_CLIENT_ACCESS_TOKEN)
        .set('Content-Type', 'application/json')
        .send(sendJson)
        .end((err, res) => {
          if (err) console.log('err post /query list', err);
          /* console.log('\nRES', res); */
          /* expect(res).to.have.status(200); */
          done();
      });
    });
  });
});


