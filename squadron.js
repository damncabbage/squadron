
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
	app.set('view engine', 'ejs');
	app.set('view options');

	app.use(express.static(__dirname + '/public')); // static file serving
	app.use(express.bodyParser()); // form/JSON handling
	app.use(express.cookieParser());
	app.use(express.methodOverride()); // HTTP verb support
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

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
	broadcast: function(squadron, msg) {
		var send = function(client){
			client.send(msg);
		};
		this.eachMember(squadron, send);
	},

	addMember: function(squadron, clientName, client) {
		this.init(squadron);
		this.list[squadron][clientName] = client;
	},
	removeMember: function(squadron, clientName) {
		this.init(squadron);
		if (this.list[squadron][clientName] != undefined) {
			delete this.list[squadron][clientName];
		}
	},
	eachMember: function(squadron, cb){
		this.init(squadron);
		for (var member in this.list[squadron]) {
			cb(this.list[squadron][member]);
		}
	}
};


// PLAIN ROUTES

// Homepage; asks for a group identifier
app.get('/', function(req,res){
	res.render('index');
});

// Take a form submission, and turn it into a /command/:squadron route.
app.get('/command', function(req,res){
	if (req.query.squadron == undefined) {
		res.redirect('/');
		return;
	}
	res.redirect('/command/'+req.query.squadron);
});


// SOCKET ROUTES

// A user telling a bunch of devices what to do.
app.get('/command/:squadron', function(req,res){
	res.render('command', {
		locals: {
			squadron: req.params.squadron,
			host: req.header('Host'),
			hostname: req.header('Host').split(":")[0], // HACK
			port: port
		}
	});
});

// A device receiving commands and reporting results
// This is really just a URL to latch onto; the actual communication stuff
// goes on in the socket down below.
app.get('/report/:squadron', function(req,res){
	var squadron = req.params.squadron;
	Squadrons.init(squadron);
});


// SOCKET MAGIC
// Magic keeping the connection open between client and server

// We have two types of socket client: commanders and aircraft.
// We broadcast everything to both; commanders will respond to RESPONSEs, and aircraft will respond to COMMANDs.
// This is insecure as hell, but this is a) a prototype, b) to be run on a tiny LAN only.

var socket = new io.listen(app);
socket.on('connection', function(client){
	var clientName = '';
	var clientSquadron = '';

	client.on('message', function(m, c){
		console.log(m);
		var msg = JSON.parse(m);
		if (!msg) return;

		// Message format:
		// {
		//   action: string,
		//   data: string
		// }

		switch(msg.action) {
			case 'THIS-IS-COMMANDER':
				clientName = 'HQ-'+Math.floor(Math.random()*9000+1);
				clientSquadron = msg.data;
				Squadrons.addMember(clientSquadron, clientName, client);
				break;
			case 'THIS-IS-AIRCRAFT':
				var clientName = 'Craft-'+(Math.floor(Math.random()*9000+1));
				clientSquadron = msg.data;
				Squadrons.addMember(clientSquadron, clientName, client);
				break;
		}

		// Regardless, spam everyone
		Squadrons.broadcast(clientSquadron, {
			who: clientName,
			action: msg.action,
			data: msg.data,
		});
	});

	client.on('disconnect', function(){
		// Cleanup
		Squadrons.removeMember(clientSquadron, clientName, client);
	});
});


// START

if (!module.parent) {
	app.listen(port);
	console.log('Squadron server started on port %s', app.address().port);
}
