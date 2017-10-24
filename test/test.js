const app = require('../');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Term = require('../backend/models').Term;

const { expect } = chai;
chai.use(chaiHttp);

describe('GET /', () => {
  it('should json Hello World!', (done) => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      })
  });
});

describe('POST /new', () => {
	it('should post a new word', (done) => {
    const term = 'dictionary';
    chai.request(app)
      .post('/new')
      .send({
        term
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        done();
      });
  });
});
