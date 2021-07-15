#!/usr/bin/env node

const GoCICDServer = require('..');
let argv = require('minimist')(process.argv.slice(2),
    {
        string: ['http_port', 'https_port'],
        alias: {
            'http_port': 'h',
            'https_port': 's',
        },
        default: {
            'http_port': 8000,
            'https_port': 8443,
            'namespace': '',
            'projects': []
        }
    });

if (argv.help) {
    console.log('Usage:');
    console.log('  go-cicd --help // print help information');
    console.log('  go-cicd --http_port 8000 or -h 8000');
    console.log('  go-cicd --https_port 8443 or -s 8443');
    process.exit(0);
}

const config = {
    namespace: argv.namespace,
    http: {
        port: argv.http_port,
        mediaroot: __dirname + '/media',
        webroot: __dirname + '/www',
        allow_origin: '*',
        api: true
    },
    https: {
        port: argv.https_port,
        key: __dirname + '/privatekey.pem',
        cert: __dirname + '/certificate.pem',
    },
    auth: {
        api: true,
        api_user: 'admin',
        api_pass: 'admin',
        play: false,
        publish: false,
        secret: 'gostream2021privatekey'
    },
    projects: [
        {
            git_uri: 'https://gitlab.com/hungls/first-cicd',
            git_branch: 'master',
            dir: '/var/www/html/cicd'
        }
    ]
};

let gocicd = new GoCICDServer(config);
gocicd.run();
