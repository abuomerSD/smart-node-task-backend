let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_price_list_products', () => {
  it('it should create  new  pos_price_list_products ', (done) => {
    chai.request(server)
      .post('/api/pos-price-list-products')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_price_list_products  data', () => {
  it('it should GET all the pos_price_list_products', (done) => {
    chai.request(server)
      .get('/api/pos-price-list-products')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_price_list_products by id', () => {
  it('it should GET all the pos_price_list_products', (done) => {
    chai.request(server)
      .get('/api/pos-price-list-products/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_price_list_products', () => {
  it('it should update pos_price_list_products with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-price-list-products/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_price_list_products with paginate', () => {
  it('it should get  pos_price_list_products with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-price-list-products/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_price_list_products', () => {
  it('it should delete    pos_price_list_products ', (done) => {
    chai.request(server)
      .delete('/api/pos-price-list-products/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


