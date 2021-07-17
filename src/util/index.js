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
            var opts = { cwd: config.dir };
            if (cmds && cmds.script && cmds.script.length) {
                if (cmds.tags
                    && cmds.tags.length
                    && cmds.tags.includes('shell')) {
                    opts['shell'] = true;
                }
                // console.log(opts);
                for (var i in cmds.script) {
                    var cmdArray = cmds.script[i].split(" ");
                    var command = cmdArray[0];
                    var args = [];
                    if (cmdArray.length > 1) {
                        for (var a = 1; a < cmdArray.length; a++) {
                            args.push(cmdArray[a]);
                        }
                    }
                    let rs = spawnSync(command, args, opts);
                    results.push(rs.stdout.toString());
                }
            }
            return results;
        } catch (error) {
            return null;
        }
    },

    writeLog: async function (file, data) {
        try {
            var dir = path.join(__dirname, '../', 'public') + '/logs';
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.chmodSync(dir, 0777);
            var contents = "";
            if (data && Object.keys(data).length) {
                for (var key in data) {
                    contents += "\n" + key + "\n" + data[key];
                }
            }
            var filePath = `${dir}/${file}`;
            return fs.writeFileSync(filePath, contents);
        } catch (error) {
            return error
        }
    },

    getCurrentTimestamp: function () {
        return Math.round(new Date().getTime() / 1000);
    },

    stringToTime: function (str) {
        return Math.round((Date.parse(str)) / 1000);
    },
};