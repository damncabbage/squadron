
// Console Arguments
var port = 3000;
if (process.ARGV.length >= 3 && parseInt(process.ARGV[2]) != 'NaN') {
	port = parseInt(process.ARGV[2]);
}

// Includes
var sys = require('sys');
var express = require('express');

// Setup
var app = express.createServer();
app.configure(function(){
	app.use(express.methodOverride()); // HTTP verb support
	app.use(express.bodyParser()); // form handling
	app.use(app.router);
	app.use(express.static(__dirname + '/public')); // static file serving
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	app.set('root', __dirname);
	app.set('views', __dirname + '/views');
	/*app.use(express.compiler({
		src: __dirname + '/public',
		enable: ['compass']
	}));*/
});


// Routes
app.get('/', function(req,res){
	res.send('Hello World');

});

// Fire it off.
app.listen(port);
console.log('Squadron server started on port %s', app.address().port);
