let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  purchases_order_detailes', () => {
  it('it should create  new  purchases_order_detailes ', (done) => {
    chai.request(server)
      .post('/api/purchases-order-detailes')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  purchases_order_detailes  data', () => {
  it('it should GET all the purchases_order_detailes', (done) => {
    chai.request(server)
      .get('/api/purchases-order-detailes')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get purchases_order_detailes by id', () => {
  it('it should GET all the purchases_order_detailes', (done) => {
    chai.request(server)
      .get('/api/purchases-order-detailes/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update purchases_order_detailes', () => {
  it('it should update purchases_order_detailes with the id ', (done) => {
    chai.request(server)
      .put('/api/purchases-order-detailes/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   purchases_order_detailes with paginate', () => {
  it('it should get  purchases_order_detailes with paginate ', (done) => {
    chai.request(server)
      .post('/api/purchases-order-detailes/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  purchases_order_detailes', () => {
  it('it should delete    purchases_order_detailes ', (done) => {
    chai.request(server)
      .delete('/api/purchases-order-detailes/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


