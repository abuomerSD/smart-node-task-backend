let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  categories', () => {
  it('it should create  new  categories ', (done) => {
    chai.request(server)
      .post('/api/categories')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  categories  data', () => {
  it('it should GET all the categories', (done) => {
    chai.request(server)
      .get('/api/categories')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get categories by id', () => {
  it('it should GET all the categories', (done) => {
    chai.request(server)
      .get('/api/categories/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update categories', () => {
  it('it should update categories with the id ', (done) => {
    chai.request(server)
      .put('/api/categories/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   categories with paginate', () => {
  it('it should get  categories with paginate ', (done) => {
    chai.request(server)
      .post('/api/categories/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  categories', () => {
  it('it should delete    categories ', (done) => {
    chai.request(server)
      .delete('/api/categories/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


