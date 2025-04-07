let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  custmors', () => {
  it('it should create  new  custmors ', (done) => {
    chai.request(server)
      .post('/api/custmors')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  custmors  data', () => {
  it('it should GET all the custmors', (done) => {
    chai.request(server)
      .get('/api/custmors')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get custmors by id', () => {
  it('it should GET all the custmors', (done) => {
    chai.request(server)
      .get('/api/custmors/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update custmors', () => {
  it('it should update custmors with the id ', (done) => {
    chai.request(server)
      .put('/api/custmors/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   custmors with paginate', () => {
  it('it should get  custmors with paginate ', (done) => {
    chai.request(server)
      .post('/api/custmors/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  custmors', () => {
  it('it should delete    custmors ', (done) => {
    chai.request(server)
      .delete('/api/custmors/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


