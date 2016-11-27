/* Object Constructors */
// User
function User(id, name, sp) {
    this.id = id;
    this.Name = name;
    this.serviceProvider = sp;
}
//

/* Main */
// Port & IP Constants
const ENVPORT = 8081;
const ENVIP = process.env.IP;

// Load modules
const http = require("http");

// Initialize a web server using anonymous function
http.createServer(function (request, response) {
    // Write out information of requester
    console.log('New request from: '+request.socket.remoteAddress);

   // Send the HTTP header 
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(ENVPORT, ENVIP);

// Console will print the message
console.log('Server running at http://'+ENVIP +':'+ENVPORT+'/');