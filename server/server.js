//Root of node app
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
// console.log(__dirname + '/../public'); //old way
// console.log(publicPath); //new way 

//Configure for Heroku
const port = process.env.PORT || 3000;


//app var to config express 
const app = express();
//since http is used for express, app can be used
const server = http.createServer(app)
var io = socketIO(server);


//configs static middleware, serves public folder
app.use(express.static(publicPath));

//io.on registers an event listener
//'connection' listens for new connection from server to client
io.on('connection', (socket) => { //individual socket
	console.log('New user connected');

	//used on both client and server to emit events
	/*socket.emit('newEmail', {
		from: 'mike@example.com',
		text: 'Bonjour, ca va?',
		createdAt: 123
	});*/

	// socket.on('createEmail', (newEmail) => {
	// 	console.log('createEmail', newEmail);
	// });

	//newMessage Event
	socket.emit('newMessage', {
		from: 'John',
		text: 'Get your shit together',
		createdAt: 23456
	});

	//createMessage Event
	socket.on('createMessage', (message) => {
		console.log('createMessage', message);
	});

	socket.on('disconnect', () => {
		console.log('User was disconnected');
	});
});

//starts sever on localhost
server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});