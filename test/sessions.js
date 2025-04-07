let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  sessions', () => {
  it('it should create  new  sessions ', (done) => {
    chai.request(server)
      .post('/api/sessions')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  sessions  data', () => {
  it('it should GET all the sessions', (done) => {
    chai.request(server)
      .get('/api/sessions')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get sessions by id', () => {
  it('it should GET all the sessions', (done) => {
    chai.request(server)
      .get('/api/sessions/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update sessions', () => {
  it('it should update sessions with the id ', (done) => {
    chai.request(server)
      .put('/api/sessions/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   sessions with paginate', () => {
  it('it should get  sessions with paginate ', (done) => {
    chai.request(server)
      .post('/api/sessions/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  sessions', () => {
  it('it should delete    sessions ', (done) => {
    chai.request(server)
      .delete('/api/sessions/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


