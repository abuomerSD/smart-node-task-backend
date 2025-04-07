let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_stations_price_list', () => {
  it('it should create  new  pos_stations_price_list ', (done) => {
    chai.request(server)
      .post('/api/pos-stations-price-list')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_stations_price_list  data', () => {
  it('it should GET all the pos_stations_price_list', (done) => {
    chai.request(server)
      .get('/api/pos-stations-price-list')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_stations_price_list by id', () => {
  it('it should GET all the pos_stations_price_list', (done) => {
    chai.request(server)
      .get('/api/pos-stations-price-list/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_stations_price_list', () => {
  it('it should update pos_stations_price_list with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-stations-price-list/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_stations_price_list with paginate', () => {
  it('it should get  pos_stations_price_list with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-stations-price-list/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_stations_price_list', () => {
  it('it should delete    pos_stations_price_list ', (done) => {
    chai.request(server)
      .delete('/api/pos-stations-price-list/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


