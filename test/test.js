const app = require('../');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Term = require('../backend/models').Term;

const {expect} = chai;
chai.use(chaiHttp);

describe('GET /', () => {
  it('should json Hello World!', (done) => {
    chai.request(app).get('/').end((err, res) => {
      expect(res).to.have.status(200);
      done();
    })
  });
});

// describe('POST /new/confirm', () => {
//   it('should send confirmation message for a new word', (done) => {
//     const term = 'dictionary';
//     chai.request(app).post('/new/confirm').send({text: term}).end((err, res) => {
//       expect(res).to.have.status(200);
//       done();
//     });
//   });
// });
//
// describe('POST /interactive', () => {
//   it('should save new term to MongoDB', (done) => {
//     payload = JSON.stringify({
//       "callback_id": "CONFIRM_NEW_TERM",
//       "actions": [
//         {
//           "name": "save",
//           "text": "Save",
//           "type": "button",
//           "value": {
//             "en": "truck",
//             "cn": "卡车"
//           }
//         }
//       ]
//     });
//     chai.request(app).post('/interactive').send({payload}).end((err, res) => {
//       expect(res).to.have.status(200);
//       expect(res.body.text).to.be.equal('Your term truck saved!🔥');
//       expect(res.body.success).to.be.true;
//       done()
//     })
//   })
// })
