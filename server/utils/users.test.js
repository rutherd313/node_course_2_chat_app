const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
	var users;
	//will get called b4 each test case, will initialize each data
	beforeEach(() => {
		users = new Users();
		users.users = [{
			id: '1',
			name: 'John',
			room: 'Node Course'
		}, {
			id: '2',
			name: 'Jen',
			room: 'React Course'
		}, {
			id: '3',
			name: 'Julie',
			room: 'Node Course'
		}];
	});

	it('should add new user', () => {	
		var users = new Users();
		var user = {
			id: '123',
			name: 'John',
			room: 'Nutella fans'
		};
		var resUser = users.addUser(user.id, user.name, user.room);
		//1st user refers to line 9
		//2nd user refers to user.js, line 19
		expect(users.users).toEqual([user]);
	});
	//challenge
	it('should remove a user', () => {
		var userId = '1';
		var user = users.removeUser(userId);

	    expect(user.id).toBe(userId);
	    expect(users.users.length).toBe(2);
	  });

  	it('should not remove user', () => {
	    var userId = '99';
	    var user = users.removeUser(userId);

	    expect(user).toBeFalsy();
	    expect(users.users.length).toBe(3);
	  });

  	it('should find user', () => {
	    var userId = '2';
	    var user = users.getUser(userId);

	    expect(user.id).toBe(userId);
	  });

  	it('should not find user', () => {
	    var userId = '99';
	    var user = users.getUser(userId);

	    expect(user).toBeFalsy();
	  });
	//challenge
	it('should return names for node course', () => {
		var userList = users.getUserList('Node Course');

		expect(userList).toEqual(['John', 'Julie']);
	});

	it('should return names for React course', () => {
		var userList = users.getUserList('React Course');

		expect(userList).toEqual(['Jen']);
	});
});