let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_kitchens', () => {
  it('it should create  new  pos_kitchens ', (done) => {
    chai.request(server)
      .post('/api/pos-kitchens')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_kitchens  data', () => {
  it('it should GET all the pos_kitchens', (done) => {
    chai.request(server)
      .get('/api/pos-kitchens')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_kitchens by id', () => {
  it('it should GET all the pos_kitchens', (done) => {
    chai.request(server)
      .get('/api/pos-kitchens/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_kitchens', () => {
  it('it should update pos_kitchens with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-kitchens/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_kitchens with paginate', () => {
  it('it should get  pos_kitchens with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-kitchens/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_kitchens', () => {
  it('it should delete    pos_kitchens ', (done) => {
    chai.request(server)
      .delete('/api/pos-kitchens/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


