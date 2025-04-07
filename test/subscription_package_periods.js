let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  subscription_package_periods', () => {
  it('it should create  new  subscription_package_periods ', (done) => {
    chai.request(server)
      .post('/api/subscription-package-periods')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  subscription_package_periods  data', () => {
  it('it should GET all the subscription_package_periods', (done) => {
    chai.request(server)
      .get('/api/subscription-package-periods')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get subscription_package_periods by id', () => {
  it('it should GET all the subscription_package_periods', (done) => {
    chai.request(server)
      .get('/api/subscription-package-periods/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update subscription_package_periods', () => {
  it('it should update subscription_package_periods with the id ', (done) => {
    chai.request(server)
      .put('/api/subscription-package-periods/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   subscription_package_periods with paginate', () => {
  it('it should get  subscription_package_periods with paginate ', (done) => {
    chai.request(server)
      .post('/api/subscription-package-periods/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  subscription_package_periods', () => {
  it('it should delete    subscription_package_periods ', (done) => {
    chai.request(server)
      .delete('/api/subscription-package-periods/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


