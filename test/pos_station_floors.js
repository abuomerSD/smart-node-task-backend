let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_station_floors', () => {
  it('it should create  new  pos_station_floors ', (done) => {
    chai.request(server)
      .post('/api/pos-station-floors')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_station_floors  data', () => {
  it('it should GET all the pos_station_floors', (done) => {
    chai.request(server)
      .get('/api/pos-station-floors')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_station_floors by id', () => {
  it('it should GET all the pos_station_floors', (done) => {
    chai.request(server)
      .get('/api/pos-station-floors/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_station_floors', () => {
  it('it should update pos_station_floors with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-station-floors/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_station_floors with paginate', () => {
  it('it should get  pos_station_floors with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-station-floors/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_station_floors', () => {
  it('it should delete    pos_station_floors ', (done) => {
    chai.request(server)
      .delete('/api/pos-station-floors/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


