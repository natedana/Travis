const app = require('../backend/server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const Term = require('../backend/models').Term;

const { expect } = chai;
chai.use(chaiHttp);

