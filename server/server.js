//Root of node app
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

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
var users = new Users();

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

	//emits to single connection
	//placed inside createMessage
	/*socket.emit('newMessage', {
		from: 'John',
		text: 'Get your shit together',
		createdAt: 23456
	});*/

	
	socket.on('join', (params, callback) => {
		//validate data that came thru, both name & room
		if (!isRealString(params.name) || !isRealString(params.room)) {
			return callback('Name and room name are required');
		}
		//for people to talk in the same room
		socket.join(params.room)
		//make sure there no user with current id
		users.removeUser(socket.id);
		users.addUser(socket.id, params.name, params.room)

		//emit everyone to the chat room
		io.to(params.room).emit('updateUserList', users.getUserList(params.room));

		//target specific users to join
		//io.emit => all user ,ex: io.to('Some group').emit
		//socket.broadcast.emit => all but current user
		//socket.emit => one user
		socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
		socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));		
		callback();
	})

	//createMessage Event
	socket.on('createMessage', (message, callback) => {
		var user = users.getUser(socket.id);
		if (user && isRealString(message.text)) {
			//emits to every single connection
			//io.emit('newMessage', generateMessage(message.from, message.text));
		}	io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
		
		callback();
		//broadcasting -> emiting event to err body except for one user
		//this case, errbody will see message sent except me
		/*socket.broadcast.emit('newMessage', {
			from: message.from,
			text: message.text,
			createdAt: new Date().getTime()
		})*/
	});

	socket.on('createLocationMessage', (coords) => {
		var user = users.getUser(socket.id);
		if (user) {
			io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
		}
	})

	socket.on('disconnect', () => {
		//Remove the user, then disconnect
		var user = users.removeUser(socket.id);
		//if user is removed
		if(user) {
			//update user list, when sum1 leaves room, removed
			io.to(user.room).emit('updateUserList', users.getUserList(user.room));
			//sends message
			io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
		}
	});
});

//starts sever on localhost
server.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});