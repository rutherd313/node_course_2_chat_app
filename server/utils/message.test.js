var expect = require('expect');

var {generateMessage} = require('./message');

//test case
describe('generateMessage', () => {
	it('should generate correct message object', () => {
		var from = 'John';
		var text = 'Some message';
		var message = generateMessage(from, text);

		//verifies property is correct
		expect(typeof message.createdAt).toBe('number');
		expect(message).toMatchObject({from, text})
	});
})