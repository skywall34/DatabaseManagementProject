let conn = require('../server');
let passwordHash = require('password-hash');
let express = require('express');
let router = express.Router();
let AccountModel = require('../models/app_model.js');
/*
* GET home page.
*/
/*
router.get('/login', (req, res) => {
  res.render('index.ejs',{message: message});
});
*/
//get the table objects
let User = AccountModel.User;
let Giftcard = AccountModel.Giftcard;
let Transaction = AccountModel.Transaction;




// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/login');
    } else {
        next();
    }
};



router.get('/login', sessionChecker, (req, res) => {
  message = '';
  res.render('index.ejs',{message: message});
});


router.post('/login', (req, res) => {
   var message = '';

   var post  = req.body;
   console.log(post);
   var name= post.user_name;
   var pass= post.password;
   console.log(name);
   console.log(pass);

   var sql=`SELECT * FROM users WHERE username = '${name}' AND password = PASSWORD('${pass}')`;
   //console.log(sql);
   conn.query(sql, function(err, results){
     console.log(results);
     if (err || results.length < 1){
       message = 'Wrong Credentials.';
       console.log(err);
       res.render('index.ejs',{message: message});

     }else{
       console.log('Success Loggin In!');
       req.session.username = name;
       req.session.password = pass;
       console.log("Session at login: ", req.session.username);
       console.log('admin is', results[0].is_admin);
       if (results[0].is_admin == 1){
         console.log('At Admin');
         res.redirect('/user_report');

       }else{
         console.log('At User');
         link = '/user?username=';
         redirection_link = link.concat(name);
         res.redirect(redirection_link);
       }
     }
   });
});


router.get('/', sessionChecker, (req, res) => {
  message = '';
  res.render('index.ejs',{message: message});
});




module.exports = router;
