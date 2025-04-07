let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_roles', () => {
  it('it should create  new  pos_roles ', (done) => {
    chai.request(server)
      .post('/api/pos-roles')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_roles  data', () => {
  it('it should GET all the pos_roles', (done) => {
    chai.request(server)
      .get('/api/pos-roles')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_roles by id', () => {
  it('it should GET all the pos_roles', (done) => {
    chai.request(server)
      .get('/api/pos-roles/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_roles', () => {
  it('it should update pos_roles with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-roles/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_roles with paginate', () => {
  it('it should get  pos_roles with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-roles/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_roles', () => {
  it('it should delete    pos_roles ', (done) => {
    chai.request(server)
      .delete('/api/pos-roles/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


