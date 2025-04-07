let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_types', () => {
  it('it should create  new  pos_types ', (done) => {
    chai.request(server)
      .post('/api/pos-types')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_types  data', () => {
  it('it should GET all the pos_types', (done) => {
    chai.request(server)
      .get('/api/pos-types')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_types by id', () => {
  it('it should GET all the pos_types', (done) => {
    chai.request(server)
      .get('/api/pos-types/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_types', () => {
  it('it should update pos_types with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-types/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_types with paginate', () => {
  it('it should get  pos_types with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-types/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_types', () => {
  it('it should delete    pos_types ', (done) => {
    chai.request(server)
      .delete('/api/pos-types/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


