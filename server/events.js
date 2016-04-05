var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var db = require('./db');

//api routes
router.post('/', submitEvent);
router.post('/clear', clearEvents);
router.get('/', getEventsInRange);
router.get('/summary', getEventSummary);

//SUBMIT EVENT 
function submitEvent (req, res) {
  var event = req.body; 
  
  var message = event.message || null;
  var otheruser = event.otheruser || null;

  var event = db.Event({
    date: event.date,
    user: event.user,
    type: event.type,
    message: message,
    otheruser: otheruser
  });

  event.save(function(err, event) {
    if (err) {
      console.log("error saving event: ", err);
      res.set('Content-Type', 'application/json');
      res.status(404).send({
        status: 'error'
      });
    }
    else {
      console.log('event was saved:', event);
      res.set('Content-Type', 'application/json');
      res.status(200).send({
        status: 'ok'
      });
    }
  });

}

//CLEAR DATA 
function clearEvents (req, res) {
  db.Event.remove( 
    function(err, removed) {
      if (err) {
        console.log("error clearing events: ", err);
        res.set('Content-Type', 'application/json');
        res.status(404).send({
          status: 'error'
        });
      } else {
        console.log('events were cleared');
        res.set('Content-Type', 'application/json');
        res.status(200).send({
          status: 'ok'
        });
      }
    }
  )
}


//LIST EVENTS WITHIN DATE RANGE
function getEventsInRange (req, res) {
  console.log('in GET /events with dates');
  var startDate = req.query.from;
  var endDate = req.query.to;

  db.Event.aggregate([
    { $match: {date: {$lte: endDate, $gte: startDate } } },
    { $sort: { date: 1 } }
    ],
    function(err, events) {
      if (err) {
        console.log('error aggregating events in date range:', err)
        res.set('Content-Type', 'application/json');
        res.status(404).send({
          status: 'error'
        });
      } else {
        console.log('events aggregated within date range: ', events);

        function cleanData(results, cb) {
          for (var i = 0; i < results.length; i++){
            var result = results[i];
            delete result._id;
            delete result.__v;
            if (!result.message) {
              delete result.message;
            }
            if (!result.otheruser) {
              delete result.otheruser;
            }
          }
          cb();
        }

        cleanData(events, function() {
          res.set('Content-Type', 'application/json');
          res.status(200).send({
            events: events
          });
        })

      }
    }
  );
}

//EVENT SUMMARY
function getEventSummary (req, res) {
  console.log('in GET /event summary', req.query);
  var startDate = req.query.from;
  var endDate = req.query.to;
  var timeFrame = req.query.by;
  
  var formatDate = function (date, time) {
    function convertDateFromISO(s) {
      s = s.split(/\D/);
      return new Date(Date.UTC(s[0], --s[1]||'', s[2]||'', s[3]||'', s[4]||'', s[5]||'', s[6]||''))
    }

    var newDate = new Date(convertDateFromISO(date));

    if (time === 'day') {
      newDate.setHours(0,0,0);
    }
    if (time === 'hour') {
      newDate.setMinutes(0,0);
    }
    if (time === 'minute') {
      newDate.setSeconds(0);
    }

    var cleanDate = new Date(newDate);
    var finalDate = cleanDate.toISOString();
    console.log('finalDATE: ', finalDate);
    var cut = finalDate.substr(0, 19) + "Z";
    console.log('cut dATE: ', cut);
    return cut;
  }

  db.Event.aggregate([
    { $match: {date: {$lte: endDate, $gte: startDate } } },
    { $sort: { date: 1 } }
    ],
    function(err, events) {
      if (err) {
        console.log('error getting event summary', err);
        res.set('Content-Type', 'application/json');
        res.status(404).send({
          status: 'error'
        });
      } else {
        //populate storage by counting event types
        var storage = {};

        function countEvents(event, type) {
          if (event.type === type) {
            storage[rolledDate][type+'s'] = storage[rolledDate][type+'s']++ || 1;
          }
        }

        for (var i = 0; i < events.length; i++) {
          var ev = events[i];
          var rolledDate = formatDate(ev["date"], timeFrame);
          storage[rolledDate] = storage[rolledDate] || {};
          countEvents(ev, 'enter');
          countEvents(ev, 'leave');
          countEvents(ev, 'comment');
          countEvents(ev, 'highfive');
        }
        
        //push storage into results in right format
        var results = [];

        function formatResult (type) {
          if (storage[key][type]) {
            temp[type] = storage[key][type];
          } else {
            temp[type] = 0;
          }
        }

        for (var key in storage) {
          var temp = {};
          temp['date'] = key;
          formatResult('enters');
          formatResult('leaves');
          formatResult('comments');
          formatResult('highfives');
          results.push(temp);
        }

        res.set('Content-Type', 'application/json');
        res.status(200).send({
          events: results
        });
      }
    }
  );

}

module.exports = router;