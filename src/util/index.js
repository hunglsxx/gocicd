/**
 * @Author: Hưng
 */

var fs = require('fs');
var pluralize = require('pluralize');
var path = require('path');
const { spawnSync } = require('child_process');

module.exports = {
    autoloadRoutes: function (app, routePath, excludeRoutes, namespace) {
        fs.readdirSync(routePath).forEach(function (file) {
            if (path.extname(file) === '.js') {
                file = file.replace('.js', '');
                var route = path.join(routePath, file);
                if (!excludeRoutes.includes(file)) {
                    file = pluralize.plural(file);
                    var resource = `/${file}`;
                    if (namespace && namespace.trim() !== "") {
                        var resource = `/${namespace}/${file}`;
                    }
                    app.use(resource, require(route));
                }
            }
        });
    },
    commandParse: async function (key, only, data) {
        try {
            if (data[key] && Object.keys(data[key]).length) {
                for (var i in data[key]) {
                    var parseData = data[key][i];
                    if (parseData.only && parseData.only.includes(only)
                        && parseData.script && parseData.script.length) {
                        return parseData;
                    }
                }
            }
            return null;
        } catch (error) {
            return null;
        }
    },
    runScript: async function (cmds, config) {
        try {
            var results = [];
            if (cmds && cmds.script && cmds.script.length) {
                for (var i in cmds.script) {
                    var cmdArray = cmds.script[i].split(" ");
                    var command = cmdArray[0];
                    var args = [];
                    if (cmdArray.length > 1) {
                        for (var a = 1; a < cmdArray.length; a++) {
                            args.push(cmdArray[a]);
                        }
                    }
                    let rs = spawnSync(command, args, { cwd: config.dir });
                    results.push(rs.stdout.toString());
                }
            }
            return results;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};