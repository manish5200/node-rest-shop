const http = require('http'); // import from node js
const app = require('./app');  // import app 

const port = process.env.PORT || 3000; // access node js enviroment variable through this port

const server=http.createServer(app); 

server.listen(port);