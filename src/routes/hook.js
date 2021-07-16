var express = require('express');
var router = express.Router();
const queue = require('fastq').promise(worker, 1);
const { spawnSync } = require('child_process');
var fs = require('fs');
var YAML = require('yaml');
var util = require('../util');
var path = require('path');
var md5 = require('md5');

async function worker(arg) {
    try {
        console.log("In worker", arg);
        let pull = spawnSync('git', ['pull', 'origin', arg.git_branch], { cwd: arg.dir });
        let yamlFile = `${arg.dir}/.go-ci.yml`;
        var results = {
            'git': pull.stdout.toString()
        };
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
        if (arg.log
            && arg.log.stores
            && arg.log.stores.includes('file')) {
            var file = util.getCurrentTimestamp()
                + '_' + arg.git_branch
                + '_' + md5(arg.git_http_url) + ".log";

            await util.writeLog(file, results);
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
        var log = req.app.get('configs').log;
        if (req.body
            && req.body.ref
            && req.body.project
            && req.body.project.git_http_url) {
            var refPath = req.body.ref.split('/');
            var gitBranch = refPath[refPath.length - 1];

            for (var i in projects) {
                if (projects[i].git_http_url == req.body.project.git_http_url
                    && projects[i].git_branch == gitBranch) {
                    var jobData = projects[i];
                    jobData['log'] = log;
                    const result = await queue.push(jobData);
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
