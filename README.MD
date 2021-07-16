# Usage 
## npm version (recommended)

```bash
mkdir nms
cd nms
npm install go-cicd
vi app.js
```

```js
const GoCICDServer = require('go-cicd');

const config = {
    namespace: "",
    http: {
        port: 91891
    },
    https: {
        port: 8443
    },
    auth: {
        api: true,
        api_user: 'admin',
        api_pass: 'admin',
        play: false,
        publish: false,
        secret: 'goci2021privatekey'
    },
    projects: [
        {
            git_http_url: 'https://github.com/hunglsxx/gocicd.git',
            git_branch: 'master',
            dir: '/var/www/html/cicd'
        },
        ...
    ]
};

var goci = new GoCICDServer(config);
goci.run();
```

```bash
node app.js
```
