process.env.NODE_ENV = 'test';

const sinon = require('sinon');
const request = require('request');
const chai = require('chai');
const should = chai.should();

const movies = require('./fixtures/movies.json');

const base = 'http://localhost:1337';

describe('movie service', () => {

  describe.skip('when not stubbed', () => {
    describe('GET /api/v1/movies', () => {
      it('should return all movies', (done) => {
        request.get(`${base}/api/v1/movies`, (err, res, body) => {
          // there should be a 200 status code
          res.statusCode.should.eql(200);
          // the response should be JSON
          res.headers['content-type'].should.contain('application/json');
          // parse response body
          body = JSON.parse(body);
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": [3 movie objects]}
          body.data.length.should.eql(3);
          // the first object in the data array should
          // have the right keys
          body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          );
          // the first object should have the right value for name
          body.data[0].name.should.eql('The Land Before Time');
          done();
        });
      });
    });
    describe('GET /api/v1/movies/:id', () => {
      it('should respond with a single movie', (done) => {
        request.get(`${base}/api/v1/movies/4`, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          );
          body.data[0].name.should.eql('The Land Before Time');
          done();
        });
      });
      it('should throw an error if the movie does not exist', (done) => {
        request.get(`${base}/api/v1/movies/999`, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That movie does not exist.');
          done();
        });
      });
    });
    describe('POST /api/v1/movies', () => {
      it('should return the movie that was added', (done) => {
        const options = {
          method: 'post',
          body: {
            name: 'Titanic',
            genre: 'Drama',
            rating: 8,
            explicit: true
          },
          json: true,
          url: `${base}/api/v1/movies`
        };
        request(options, (err, res, body) => {
          res.statusCode.should.equal(201);
          res.headers['content-type'].should.contain('application/json');
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          );
          done();
        });
      });
    });
  });

  describe('when stubbed', () => {

    beforeEach(() => {
      this.get = sinon.stub(request, 'get');
      this.post = sinon.stub(request, 'post');
      this.put = sinon.stub(request, 'put');
      this.delete = sinon.stub(request, 'delete');
    });

    afterEach(() => {
      request.get.restore();
      request.post.restore();
      request.put.restore();
      request.delete.restore();
    });

    describe('GET /api/v1/movies', () => {
      it('should return all movies', (done) => {
        this.get.yields(
          null, movies.all.success.res, JSON.stringify(movies.all.success.body)
        );
        request.get(`${base}/api/v1/movies`, (err, res, body) => {
          // there should be a 200 status code
          res.statusCode.should.eql(200);
          // the response should be JSON
          res.headers['content-type'].should.contain('application/json');
          // parse response body
          body = JSON.parse(body);
          // the JSON response body should have a
          // key-value pair of {"status": "success"}
          body.status.should.eql('success');
          // the JSON response body should have a
          // key-value pair of {"data": [3 movie objects]}
          body.data.length.should.eql(3);
          // the first object in the data array should
          // have the right keys
          body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          );
          // the first object should have the right value for name
          body.data[0].name.should.eql('The Land Before Time');
          done();
        });
      });
    });
    describe('GET /api/v1/movies/:id', () => {
      it('should respond with a single movie', (done) => {
        const obj = movies.single.success;
        this.get.yields(null, obj.res, JSON.stringify(obj.body));
        request.get(`${base}/api/v1/movies/4`, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          );
          body.data[0].name.should.eql('The Land Before Time');
          done();
        });
      });
      it('should throw an error if the movie does not exist', (done) => {
        const obj = movies.single.failure;
        this.get.yields(null, obj.res, JSON.stringify(obj.body));
        request.get(`${base}/api/v1/movies/999`, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That movie does not exist.');
          done();
        });
      });
    });
    describe('POST /api/v1/movies', () => {
      it('should return the movie that was added', (done) => {
        const options = {
          body: {
            name: 'Titanic',
            genre: 'Drama',
            rating: 8,
            explicit: true
          },
          json: true,
          url: `${base}/api/v1/movies`
        };
        const obj = movies.add.success;
        this.post.yields(null, obj.res, JSON.stringify(obj.body));
        request.post(options, (err, res, body) => {
          res.statusCode.should.equal(201);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          );
          body.data[0].name.should.eql('Titanic');
          done();
        });
      });
      it('should throw an error if the payload is malformed', (done) => {
        const options = {
          body: { name: 'Titanic' },
          json: true,
          url: `${base}/api/v1/movies`
        };
        const obj = movies.add.failure;
        this.post.yields(null, obj.res, JSON.stringify(obj.body));
        request.post(options, (err, res, body) => {
          res.statusCode.should.equal(400);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          should.exist(body.message);
          done();
        });
      });
    });
    describe('PUT /api/v1/movies', () => {
      it('should return the movie that was updated', (done) => {
        const options = {
          body: { rating: 9 },
          json: true,
          url: `${base}/api/v1/movies/5`
        };
        const obj = movies.update.success;
        this.put.yields(null, obj.res, JSON.stringify(obj.body));
        request.put(options, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          );
          body.data[0].name.should.eql('Titanic');
          body.data[0].rating.should.eql(9);
          done();
        });
      });
      it('should throw an error if the movie does not exist', (done) => {
        const options = {
          body: { rating: 9 },
          json: true,
          url: `${base}/api/v1/movies/5`
        };
        const obj = movies.update.failure;
        this.put.yields(null, obj.res, JSON.stringify(obj.body));
        request.put(options, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That movie does not exist.');
          done();
        });
      });
    });
    describe('DELETE /api/v1/movies/:id', () => {
      it('should return the movie that was deleted', (done) => {
        const obj = movies.delete.success;
        this.delete.yields(null, obj.res, JSON.stringify(obj.body));
        request.delete(`${base}/api/v1/movies/5`, (err, res, body) => {
          res.statusCode.should.equal(200);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('success');
          body.data[0].should.include.keys(
            'id', 'name', 'genre', 'rating', 'explicit'
          );
          body.data[0].name.should.eql('Titanic');
          done();
        });
      });
      it('should throw an error if the movie does not exist', (done) => {
        const obj = movies.delete.failure;
        this.delete.yields(null, obj.res, JSON.stringify(obj.body));
        request.delete(`${base}/api/v1/movies/5`, (err, res, body) => {
          res.statusCode.should.equal(404);
          res.headers['content-type'].should.contain('application/json');
          body = JSON.parse(body);
          body.status.should.eql('error');
          body.message.should.eql('That movie does not exist.');
          done();
        });
      });
    });

  });

});
