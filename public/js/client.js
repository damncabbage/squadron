
(function(){
	if (window.squadronHostName == undefined || window.squadronPort == undefined || window.squadronName == undefined) {
		alert('squadronHostName, squadronPort and squadronName must be defined!');
	}

	var loadScript = function(src, loadCB) {
		var head = document.getElementsByTagName('head')[0];
		var newBlock = document.createElement('script');
		newBlock.setAttribute('type', 'text/javascript');
		newBlock.setAttribute('src', src);
		newBlock.onload = loadCB;
		head.appendChild(newBlock);
	};

	// Run when the above scripts are loaded
	var ioBody = function(){

		// Set up the connect/eval loop
		var socket = new io.Socket(squadronHostName, {port: squadronPort});
		socket.connect();

		socket.on('connect', function(){
			socket.send(JSON.stringify({
				action: 'THIS-IS-AIRCRAFT',
				data: squadronName
			}));
		});

		socket.on('disconnect', function(){
			// TODO: Tell the user we're retrying...
			socket.connect();
		});

		socket.on('connect_failed', function(){
			//alert('Connection to server failed!');
			window.setTimeout(socket.connect, 2000);
		});

		socket.on('message', function(msg){
			//var msg = JSON.parse(data);

			switch (msg.action) {
				case 'COMMAND':
					// Oh man this is bad. :)
					eval(msg.data);
					break;
			}
		});
	};

	// Load socket.io, JSON compat libs.
	loadScript('http://'+squadronHostName+':'+squadronPort+'/socket.io/socket.io.js', function(){
		loadScript('http://'+squadronHostName+':'+squadronPort+'/js/json2.js', ioBody);
	});

})();
