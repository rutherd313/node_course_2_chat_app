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
	//deleted after updating createMessage in server.js
	/*socket.emit('createMessage', {
		from: 'god',
		text: 'Keep going forward.'
	});*/
});

socket.on('disconnect', function () {
	console.log('Disconnected form the server');
});

//custom event
/*socket.on('newEmail', function (email) {
	console.log('New email', email);
})*/

socket.on('newMessage', function(message) {
	console.log('New message', message);
	var li = jQuery('<li></li>');
	li.text(`${message.from}: ${message.text}`)

	//rendering to DOM
	jQuery('#messages').append(li);
});

//goal is to send an acknowledgement from the server back to 
//the client that we got the data
//no longer needed since form is created
/*socket.emit('createMessage', {
	from: 'John',
	text: 'Hi'
}, function(data) {
	console.log('Got it', data);
})*/

jQuery('#message-form').on('submit', function(e) {
	//prevenents the default for the event = refresh process
	e.preventDefault();

	socket.emit('createMessage', {
		from: 'User',
		//selects name attr with message
		text: jQuery('[name=message]').val()
	}, function() {

	});
});