// Specific logic when a user enters an input on a certain url format or API calls
// handles views and controller
// GET PUT DELETE POST
// These routes would be referenced in the index.js file
/*

// QueryString => query property on the request object
// localhost:3000/person?name=thomas&age=20
router.get('/person', (req, res) => {
        if(req.query.name){
                res.send(`You have requested a person $(req.query.name)`);
        }
        else{
                res.send('You have requested a person');
        }
})

// Params property on the request object
// localhost:3000/person/thomas
router.get('/person/:name', (req, res) => {
        res.send(`You have requested a person ${req.params.name}`);
})


- the first one calls a query string as input
- the second one takes the query as part of the route and not as a query string

*/

let AccountModel = require('../models/app_model.js');
let express = require('express');
let router = express.Router();

//get the table objects
let User = AccountModel.User;
let Giftcard = AccountModel.Giftcard;
let Transaction = AccountModel.Transaction;

function admin_html_template(title, body, etc){
  return `
  <!doctype html>
  <html lang="en">
  <head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <script src="//ajax.googleapis.com/ajax/libs/angularjs/1.3.3/angular.min.js"></script>
  <script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.3/angular-route.min.js"></script>
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css">
  <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.1/js/bootstrap.min.js"></script>
  <script src="script.js"></script>
  </head>
  <body>
  <div>
  <div>
  <nav class="navbar navbar-inverse" role="navigation" style="padding-left:130px;">
         <ul class="nav navbar-nav">
        <li class="active"><a href="/">Home<span class="sr-only">(current)</span></a></li>
        <li><a href="/login">About us</a></li>
      </ul>
  </nav>
  </div>
  <br/>
  <div class="jumbotron"> <p>
  ${body}
  </p></div>
  <div class="jumbotron"> <p>
  ${etc}
  </p></div>
  </div>
  </body>
  </html>

  `;
}


function user_list_template(sql_list){
  var list = '<ul>';
  var i = 0;
  while(i < sql_list.length){
    list = list + `<li><a href="/?id=${sql_list[i].user_id}">${sql_list[i].username}</a></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}


function transaction_list_template(sql_list){
  var list = '<ul>';
  var i = 0;
  while(i < sql_list.length){
    list = list + `<li><a href="/?id=${sql_list[i].transaction_id}">${sql_list[i].transaction_id}</a><p>${sql_list[i].from_user}</p><p>${sql_list[i].to_user}</p><p>${sql_list[i].trans_date}</p><p>${sql_list[i].amount}</p></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}





//Create a router for users
// When they login using user credentials







// Create a router for the admin
// When they login using admin credentials

router.get('/user_report', (req, res) => {
  User.get_all_users((err, user) => {
    console.log('router get users');
    if (err){
      res.send(err);
      console.log('res', user);
    } else {
      //HTML Logic here (View the Website)
      var title = 'User Report';
      var user_list = user_list_template(user);
      Transaction.get_all_transactions((err, transactions) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else{
          var transaction_list = transaction_list_template(transactions);
          console.log(transaction_list);
          var template = admin_html_template(title, user_list, transaction_list);
          //res.writeHead(200);
          res.send(template);
        }
      });
    }
  });
});






module.exports = router;
