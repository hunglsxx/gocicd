/**
 * @Author: Hưng
 */

var fs = require('fs');
var pluralize = require('pluralize');
var path = require('path');

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
    }
};