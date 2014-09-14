var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// Use to serve stuff from /public
app.use(express.static(__dirname + '/public'));

// Bullshit stuff you need to get express working with POSTed form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", function(req, res) {
  res.send(req.body);
});

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

