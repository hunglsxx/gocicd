var express = require('express');
var router = express.Router();
const queue = require('fastq').promise(worker, 1);
const { spawnSync } = require('child_process');
var fs = require('fs');
var YAML = require('yaml');
var util = require('../util');

async function worker(arg) {
    try {
        //console.log("In worker", arg);
        let cd = spawnSync('git', ['pull', 'origin', arg.git_branch], { cwd: arg.dir });
        let yamlFile = `${arg.dir}/.go-ci.yml`;
        var results = {};
        if (fs.existsSync(yamlFile)) {
            const file = fs.readFileSync(yamlFile, 'utf8');
            const commandList = YAML.parse(file);
            const tests = await util.commandParse('test', arg.git_branch, commandList);
            const deploys = await util.commandParse('deploy', arg.git_branch, commandList);
            var testResult = await util.runScript(tests, arg);
            var deployResult = await util.runScript(deploys, arg);
            results['test'] = testResult;
            results['deploy'] = deployResult;
        }
        return results;
    } catch (error) {
        console.log(error);
        return error;
    }
}

/* POST home page. */
router.post('/', async function (req, res, next) {
    try {
        var projects = req.app.get('projects');
        if (req.body
            && req.body.ref
            && req.body.project
            && req.body.project.git_http_url) {
            var refPath = req.body.ref.split('/');
            var gitBranch = refPath[refPath.length - 1];

            for (var i in projects) {
                if (projects[i].git_http_url == req.body.project.git_http_url
                    && projects[i].git_branch == gitBranch) {
                    const result = await queue.push(projects[i]);
                    console.log("Worker result:", result);
                    break;
                }
            }
        }
    } catch (error) {
        console.log(error.message);
    } finally {
        return res.send({ 'message': 'Received' });
    }
});


module.exports = router;
