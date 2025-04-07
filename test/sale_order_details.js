let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  sale_order_details', () => {
  it('it should create  new  sale_order_details ', (done) => {
    chai.request(server)
      .post('/api/sale-order-details')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  sale_order_details  data', () => {
  it('it should GET all the sale_order_details', (done) => {
    chai.request(server)
      .get('/api/sale-order-details')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get sale_order_details by id', () => {
  it('it should GET all the sale_order_details', (done) => {
    chai.request(server)
      .get('/api/sale-order-details/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update sale_order_details', () => {
  it('it should update sale_order_details with the id ', (done) => {
    chai.request(server)
      .put('/api/sale-order-details/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   sale_order_details with paginate', () => {
  it('it should get  sale_order_details with paginate ', (done) => {
    chai.request(server)
      .post('/api/sale-order-details/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  sale_order_details', () => {
  it('it should delete    sale_order_details ', (done) => {
    chai.request(server)
      .delete('/api/sale-order-details/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


