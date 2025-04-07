let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  suppliers', () => {
  it('it should create  new  suppliers ', (done) => {
    chai.request(server)
      .post('/api/suppliers')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  suppliers  data', () => {
  it('it should GET all the suppliers', (done) => {
    chai.request(server)
      .get('/api/suppliers')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get suppliers by id', () => {
  it('it should GET all the suppliers', (done) => {
    chai.request(server)
      .get('/api/suppliers/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update suppliers', () => {
  it('it should update suppliers with the id ', (done) => {
    chai.request(server)
      .put('/api/suppliers/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   suppliers with paginate', () => {
  it('it should get  suppliers with paginate ', (done) => {
    chai.request(server)
      .post('/api/suppliers/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  suppliers', () => {
  it('it should delete    suppliers ', (done) => {
    chai.request(server)
      .delete('/api/suppliers/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


