let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  main_chart_of_account', () => {
  it('it should create  new  main_chart_of_account ', (done) => {
    chai.request(server)
      .post('/api/main-chart-of-account')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  main_chart_of_account  data', () => {
  it('it should GET all the main_chart_of_account', (done) => {
    chai.request(server)
      .get('/api/main-chart-of-account')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get main_chart_of_account by id', () => {
  it('it should GET all the main_chart_of_account', (done) => {
    chai.request(server)
      .get('/api/main-chart-of-account/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update main_chart_of_account', () => {
  it('it should update main_chart_of_account with the id ', (done) => {
    chai.request(server)
      .put('/api/main-chart-of-account/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   main_chart_of_account with paginate', () => {
  it('it should get  main_chart_of_account with paginate ', (done) => {
    chai.request(server)
      .post('/api/main-chart-of-account/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  main_chart_of_account', () => {
  it('it should delete    main_chart_of_account ', (done) => {
    chai.request(server)
      .delete('/api/main-chart-of-account/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


