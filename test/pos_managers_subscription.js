let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_managers_subscription', () => {
  it('it should create  new  pos_managers_subscription ', (done) => {
    chai.request(server)
      .post('/api/pos-managers-subscription')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_managers_subscription  data', () => {
  it('it should GET all the pos_managers_subscription', (done) => {
    chai.request(server)
      .get('/api/pos-managers-subscription')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_managers_subscription by id', () => {
  it('it should GET all the pos_managers_subscription', (done) => {
    chai.request(server)
      .get('/api/pos-managers-subscription/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_managers_subscription', () => {
  it('it should update pos_managers_subscription with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-managers-subscription/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_managers_subscription with paginate', () => {
  it('it should get  pos_managers_subscription with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-managers-subscription/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_managers_subscription', () => {
  it('it should delete    pos_managers_subscription ', (done) => {
    chai.request(server)
      .delete('/api/pos-managers-subscription/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


