//Goal: create a func that generates newMessage obj
//Stores utility functions related to messaging

var generateMessage = (from, text) => {
	return {
		from,
		text,
		createdAt: new Date().getTime()
	};
};

module.exports = {generateMessage};