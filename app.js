var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var lame = require('lame');
var Speaker = require('speaker');
var sqlite3 = require('sqlite3').verbose();
var formidable = require('formidable');

var databaseName = "songs.db";
var db = new sqlite3.Database(databaseName);
var insertStatement;

// Create our database table
db.run("CREATE TABLE IF NOT EXISTS song (song_name TEXT, song_file BLOB)",
	function(err) {
		if (err) {
			throw err;
		}

		insertStatement = db.prepare("INSERT INTO song VALUES (?, ?)");
	}
);

var app = express();

// Use to serve stuff from /public
app.use(express.static(__dirname + '/public'));

// Bullshit stuff you need to get express working with POSTed form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to upload songs. Only handles one file at the moment
app.post("/uploadsong", function(req, res) {
	var form = new formidable.IncomingForm();

	form.parse(req, function(err, fields, files) {
		console.log("Received " + files.song.name);
		fs.readFile(files.song.path, function (err, data) {
			if (err) {
				throw err;
			}

			// Insert song into the database
			insertStatement.run(files.song.name, data, function() {
				res.send(req.body);
			});
		});
	});
});

// Returns a list of song names in the database
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

// Just returns the first file uploaded to the database as a test
app.get("/firstsong", function (req, res) {
	db.each("SELECT song_file FROM song where oid = 1",
		function(err, row) { // Each Row
			res.send(row.song_file);
		},
		function(err, n) { // Statement completion

		}
	);
})

// Start the server on port 3000
var server = app.listen(3000, function() {
	console.log('Listening on port %d', server.address().port);
});
