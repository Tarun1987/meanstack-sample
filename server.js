var express = require("express"),
    http = require('http');

var app = express();

require('./server/config/express.js')(app);

require('./server/config/mongoose.js')();

require('./server/config/passport.js')();

require('./server/routes')(app);

var server = http.createServer(app);

server.listen(process.env.PORT);

console.log("Server listening on port " + process.env.PORT);