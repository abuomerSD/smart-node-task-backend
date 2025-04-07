let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  countries', () => {
  it('it should create  new  countries ', (done) => {
    chai.request(server)
      .post('/api/countries')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  countries  data', () => {
  it('it should GET all the countries', (done) => {
    chai.request(server)
      .get('/api/countries')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get countries by id', () => {
  it('it should GET all the countries', (done) => {
    chai.request(server)
      .get('/api/countries/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update countries', () => {
  it('it should update countries with the id ', (done) => {
    chai.request(server)
      .put('/api/countries/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   countries with paginate', () => {
  it('it should get  countries with paginate ', (done) => {
    chai.request(server)
      .post('/api/countries/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  countries', () => {
  it('it should delete    countries ', (done) => {
    chai.request(server)
      .delete('/api/countries/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


