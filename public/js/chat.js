//calling io() initiates the request from client to server to open web socket
var socket = io();

//autoscrolling
//to be called 2x = newMessage & newLocationMessage
function scrollToBottom(){
	//Selectors
	var messages = jQuery('#messages');
	//last message added b4 the call to scrollToBottom
	var newMessage = messages.children('li:last-child')
	//heights
	//prop gives cross-browser way to fetch property, jQuery alt
	//to work on all browsers
	var clientHeight = messages.prop('clientHeight');
	var scrollTop = messages.prop('scrollTop');
	var scrollHeight = messages.prop('scrollHeight');
	var newMessageHeight = newMessage.innerHeight();
	var lastMessageHeight = newMessage.prev().innerHeight();

	if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
		messages.scrollTop(scrollHeight);
	}
}

socket.on('connect', function () {
	//console.log('Connected to server');
	var params = jQuery.deparam(window.location.search);

	socket.emit('join', params, function(err) {
		if (err) {
			alert(err);
			//brings user back to root page
			window.location.href = '/';
		} else {
			console.log('No error');
		}
	});
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

socket.on('updateUserList', function (users) {
	var ol = jQuery('<ol></ol>');

	users.forEach(function (user) {
		ol.append(jQuery('<li></li>').text(user));
	});

	//updating to DOM
	jQuery('#users').html(ol);
});

//custom event
/*socket.on('newEmail', function (email) {
	console.log('New email', email);
})*/

socket.on('newMessage', function(message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#message-template').html();
	var html = Mustache.render(template, {
		text: message.text,
		from: message.from,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();
	
	// console.log('New message', message);
	// var li = jQuery('<li></li>');
	// li.text(`${message.from} ${formattedTime}: ${message.text}`)

	// //rendering to DOM
	// jQuery('#messages').append(li);
});

socket.on('newLocationMessage', function (message) {
	var formattedTime = moment(message.createdAt).format('h:mm a');
	var template = jQuery('#location-message-template').html();
	var html = Mustache.render(template, {
		from: message.from,
		url: message.url,
		createdAt: formattedTime
	});

	jQuery('#messages').append(html);
	scrollToBottom();

	// var li = jQuery('<li></li>');
	// var a = jQuery('<a target="_blank">My current location</a>');
	// li.text(`${message.from} ${formattedTime}: `);
	// //fetches the value of the arg inside
	// a.attr('href', message.url);
	// li.append(a);
	// jQuery('#messages').append(li);
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

