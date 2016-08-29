// Load http module
var http = require("http");

// Initialize a web server using anonymous function
http.createServer(function (request, response) {

   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(process.env.PORT, process.env.IP);

// Console will print the message
console.log('Server running at http://'+process.env.IP +':'+process.env.PORT+'/');