var express = require('express');
var router = express.Router();
const queue = require('fastq').promise(worker, 1)

async function worker(arg) {
    console.log("In worker", arg);
    return arg;
}

/* POST home page. */
router.post('/', async function (req, res, next) {
    var projects = req.app.get('projects');
    console.log("POST", req.body);
    if (req.body
        && req.body.ref
        && req.body.project
        && req.body.project.git_http_url) {
        var refPath = req.body.ref.split('/');
        var gitBranch = refPath[refPath.length - 1];
        var cicdConfig;
        for (var i in projects) {
            if (projects[i].git_http_url == req.body.project.git_http_url
                && projects[i].git_branch == gitBranch) {
                cicdConfig = projects[i];
                break;
            }
        }
        if (cicdConfig) {
            const result = await queue.push(cicdConfig);
            console.log("Out worker:", result);
        }
    }
    res.render('index', { title: 'Hook' });
});


module.exports = router;
