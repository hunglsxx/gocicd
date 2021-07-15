var express = require('express');
var router = express.Router();

/* POST home page. */
router.post('/', function (req, res, next) {
	var projects = req.app.get('projects');
	console.log("POST", req.body);
	res.render('index', { title: 'Hook' });
});


/* GET home page. */
router.get('/', function (req, res, next) {
	var projects = req.app.get('projects');
	console.log("GET", req.params);
	res.render('index', { title: 'Hook' });
});

module.exports = router;
