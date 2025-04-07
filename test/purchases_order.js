let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  purchases_order', () => {
  it('it should create  new  purchases_order ', (done) => {
    chai.request(server)
      .post('/api/purchases-order')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  purchases_order  data', () => {
  it('it should GET all the purchases_order', (done) => {
    chai.request(server)
      .get('/api/purchases-order')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get purchases_order by id', () => {
  it('it should GET all the purchases_order', (done) => {
    chai.request(server)
      .get('/api/purchases-order/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update purchases_order', () => {
  it('it should update purchases_order with the id ', (done) => {
    chai.request(server)
      .put('/api/purchases-order/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   purchases_order with paginate', () => {
  it('it should get  purchases_order with paginate ', (done) => {
    chai.request(server)
      .post('/api/purchases-order/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  purchases_order', () => {
  it('it should delete    purchases_order ', (done) => {
    chai.request(server)
      .delete('/api/purchases-order/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


