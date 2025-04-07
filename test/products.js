let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  products', () => {
  it('it should create  new  products ', (done) => {
    chai.request(server)
      .post('/api/products')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  products  data', () => {
  it('it should GET all the products', (done) => {
    chai.request(server)
      .get('/api/products')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get products by id', () => {
  it('it should GET all the products', (done) => {
    chai.request(server)
      .get('/api/products/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update products', () => {
  it('it should update products with the id ', (done) => {
    chai.request(server)
      .put('/api/products/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   products with paginate', () => {
  it('it should get  products with paginate ', (done) => {
    chai.request(server)
      .post('/api/products/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  products', () => {
  it('it should delete    products ', (done) => {
    chai.request(server)
      .delete('/api/products/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


