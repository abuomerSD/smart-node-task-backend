let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_stations', () => {
  it('it should create  new  pos_stations ', (done) => {
    chai.request(server)
      .post('/api/pos-stations')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_stations  data', () => {
  it('it should GET all the pos_stations', (done) => {
    chai.request(server)
      .get('/api/pos-stations')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_stations by id', () => {
  it('it should GET all the pos_stations', (done) => {
    chai.request(server)
      .get('/api/pos-stations/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_stations', () => {
  it('it should update pos_stations with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-stations/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_stations with paginate', () => {
  it('it should get  pos_stations with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-stations/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_stations', () => {
  it('it should delete    pos_stations ', (done) => {
    chai.request(server)
      .delete('/api/pos-stations/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


