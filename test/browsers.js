let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  browsers', () => {
  it('it should create  new  browsers ', (done) => {
    chai.request(server)
      .post('/api/browsers')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  browsers  data', () => {
  it('it should GET all the browsers', (done) => {
    chai.request(server)
      .get('/api/browsers')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get browsers by id', () => {
  it('it should GET all the browsers', (done) => {
    chai.request(server)
      .get('/api/browsers/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update browsers', () => {
  it('it should update browsers with the id ', (done) => {
    chai.request(server)
      .put('/api/browsers/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   browsers with paginate', () => {
  it('it should get  browsers with paginate ', (done) => {
    chai.request(server)
      .post('/api/browsers/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  browsers', () => {
  it('it should delete    browsers ', (done) => {
    chai.request(server)
      .delete('/api/browsers/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


