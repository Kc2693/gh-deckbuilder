const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const { app, database } = require('../server');

chai.use(chaiHttp);

describe.skip('client routes', () => {
  it('should return the homepage', (done) => {
    chai.request(app)
      .get('/')
      .then(response => {
        response.should.have.status(200);
        response.should.be.html;
        done()
      })
  });

  it('should return a 404 for a route that doesnt exist', (done) => {
    chai.request(app)
      .get('/sadpath')
      .then(response => {
        response.should.have.status(404);
        done()
      })
  })
})

describe('API Routes', () => {
  beforeEach(done => {
  database.migrate.rollback().then(() => {
      database.migrate.latest().then(() => {
        return database.seed.run().then(() => {
          done();
        });
      });
    });
  });

  it.skip('should GET all the cards', (done) => {
    chai.request(app)
      .get('/api/v1/cards')
      .end((error, response) => {
        response.should.be.json
        response.should.have.status(200)
        response.body.should.be.an('array')
        response.body.length.should.equal(174)
        response.body[0].should.have.property('id', 1);
        response.body[0].should.have.property('class', 'Brute');
        response.body[0].should.have.property('name');
        response.body[0].should.have.property('initiative');
        response.body[0].should.have.property('top_action');
        response.body[0].should.have.property('bottom_action');
        response.body[0].should.have.property('image_url');
        response.body[0].should.have.property('card_level', 1);
        done()
      })
  })

  describe("GET cards by :class", () => {
    it("should GET all cards of a specified class", (done) => {
      chai.request(app)
        .get('/api/v1/cards/Mindthief')
        .end((error, response) => {
          response.should.be.json
          response.should.have.status(200);
          response.body.should.be.an('array');
          response.body.length.should.equal(29);
          // response.body[0].should.have.property('id', 66);
          response.body[0].should.have.property('class', 'Mindthief');
          response.body[0].should.have.property('name');
          response.body[0].should.have.property('initiative');
          response.body[0].should.have.property('top_action');
          response.body[0].should.have.property('bottom_action');
          response.body[0].should.have.property('image_url');
          response.body[0].should.have.property('card_level', 1);
          done();
        })
    });

    it("should give a 404 and a 'no matches found message' if there is no specified class", (done) => {
      chai.request(app)
        .get('/api/v1/cards/Kittens')
        .end((error, response) => {
          response.should.be.json
          response.should.have.status(404);
          response.body.should.equal('No matches found')
          done();
        })
    });
  });

  describe("GET all decks by id", () => {
    it("should GET deck by specified ID", (done) => {
      chai.request(app)
        .get('/api/v1/decks/1')
        .end((error, response) => {
          response.should.be.json
          response.should.have.status(200);
          response.body.should.be.an('object');
          response.body.should.have.property('name', 'Brute Deck');
          response.body.should.have.property('cards');
          response.body.cards.should.be.an('array');
          response.body.cards.length.should.equal(10);
          done();
        })
    });

    it("should return a 404 if there is no deck by specified ID", (done) => {
      chai.request(app)
        .get('/api/v1/decks/100')
        .end((error, response) => {
          response.should.be.json
          response.should.have.status(404);
          response.body.should.equal('No matching decks found.');
          done();
        })
    });

    it.only("should return a 404 if there is no deck by specified ID in joins table", (done) => {
      chai.request(app)
        .get('/api/v1/decks/3')
        .end((error, response) => {
          response.should.be.json
          response.should.have.status(404);
          response.body.should.equal('No matching cards found.');
          done();
        })
    });
  });

  describe("POST to decks", () => {
    it("should post new deck if successful", (done) => {
      chai.request(app)
          .post('/api/v1/decks')
          .send({
            name: 'Ultra Mega Awesome Tinkerer',
            cards: [144, 145, 146, 147, 148, 149, 150],
          })
          .end((err, response) => {
            console.log(response.body);
            response.should.have.status(201);
            response.should.be.json;
            response.body.should.be.an('object');
            response.body.should.have.property('id');
            response.body.id.should.equal(4);
            done();
          });
    });
  });
});
