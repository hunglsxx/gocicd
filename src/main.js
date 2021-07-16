var createError = require('http-errors');
const express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');
var util = require('./util');
var indexRouter = require('./routes/index');

class GoCICDServer {
    constructor(config) {
        this.config = config;
    }
    run() {
        const app = express();
        app.use(cors());
        app.set('projects', this.config.projects);
        app.set('configs', this.config);
        // view engine setup
        app.set('views', path.join(__dirname, 'views'));
        app.set('view engine', 'pug');

        app.use(logger('dev'));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(express.static(path.join(__dirname, 'public')));

        util.autoloadRoutes(app, path.join(__dirname, 'routes'), ['index'], this.config.namespace);
        app.use('/', indexRouter);

        app.listen(this.config.http.port, () => {
            console.log(`CICD app listening at http://localhost:${this.config.http.port}`);
            console.log(`Your web-hook: http://localhost:${this.config.http.port}/hooks`);
        })

        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
            next(createError(404));
        });

        // error handler
        app.use(function (err, req, res, next) {
            // set locals, only providing error in development
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};

            // render the error page
            res.status(err.status || 500);
            res.render('error');
        });
    }
}

module.exports = GoCICDServer;