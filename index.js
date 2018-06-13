require('dotenv').config()

var server = require('./server/server.js'),
	config = require('./config/config.js'),
	PORT   = config.port

// start listening
server.listen(PORT, function () {
	console.log("server started on port: " + PORT);
})