let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_products', () => {
  it('it should create  new  pos_products ', (done) => {
    chai.request(server)
      .post('/api/pos-products')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_products  data', () => {
  it('it should GET all the pos_products', (done) => {
    chai.request(server)
      .get('/api/pos-products')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_products by id', () => {
  it('it should GET all the pos_products', (done) => {
    chai.request(server)
      .get('/api/pos-products/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_products', () => {
  it('it should update pos_products with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-products/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_products with paginate', () => {
  it('it should get  pos_products with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-products/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_products', () => {
  it('it should delete    pos_products ', (done) => {
    chai.request(server)
      .delete('/api/pos-products/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


