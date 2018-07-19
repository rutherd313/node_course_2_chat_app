//Root of node app
const path = require('path');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
// console.log(__dirname + '/../public'); //old way
// console.log(publicPath); //new way 

//Configure for Heroku
const port = process.env.PORT || 3000;

//app var to config express 
var app = express();

//configs static middleware, serves public folder
app.use(express.static(publicPath));

//starts sever on localhost
app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});