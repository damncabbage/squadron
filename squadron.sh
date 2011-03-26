#!/bin/bash

function usage {
	echo "Usage: $0 [port]"
}

# Force $PORT to integer
declare -i PORT
PORT=3000
if [ ! -z "$1" ]; then
	PORT=$1 #("example" --> 0, "123" --> 123)
	# Is $1 a number?
	if [ $PORT -le 0 ]; then
		usage
		exit 1;
	fi
fi

# Switch environment to production if none given
if [ -z "$NODE_ENV" ]; then
	export NODE_ENV="production node app.js"
fi

# Start the server
node squadron.js $PORT
