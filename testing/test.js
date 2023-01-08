//During the test the env variable is set to test
process.env.NODE_ENV = 'test';
process.env.EXPRESS_PORT = 3001;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server/index.js');
let should = chai.should();
const sample = require('./sample.js');


chai.use(chaiHttp);

describe('Reviews', () => {

  /* Test the /GET review route */
  describe('/GET reviews', () => {
    it('it should GET all reviews with default page=1, count=5', (done) => {
      chai.request(server)
        .get('/reviews/1/list')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.page.should.eql(1);
          res.body.count.should.eql(5);
          Array.isArray(res.body.results).should.eql(true);
          done();
        })
    });
  });

  /* Test API Endpoints */
  describe('Test API Endpoints', () => {

    /* Test the /POST route */
    let added_review_id;
    it('/POST reviews: it should save new review with product_id=1 to the database', (done) => {
      chai.request(server)
        .post('/reviews/1')
        .send(sample)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.review_id.should.not.eql(null);
          added_review_id = res.body.review_id;
          done();
        })
    });

    /* Test the /DELETE route */
    it('/DELETE reviews: it should delete a review given an id from the database', (done) => {
      chai.request(server)
        .delete(`/reviews/${added_review_id}`)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        });
    });

    /* Test the /PUT route */
    it('/PUT reviews: it should mark a review as helpful', (done) => {
      chai.request(server)
        .put(`/reviews/${added_review_id}/helpful`)
        .end((err, res) => {
          res.should.have.status(204);
          done();
        })
    });

    it('/PUT reviews: it should mark a review as reported', (done) => {
      chai.request(server)
        .put(`/reviews/${added_review_id}/report`)
        .end((err, res) => {
          res.should.have.status(204);
          done();
      })
    });

    it('/PUT reviews: reported review should not appear in the reviews list with /GET request', (done) => {
      chai.request(server)
        .get('/reviews/1/list')
        .end((err, res) => {
          res.should.have.status(200)
          let reported = res.body.results[0]
          reported.review_id.should.not.eql(added_review_id)
          done()
        })
    })

    /* Test the /GET meta route */
    it('/GET meta: it should get meta data for a given product', (done) => {
      chai.request(server)
        .get('/reviews/1/meta')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('ratings');
          res.body.should.have.property('recommended');
          res.body.should.have.property('characteristics');
          Array.isArray(res.body.characteristics).should.eql(false);
          done();
        })
    });

  });
});