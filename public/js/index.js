//calling io() initiates the request from client to server to open web socket
var socket = io();

socket.on('connect', function () {
	console.log('Connected to server');

	//client-side script that connects to server
	/*socket.emit('createEmail', {
		to: 'jen@example.com',
		text: 'Hey, This is John.'
	});*/

	//----project
	socket.emit('createMessage', {
		from: 'god',
		text: 'Keep going forward.'
	});
});

socket.on('disconnect', function () {
	console.log('Disconnected form the server');
});

//custom event
/*socket.on('newEmail', function (email) {
	console.log('New email', email);
})*/

//----project
socket.on('newMessage', function(message) {
	console.log('New message', message);
});