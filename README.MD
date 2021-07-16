# Usage 
## npm version (recommended)

```bash
mkdir my-runner
cd my-runner
npm install go-cicd
vi app.js
```

```js
const GoCICDServer = require('go-cicd');

const config = {
    namespace: "",//name space for hook router. Eg: "v1" => http://localhost:9119/v1/hooks
    log: {
        stores: ['file'] // if use stores: ['file'], process logs are write to log file, you can access to file via http://localhost:9119/logs
    },
    http: {
        port: 9191
    },
    // Multi project per hook
    projects: [
        {
            git_http_url: 'https://github.com/hunglsxx/gocicd.git', // your git
            git_branch: 'master', // your git branch
            dir: '/var/www/html/cicd' //your code dir
        },
    ]
};

var goci = new GoCICDServer(config);
goci.run();
```

```bash
node app.js
```

Add your hook to gitlab webhook: 
```
http://localhost:9191/hooks
```

Copy yml template file to your project dir and change file name to .go-ci.yml
```
cp node_modules/go-cicd/go-ci.template.yml your/project/dir/.go-ci.yml
```
Define your scripts in .go-ci.yml by yourself.