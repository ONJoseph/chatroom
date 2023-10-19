var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);

var io = require('socket.io')(server);
var path = require('path');


app.use(express.static(path.join(__dirname,'./public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


var name;

io.on('connection', (socket) => {
  console.log('new user connected');
  
  socket.on('joining msg', (username) => {
  	name = username;
  	io.emit('chat message', `---${name} joined the chat---`);
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    io.emit('chat message', `---${name} left the chat---`);
    
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
  });
});

server.listen(3000, () => {
  console.log('Server listening on :3000');
});

/*
Documentation:
The provided code is a Node.js application that uses the Express.js framework and 
Socket.IO to create a simple chat application. Here's a step-by-step explanation of the code:

Import Required Modules:

express: Imports the Express.js framework for building web applications.
http: Imports the built-in HTTP module to create an HTTP server.
socket.io: Imports the Socket.IO library for enabling real-time bidirectional communication.
path: Imports the Node.js path module for working with file and directory paths.
Create an Express Application and HTTP Server:

Creates an instance of the Express application and assigns it to the app variable.
Creates an HTTP server (server) using the Express application.
Initialize Socket.IO:

Initializes Socket.IO by passing the server instance to it. This enables real-time WebSocket communication between the server and clients.
Serve Static Files:

Configures Express to serve static files from the 'public' directory using the express.static middleware. This allows serving static HTML, CSS, JavaScript, and other assets.
Define the Root Route:

Sets up a GET route for the root URL ('/') that responds by sending the 'index.html' file located in the 'public' directory.
WebSocket Communication (Socket.IO):

Listens for WebSocket connections using io.on('connection', ...), which is triggered whenever a new client connects.
Logs a message to the server console when a new user is connected.
Handles the 'joining msg' event, which is sent when a user enters their name to join the chat. It broadcasts a message to all connected clients to announce that a user has joined.
Listens for the 'disconnect' event, which occurs when a user disconnects from the chat. It broadcasts a message to inform all clients that the user has left.
Listens for 'chat message' events, which are sent when a user sends a chat message. It broadcasts the received message to all connected clients except the sender.
Start the Server:

Starts the HTTP server on port 3000.
Outputs a message to the console indicating that the server is listening on port 3000.
In summary, this code sets up a basic chat server using Express.js and Socket.IO. Users can connect to the server, provide a username, and then send and receive chat messages in real-time. Messages are broadcast to all connected clients, allowing multiple users to participate in a chat session. The 'index.html' file in the 'public' directory serves as the client-side interface for the chat application.
*/
