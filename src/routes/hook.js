var express = require('express');
var router = express.Router();
const queue = require('fastq').promise(worker, 1);
const { spawnSync } = require('child_process');

async function worker(arg) {
    try {
        console.log("In worker", arg);
        let cd = spawnSync('git', ['pull', 'origin', arg.git_branch], { cwd: arg.dir });
        return cd;
    } catch (error) {
        return error;
    }
}

/* POST home page. */
router.post('/', async function (req, res, next) {
    try {
        var projects = req.app.get('projects');
        // console.log(req.body);
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
                console.log("Out worker:", result.stdout.toString());
            }
        }
    } catch (error) {
        console.log(error.message);
    } finally {
        return res.send({ 'message': 'Received' });
    }
});


module.exports = router;
