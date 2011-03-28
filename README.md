Squadron
========

Requirements
------------

[Node.js](https://github.com/joyent/node/wiki/Installation), [SQLite3](http://www.sqlite.org/), NPM, and a bunch of packages.

Set up NPM and the packages with the following commands:

    curl http://npmjs.org/install.sh | sudo sh
    sudo npm install socket.io
    sudo npm install express
    sudo npm install underscore
    sudo npm install jade


Usage
-----

Run the following from the squadron directory to start the server:

    ./squadron.sh      # Start on port 3000.
    ./squadron.sh 5000 # Start on port 5000 instead.