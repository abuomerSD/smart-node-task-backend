let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  users', () => {
  it('it should create  new  users ', (done) => {
    chai.request(server)
      .post('/api/users')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  users  data', () => {
  it('it should GET all the users', (done) => {
    chai.request(server)
      .get('/api/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get users by id', () => {
  it('it should GET all the users', (done) => {
    chai.request(server)
      .get('/api/users/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update users', () => {
  it('it should update users with the id ', (done) => {
    chai.request(server)
      .put('/api/users/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   users with paginate', () => {
  it('it should get  users with paginate ', (done) => {
    chai.request(server)
      .post('/api/users/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  users', () => {
  it('it should delete    users ', (done) => {
    chai.request(server)
      .delete('/api/users/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


