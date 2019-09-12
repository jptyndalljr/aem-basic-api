var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'aem-basic.c9gbtoeqz9gv.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'Luckie123!',
  database: 'aem-basic'
});

connection.connect();

/* GET sites listing. */
router.get('/', function(req, res, next) {
  connection.query('SELECT * FROM sites', function(err, rows, fields) {
    if (err) throw err;
    var sites = {};
    for (var i = 0; i < rows.length; i++) {
      var isBasic = rows[i].basic == 1 ? true : false;
      sites[i] = {
        siteName: rows[i].name,
        isBasic: isBasic
      };
    }
    res.send(sites);
  });
});

/* POST new site */
router.post('/', function(req, res, next) {
  if (req.query.name) {
    console.log('creating new site: ' + req.query.name);
    connection.query('INSERT INTO sites VALUES (null, "' + req.query.name + '", DEFAULT)', function(err, rows, fields) {
      if (err) throw err;
    });
    res.sendStatus(200);
  }
  else {
    res.status(404).send("Invalid user input: Must provide a value for key 'name'");
  }
});

/* GET site by name */
router.get('/:name', function(req, res, next) {
  if (req.params.name) {
    connection.query('SELECT * FROM sites WHERE name = "' + req.params.name + '"', function(err, rows, fields) {
      if (err) throw err;
      res.send(rows);
    });
  }
});

/* PUT site into or out of basic */
router.put('/:name', function(req, res) {
  console.log(req.query.basic);
  if (req.query.basic) {
    connection.query('UPDATE sites SET basic=' + req.query.basic + ' WHERE name="' + req.params.name + '"', function(err, rows, fields) {
      if (err) throw err;
      res.sendStatus(200);
    });
  }
  else {
    res.status(404).send("Invalid user input: Must provide a value for key 'basic'");
  }
});

module.exports = router;
