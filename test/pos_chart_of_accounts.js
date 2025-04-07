let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  pos_chart_of_accounts', () => {
  it('it should create  new  pos_chart_of_accounts ', (done) => {
    chai.request(server)
      .post('/api/pos-chart-of-accounts')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  pos_chart_of_accounts  data', () => {
  it('it should GET all the pos_chart_of_accounts', (done) => {
    chai.request(server)
      .get('/api/pos-chart-of-accounts')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get pos_chart_of_accounts by id', () => {
  it('it should GET all the pos_chart_of_accounts', (done) => {
    chai.request(server)
      .get('/api/pos-chart-of-accounts/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update pos_chart_of_accounts', () => {
  it('it should update pos_chart_of_accounts with the id ', (done) => {
    chai.request(server)
      .put('/api/pos-chart-of-accounts/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   pos_chart_of_accounts with paginate', () => {
  it('it should get  pos_chart_of_accounts with paginate ', (done) => {
    chai.request(server)
      .post('/api/pos-chart-of-accounts/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  pos_chart_of_accounts', () => {
  it('it should delete    pos_chart_of_accounts ', (done) => {
    chai.request(server)
      .delete('/api/pos-chart-of-accounts/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


