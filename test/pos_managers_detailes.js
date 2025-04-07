let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_managers_detailes', () => {
  it('it should create  new  pos_managers_detailes ', (done) => {
    chai.request(server)
      .post('/api/pos-managers-detailes')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_managers_detailes  data', () => {
  it('it should GET all the pos_managers_detailes', (done) => {
    chai.request(server)
      .get('/api/pos-managers-detailes')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_managers_detailes by id', () => {
  it('it should GET all the pos_managers_detailes', (done) => {
    chai.request(server)
      .get('/api/pos-managers-detailes/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_managers_detailes', () => {
  it('it should update pos_managers_detailes with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-managers-detailes/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_managers_detailes with paginate', () => {
  it('it should get  pos_managers_detailes with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-managers-detailes/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_managers_detailes', () => {
  it('it should delete    pos_managers_detailes ', (done) => {
    chai.request(server)
      .delete('/api/pos-managers-detailes/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


