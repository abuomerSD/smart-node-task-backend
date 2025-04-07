let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  sale_orders', () => {
  it('it should create  new  sale_orders ', (done) => {
    chai.request(server)
      .post('/api/sale-orders')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  sale_orders  data', () => {
  it('it should GET all the sale_orders', (done) => {
    chai.request(server)
      .get('/api/sale-orders')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get sale_orders by id', () => {
  it('it should GET all the sale_orders', (done) => {
    chai.request(server)
      .get('/api/sale-orders/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update sale_orders', () => {
  it('it should update sale_orders with the id ', (done) => {
    chai.request(server)
      .put('/api/sale-orders/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   sale_orders with paginate', () => {
  it('it should get  sale_orders with paginate ', (done) => {
    chai.request(server)
      .post('/api/sale-orders/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  sale_orders', () => {
  it('it should delete    sale_orders ', (done) => {
    chai.request(server)
      .delete('/api/sale-orders/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


