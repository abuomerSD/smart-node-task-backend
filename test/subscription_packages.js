let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  subscription_packages', () => {
  it('it should create  new  subscription_packages ', (done) => {
    chai.request(server)
      .post('/api/subscription-packages')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  subscription_packages  data', () => {
  it('it should GET all the subscription_packages', (done) => {
    chai.request(server)
      .get('/api/subscription-packages')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get subscription_packages by id', () => {
  it('it should GET all the subscription_packages', (done) => {
    chai.request(server)
      .get('/api/subscription-packages/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update subscription_packages', () => {
  it('it should update subscription_packages with the id ', (done) => {
    chai.request(server)
      .put('/api/subscription-packages/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   subscription_packages with paginate', () => {
  it('it should get  subscription_packages with paginate ', (done) => {
    chai.request(server)
      .post('/api/subscription-packages/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  subscription_packages', () => {
  it('it should delete    subscription_packages ', (done) => {
    chai.request(server)
      .delete('/api/subscription-packages/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


