let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_station_floor_tables', () => {
  it('it should create  new  pos_station_floor_tables ', (done) => {
    chai.request(server)
      .post('/api/pos-station-floor-tables')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_station_floor_tables  data', () => {
  it('it should GET all the pos_station_floor_tables', (done) => {
    chai.request(server)
      .get('/api/pos-station-floor-tables')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_station_floor_tables by id', () => {
  it('it should GET all the pos_station_floor_tables', (done) => {
    chai.request(server)
      .get('/api/pos-station-floor-tables/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_station_floor_tables', () => {
  it('it should update pos_station_floor_tables with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-station-floor-tables/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_station_floor_tables with paginate', () => {
  it('it should get  pos_station_floor_tables with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-station-floor-tables/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_station_floor_tables', () => {
  it('it should delete    pos_station_floor_tables ', (done) => {
    chai.request(server)
      .delete('/api/pos-station-floor-tables/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


