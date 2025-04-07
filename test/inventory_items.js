let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  inventory_items', () => {
  it('it should create  new  inventory_items ', (done) => {
    chai.request(server)
      .post('/api/inventory-items')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  inventory_items  data', () => {
  it('it should GET all the inventory_items', (done) => {
    chai.request(server)
      .get('/api/inventory-items')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get inventory_items by id', () => {
  it('it should GET all the inventory_items', (done) => {
    chai.request(server)
      .get('/api/inventory-items/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update inventory_items', () => {
  it('it should update inventory_items with the id ', (done) => {
    chai.request(server)
      .put('/api/inventory-items/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   inventory_items with paginate', () => {
  it('it should get  inventory_items with paginate ', (done) => {
    chai.request(server)
      .post('/api/inventory-items/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  inventory_items', () => {
  it('it should delete    inventory_items ', (done) => {
    chai.request(server)
      .delete('/api/inventory-items/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


