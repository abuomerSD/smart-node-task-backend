let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_hubs', () => {
  it('it should create  new  pos_hubs ', (done) => {
    chai.request(server)
      .post('/api/pos-hubs')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_hubs  data', () => {
  it('it should GET all the pos_hubs', (done) => {
    chai.request(server)
      .get('/api/pos-hubs')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_hubs by id', () => {
  it('it should GET all the pos_hubs', (done) => {
    chai.request(server)
      .get('/api/pos-hubs/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_hubs', () => {
  it('it should update pos_hubs with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-hubs/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_hubs with paginate', () => {
  it('it should get  pos_hubs with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-hubs/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_hubs', () => {
  it('it should delete    pos_hubs ', (done) => {
    chai.request(server)
      .delete('/api/pos-hubs/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


