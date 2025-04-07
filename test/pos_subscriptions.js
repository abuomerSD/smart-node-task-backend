let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_subscriptions', () => {
  it('it should create  new  pos_subscriptions ', (done) => {
    chai.request(server)
      .post('/api/pos-subscriptions')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_subscriptions  data', () => {
  it('it should GET all the pos_subscriptions', (done) => {
    chai.request(server)
      .get('/api/pos-subscriptions')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_subscriptions by id', () => {
  it('it should GET all the pos_subscriptions', (done) => {
    chai.request(server)
      .get('/api/pos-subscriptions/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_subscriptions', () => {
  it('it should update pos_subscriptions with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-subscriptions/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_subscriptions with paginate', () => {
  it('it should get  pos_subscriptions with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-subscriptions/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_subscriptions', () => {
  it('it should delete    pos_subscriptions ', (done) => {
    chai.request(server)
      .delete('/api/pos-subscriptions/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


