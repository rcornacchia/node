var http = require("http"),
    port = 1234;

var server = http.createServer(function(request, response) {
  response.writeHeader(200, {"Content-Type": "text/plain"});
  response.write("Hello HTTP");
  response.end();
});

server.listen(port);
console.log("Server running on "+port+".\nLaunch http://localhost:"+port);
