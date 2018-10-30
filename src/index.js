let express = require('express');
let app = express();
let appRoute = require('./routes/app_route');
let path = require('path');
let bodyParser = require('body-parser');
var mysql = require('mysql');

//local mysql db connection
var connection = mysql.createConnection({
    host     : 'localhost',
		port		 : 3307,
    user     : 'root',
    password : 'skywall34',
    database : 'dm_project'
});

connection.connect(function(err) {
    if (err) throw err;
		else{
			console.log("MySQL Connection Successful!")
		}
});

app.use(bodyParser.json());

//Middleware function, orders of these handlers matter! Print incoming requests first
//next is a reference to the next function in the pipeline
app.use((req, res, next) => {
	console.log(`${new Date().toString()} => ${req.originalUrl}`);

	next(); //call the next chain of functions
});

//router call
app.use(appRoute);

// serve some static files
// File can be called from the public folder which holds static files
app.use(express.static('public'));

// Handler for 404 - Resource Not Found
app.use((req, res, next) => {
	res.status(404).send('We think you are lost!');
});


// Handler for Error 500, We also created a static HTML file for this
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.sendFile(path.join(__dirname, '../public/500.html'));
});


const PORT = process.env.PORT || 3000 ;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));
