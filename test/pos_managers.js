let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_managers', () => {
  it('it should create  new  pos_managers ', (done) => {
    chai.request(server)
      .post('/api/pos-managers')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_managers  data', () => {
  it('it should GET all the pos_managers', (done) => {
    chai.request(server)
      .get('/api/pos-managers')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_managers by id', () => {
  it('it should GET all the pos_managers', (done) => {
    chai.request(server)
      .get('/api/pos-managers/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_managers', () => {
  it('it should update pos_managers with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-managers/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_managers with paginate', () => {
  it('it should get  pos_managers with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-managers/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_managers', () => {
  it('it should delete    pos_managers ', (done) => {
    chai.request(server)
      .delete('/api/pos-managers/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


