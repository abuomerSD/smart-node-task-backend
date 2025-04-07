let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  transactions', () => {
  it('it should create  new  transactions ', (done) => {
    chai.request(server)
      .post('/api/transactions')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  transactions  data', () => {
  it('it should GET all the transactions', (done) => {
    chai.request(server)
      .get('/api/transactions')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get transactions by id', () => {
  it('it should GET all the transactions', (done) => {
    chai.request(server)
      .get('/api/transactions/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update transactions', () => {
  it('it should update transactions with the id ', (done) => {
    chai.request(server)
      .put('/api/transactions/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   transactions with paginate', () => {
  it('it should get  transactions with paginate ', (done) => {
    chai.request(server)
      .post('/api/transactions/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  transactions', () => {
  it('it should delete    transactions ', (done) => {
    chai.request(server)
      .delete('/api/transactions/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


