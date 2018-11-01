let express = require('express');
let app = express();
let app_route = require('./routes/app_route');
let login_route = require('./routes/login_route');
let path = require('path');
let bodyParser = require('body-parser');
let mysql = require('mysql');
let connection = require('./server.js');
let session = require('express-session');



connection.connect(function(err) {
    if (err) throw err;
		else{
			console.log("MySQL Connection Successful!")
		}
});



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000 ;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));

app.use(app_route);
app.get('/', login_route.index);//call for main index page
app.get('/login', login_route.index);//call for login page
app.post('/login', login_route.login);//call for login post
//app.get('/signup', routes.signup);//call for signup page
