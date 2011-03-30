Squadron
========

Test a website on a number of remote browsers by broadcasting javascript commands from a single control panel.  
(This is useful when developing a site that needs to support a number of different mobile devices.)

This project is heavily inspired by [Bubbli Co's "The Mothership" post](http://blog.bubbli.co/post/2834205057/the-mothership).

Warning: This is a **prototype**. (You can run javascript on the remote browsers, but isn't very friendly, and looks pretty terrible.)


Requirements
------------

[Node.js](https://github.com/joyent/node/wiki/Installation), [Express](http://expressjs.com/guide.html), [Socket.IO](http://socket.io/) and [EJS](http://embeddedjs.com/).

Set up NPM and the packages with the following commands:

    curl http://npmjs.org/install.sh | sudo sh
    sudo npm install socket.io
    sudo npm install express
    sudo npm install ejs


Usage
-----

Run the following from the squadron directory to start the server:

    ./squadron.sh      # Start on port 3000, or...
    ./squadron.sh 5000 # Start on port 5000 instead.


Follow the instructions:

1. Enter a squadron name,
2. Copy-paste the chunk of javascript it spits out into the footer of the site you're testing,
3. Type commands into the textbox to send it out.

Suggestions/forkings welcome. :)


License
-------

Copyright 2011 Robert Howard.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

