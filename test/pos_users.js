let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_users', () => {
  it('it should create  new  pos_users ', (done) => {
    chai.request(server)
      .post('/api/pos-users')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_users  data', () => {
  it('it should GET all the pos_users', (done) => {
    chai.request(server)
      .get('/api/pos-users')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_users by id', () => {
  it('it should GET all the pos_users', (done) => {
    chai.request(server)
      .get('/api/pos-users/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_users', () => {
  it('it should update pos_users with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-users/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_users with paginate', () => {
  it('it should get  pos_users with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-users/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_users', () => {
  it('it should delete    pos_users ', (done) => {
    chai.request(server)
      .delete('/api/pos-users/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


