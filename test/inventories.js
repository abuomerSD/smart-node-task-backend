let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  inventories', () => {
  it('it should create  new  inventories ', (done) => {
    chai.request(server)
      .post('/api/inventories')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  inventories  data', () => {
  it('it should GET all the inventories', (done) => {
    chai.request(server)
      .get('/api/inventories')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get inventories by id', () => {
  it('it should GET all the inventories', (done) => {
    chai.request(server)
      .get('/api/inventories/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update inventories', () => {
  it('it should update inventories with the id ', (done) => {
    chai.request(server)
      .put('/api/inventories/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   inventories with paginate', () => {
  it('it should get  inventories with paginate ', (done) => {
    chai.request(server)
      .post('/api/inventories/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  inventories', () => {
  it('it should delete    inventories ', (done) => {
    chai.request(server)
      .delete('/api/inventories/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


