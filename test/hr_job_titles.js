let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
chai.use(chaiHttp)


describe('/can  create  hr_job_titles', () => {
  it('it should create  new  hr_job_titles ', (done) => {
    chai.request(server)
      .post('/api/hr-job-titles')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get all  hr_job_titles  data', () => {
  it('it should GET all the hr_job_titles', (done) => {
    chai.request(server)
      .get('/api/hr-job-titles')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can get hr_job_titles by id', () => {
  it('it should GET all the hr_job_titles', (done) => {
    chai.request(server)
      .get('/api/hr-job-titles/1')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});
describe('/can  update hr_job_titles', () => {
  it('it should update hr_job_titles with the id ', (done) => {
    chai.request(server)
      .put('/api/hr-job-titles/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  get   hr_job_titles with paginate', () => {
  it('it should get  hr_job_titles with paginate ', (done) => {
    chai.request(server)
      .post('/api/hr-job-titles/paginate')
      .send({limit: 20,page:1})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});

describe('/can  delete  hr_job_titles', () => {
  it('it should delete    hr_job_titles ', (done) => {
    chai.request(server)
      .delete('/api/hr-job-titles/1')
      .send({name: "name"})
      .end((err, res) => {
        res.should.have.status(200);
        res.body.status.should.eql(true); done();
      });
  });
});


