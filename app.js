var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var sqlite3 = require('sqlite3').verbose();

var databaseName = "songs.db";

var db = new sqlite3.Database(databaseName);
var insertStatement;
fs.exists(databaseName, function (exists) {
	if (!exists) {
		db.run("CREATE TABLE song (song_name TEXT, song_file BLOB)",
			function(err) {
				insertStatement = db.prepare("INSERT INTO song VALUES (?, ?)");
			}
		);
	} else {
		insertStatement = db.prepare("INSERT INTO song VALUES (?, ?)");
	}
});

var app = express();

// Use to serve stuff from /public
app.use(express.static(__dirname + '/public'));

// Bullshit stuff you need to get express working with POSTed form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", function(req, res) {
	insertStatement.run(req.body.username, function (){
		res.send(req.body);
	});
});

app.get("/log", function (req, res) {
	var things = [];

	db.each("SELECT song_name FROM song",
		function(err, row) { // Each Row
			things.push(row);
		},
		function(err, n) { // Statement completion
			res.send(things);
		}
	);
})

var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});
