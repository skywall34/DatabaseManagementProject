let conn = require('../server');
let passwordHash = require('password-hash');
/*
* GET home page.
*/

exports.index = function(req, res){
    var message = '';
  res.render('index',{message: message})};




exports.login = function(req, res){
   var message = '';

   if(req.method == "POST"){
      var post  = req.body;
      var name= post.user_name;
      var pass= post.password;

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
          console.log('admin is', results[0].is_admin);
          if (results[0].is_admin == 1){
            console.log('At Admin');
            res.redirect('/user_report');

          }else{
            console.log('At User');
            res.redirect('/');
          }
        }
      });
   } else {
      res.render('index.ejs',{message: message});
   }
};
