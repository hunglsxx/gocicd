var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
const dirTree = require("directory-tree");

/* GET home page. */
router.get('/', function (req, res, next) {
	var dir = path.join(__dirname, '../', 'public') + '/logs';
	var files = [];
	var html = "";
	if (fs.existsSync(dir)) {
		const tree = dirTree(dir);
		if (tree.children && tree.children.length) {
			for (var ch in tree.children) {
				var child = tree.children[ch];
				if (child.name) {
					files.push(child.name);
				}
			}
		}
	}

	if (files.length) {
		files.sort().reverse();
		for (var i in files) {
			html += '<li><a target="_blank" href="/static/logs/' + files[i] + '">' + files[i] + '</a></li>';
		}
		html = '<ul>' + html + '</ul>';
	}
	return res.render('log', { html: html });
});

module.exports = router;
