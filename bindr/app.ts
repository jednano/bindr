///<reference path='./vendor/dt-node/node.d.ts'/>
///<reference path='./vendor/dt-express/express.d.ts'/>
///<reference path='./routes/index.ts'/>


/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
import routes = require('./routes/index');


var allowCrossDomain = (req: ExpressServerRequest, res: ExpressServerResponse, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'POST');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	next();
};

var app: ExpressApplication = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(allowCrossDomain);
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/bind', routes.bind);

http.createServer(app).listen(app.get('port'), () => {
	console.log('Express server listening on port ' + app.get('port'));
});
