var express = require('express');
var app     = express();
var path    = require('path');

// set the public folder to serve public assets
app.use(express.static(__dirname + '/public'));

// set up route to index.html file
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

// start the server on port 8080 (http://localhost:8080)
app.listen(8081);
console.log('Magic happens on port 8081');
