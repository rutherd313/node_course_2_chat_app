var moment = require('moment');
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
//https://momentjs.com/docs/

//Unix epoch: Jan 1st 1970

// var date = new Date()
// console.log(date.getMonth())
//represents current moment in time

/*var date = moment();
date.add(1, 'year').subtract(9, 'months')
console.log(date.format('MMM Do, YYYY'))
*/

new Date().getTime()
var someTimestamp = moment().valueOf();
console.log(someTimestamp);

var createdAt = 1234;
var date = moment(createdAt);
console.log(date.format('h:mm a'))
