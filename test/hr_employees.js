let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  hr_employees', () => {
  it('it should create  new  hr_employees ', (done) => {
    chai.request(server)
      .post('/api/hr-employees')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  hr_employees  data', () => {
  it('it should GET all the hr_employees', (done) => {
    chai.request(server)
      .get('/api/hr-employees')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get hr_employees by id', () => {
  it('it should GET all the hr_employees', (done) => {
    chai.request(server)
      .get('/api/hr-employees/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update hr_employees', () => {
  it('it should update hr_employees with the id ', (done) => {
    chai.request(server)
      .put('/api/hr-employees/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   hr_employees with paginate', () => {
  it('it should get  hr_employees with paginate ', (done) => {
    chai.request(server)
      .post('/api/hr-employees/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  hr_employees', () => {
  it('it should delete    hr_employees ', (done) => {
    chai.request(server)
      .delete('/api/hr-employees/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


