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

socket.on('newLocationMessage', function (message) {
	var li = jQuery('<li></li>');
	var a = jQuery('<a target="_blank">My current location</a>');

	li.text(`${message.from}: `);
	//fetches the value of the arg inside
	a.attr('href', message.url);
	li.append(a);
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

	var messageTextbox = jQuery('[name=message]');

	socket.emit('createMessage', {
		from: 'User',
		//selects name attr with message
		text: messageTextbox.val()
	}, function() { //error handler
		messageTextbox.val('')
	});
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
	//geolocation api exists on:
	if (!navigator.geolocation) {
		return alert('Geolocation not supported by your browser');
	}

	//disables the button if browser supports it
	locationButton.attr('disabled', 'disabled').text('Sending location...')

	//gets the coordinates
	navigator.geolocation.getCurrentPosition(function (position) {
		locationButton.removeAttr('disabled').text('Send Location');
		socket.emit('createLocationMessage', {
			latitude: position.coords.latitude,
			longitude: position.coords.longitude
		});
	}, function () { //error handler
		locationButton.removeAttr('disabled').text('Send Location')
		alert('Unable to fetch location')
	});
})

