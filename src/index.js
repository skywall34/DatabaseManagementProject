let express = require('express');
let app = express();
let app_route = require('./routes/app_route');
let login_route = require('./routes/login_route');
let path = require('path');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
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
app.use(cookieParser());
// initialize express-session to allow us track the logged-in user across sessions.
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// This middleware will check if user's cookie is still saved in browser and user is not set, then automatically log the user out.
// This usually happens when you stop your express server after login, your cookie still remains saved in the browser.
app.use((req, res, next) => {
    if (req.cookies.user_sid && !req.session.username) {
        res.clearCookie('user_sid');
    }
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(app_route);
app.use(login_route);

const PORT = process.env.PORT || 3000 ;
app.listen(PORT, () => console.info(`Server has started on ${PORT}`));

//app.get('/', login_route.index);//call for main index page
//app.get('/login', login_route.index);//call for login page
//app.post('/login', login_route.login);//call for login post
//app.get('/signup', routes.signup);//call for signup page
