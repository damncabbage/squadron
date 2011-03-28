
// Console Arguments
var port = 3000;
if (process.ARGV.length >= 3 && parseInt(process.ARGV[2]) != 'NaN') {
	port = parseInt(process.ARGV[2]);
}

// INCLUDES
var sys = require('sys'),
	express = require('express'),
	io = require('socket.io');


// SETUP
var app = express.createServer();
app.configure(function(){
	app.set('root', __dirname);
	app.set('views', __dirname + '/views');

	app.use(express.static(__dirname + '/public')); // static file serving
	app.use(express.bodyParser()); // form/JSON handling
	app.use(express.methodOverride()); // HTTP verb support
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	/*app.use(express.compiler({
		src: __dirname + '/public',
		enable: ['compass']
	}));*/
	app.use(app.router);
});


// MODELS

var Squadrons = {
	list: {},
	init: function(squadron) {
		if (this.list[squadron] == undefined) {
			this.list[squadron] = {};
		}
	},
	eachMember: function(squadron, cb){
		this.init(squadron);
		for (var member in this.list[squadron]) {
			cb(this.list[squadron][member]);
		}
	}
};


// ROUTES

// Homepage; asks for a group identifier
app.get('/', function(req,res){
	res.send('Enter a squadron name:');
});

// A user telling a bunch of devices what to do.
app.get('/command/:squadron', function(req,res){
	res.send('Squadron '+req.params.squadron+' deployed and ready.');

	var msg = 'alert("hi")';
	res.send('Broadcasting: ' + msg);
	Squadrons.eachMember(req.params.squadron, function(client){
		client.send(msg);
	});
});

// A device receiving commands and reporting results
app.get('/report/:squadron/:callsign', function(req,res){
	var squadron = req.params.squadron;
	Squadrons.init(squadron);
	
	// Socket magic keeping the connection open between client and server
	var socket = new io.listen(app);
	socket.on('connection', function(client){
		// New client; assign a name
		var clientName = 'Red-'+(Math.floor(Math.random()*50+1));
		Squadrons.list[squadron][clientName] = client;

		client.on('disconnect', function(){
			// Cleanup
			delete Squadrons.list[squadron][clientName];
		});
	});
});


// START

app.listen(port);
console.log('Squadron server started on port %s', app.address().port);
