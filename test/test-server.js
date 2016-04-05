
process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
var mongoose = require("mongoose");

var server = require('../server/server.js');
var Event = require("../server/db.js").Event;

var should = chai.should();
chai.use(chaiHttp);

describe("Tweeter server", function() {

  beforeEach(function(done){
    var newEvent = new Event({
      "date": "1985­10­26T09:00:00Z", 
      "user": "Doc", 
      "type": "enter"
    });
    newEvent.save(function(err) {
      done();
    });
  });

  afterEach(function(done){
    Event.collection.drop();
    done();
  });

  it("should add events on /events POST", function(done) {
    chai.request(server)
      .post('/events')
      .send( {"date": "1985­10­26T09:02:00Z", "user": "Marty", "type": "highfive", "otheruser": "Doc"} )
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        done();
      });
  });

  it('should list all events in date range on /events GET', function(done) {
    chai.request(server)
      .get('/events?from=1985­10­26T09:00:00Z&to=1985­10­27T09:00:00Z​')
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('events');
        res.body.events.should.be.a('array');
        res.body.events[0].should.have.property('date');
        res.body.events[0].should.have.property('user');
        res.body.events[0].should.have.property('type');
        res.body.events[0].date.should.equal('1985­10­26T09:00:00Z');
        res.body.events[0].user.should.equal('Doc');
        res.body.events[0].type.should.equal('enter');
        done();
      });
  });

  it('should list event summary on /events/summary GET', function(done) {
    chai.request(server)
      .get('/events/summary?from=1985­10­26T09:00:00Z&to=1985­10­27T09:00:00Z​&by=hour')
      .end(function(err, res){
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('events');
        res.body.events.should.be.a('array');
        res.body.events[0].should.have.property('date');
        res.body.events[0].should.have.property('enters');
        res.body.events[0].should.have.property('leaves');
        res.body.events[0].should.have.property('comments');
        res.body.events[0].should.have.property('highfives');
        res.body.events[0].date.should.equal('1985-10-26T09:00:00Z');
        res.body.events[0].enters.should.equal(1);
        res.body.events[0].leaves.should.equal(0);
        res.body.events[0].comments.should.equal(0);
        res.body.events[0].highfives.should.equal(0);
        done();
      });
  });

  it('should delete all events on /event/clear POST', function(done) {
    chai.request(server)
      .post('/events/clear')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        done();
      });
  });

});