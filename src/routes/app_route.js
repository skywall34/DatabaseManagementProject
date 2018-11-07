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
        <li><a href="/aggregate_report">Aggregate Report</a></li>
        <li><a href="/leftovers">Leftovers</a></li>
        <li><a href="/redemptions">Redemptions</a></li>
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

//TODO: change these functions so I only need to call one
// DO This when I'm awake
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
    list = list + `<li><a href="/?id=${sql_list[i].transaction_id}">${sql_list[i].transaction_id}</a><p>${sql_list[i].from_user}</p><p>${sql_list[i].to_user}</p><p>${sql_list[i].trans_date}</p><p>${sql_list[i].amount}</p><p>${sql_list[i].message}</p></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

function trans_point_list_template(sql_list){
  var list = '<ul>';
  var i = 0;
  while(i < sql_list.length){
    list = list + `<li><p>${sql_list[i].month}</p><p>${sql_list[i].monthly_points}</p></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

function card_point_list_template(sql_list){
  var list = '<ul>';
  var i = 0;
  while(i < sql_list.length){
    list = list + `<li><p>${sql_list[i].month}</p><p>${sql_list[i].points}</p></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

function points_received_list_template(sql_list){
  var list = '<ul>';
  var i = 0;
  while(i < sql_list.length){
    list = list + `<li><p>${sql_list[i].user_id}</p><p>${sql_list[i].tot_amount}</p></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

function hoarding_users_template(sql_list){
  var list = '<ul>';
  var i = 0;
  while(i < sql_list.length){
    list = list + `<li><p>${sql_list[i].username}</p><p>${sql_list[i].monthly_points}</p></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}

function transaction_message_template(sql_list){
  var list = '<ul>';
  var i = 0;
  while(i < sql_list.length){
    list = list + `<li><a href="/?id=${sql_list[i].transaction_id}">${sql_list[i].transaction_id}</a><p>${sql_list[i].from_user}</p><p>${sql_list[i].to_user}</p><p>${sql_list[i].message}</p></li>`;
    i = i + 1;
  }
  list = list+'</ul>';
  return list;
}





// middleware function to check for logged-in users
var sessionChecker = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('/login');
    } else {
        next();
    }
};




// Create a router for the admin
// When they login using admin credentials

router.get('/user_report', sessionChecker, (req, res) => {
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


router.get('/user',sessionChecker, (req, res)=>{
  var username = req.query.username;
  var title = 'User Info';
  var value = 'username';
  console.log("Session name at user: ", req.session.username);
  User.get_user_by_value(value,username,(err,user)=>{
    console.log('call user by value');
    console.log(user);
    if (err){
      res.send(err);
      console.log('res', user);
    } else {
      res.render('user.ejs', {title: title, body: [user[0].username, user[0].balance]});
    }
  });
});

//TODO:make sure transaction isn't over 1000
router.post('/user',(req, res) => {
  var post = req.body;
  var to_user = post.to_user;
  var amount = parseInt(post.amount);
  var message = post.message;
  var from_user = req.session.username;
  var value = 'username';
  if (amount < 0 || amount > 1000){
    console.log('Wrong amount input!');
    res.redirect('/user');
  }
  if (to_user == from_user) {
    console.log('You cannot send points to yourself!');
    res.redirect('/user');
  } else {
    User.get_user_by_value(value, from_user, (err, user) => {
      if (err){
        res.send(err);
        console.log('user err res', user);
      }else {
         from_user_id = user[0].user_id;
         user_amount = user[0].balance;
         user_monthly = user[0].monthly_points;
         Transaction.send_transaction(from_user_id, to_user, amount, message, (err, result) => {
           console.log('starting transaction stored procedure');
           if (err){
             res.send(err);
             console.log('res', result);
           } else {
             //Update the User Balances and monthly_points
             target_column = 'balance'
             from_target_value = user_amount - amount;
             to_target_value = user_amount + amount;
             console.log('from_target_value: ', from_target_value);
             console.log('to_target_value: ', to_target_value);
             //for the from_user
             User.update_user_by_id(from_user_id, target_column, from_target_value, (err, update_result)=>{
               if(err){
                 res.send(err);
                 console.log('update res: ', update_result);
               } else{
                 // for the to user
                 User.update_user_by_id(to_user, target_column, to_target_value, (err, update_to_result) =>{
                   if (err){
                     res.send(err);
                     console.log('update to res: ', update_to_result);
                   } else {
                     //update monthly_points for the from_user only
                     target_column = 'monthly_points'
                     new_monthly_points = user_monthly - amount;
                     User.update_user_by_id(from_user_id, target_column, new_monthly_points, (err, monthly_points_result)=>{
                       if (err){
                         res.send(err);
                         console.log('monthly error res: ', monthly_points_result);
                       } else {
                         console.log('result: ', monthly_points_result);
                         console.log('Transaction Successful!');
                         link = '/user?username=';
                         console.log(result);
                         redirection_link = link.concat(from_user);
                         res.redirect(redirection_link);
                       }
                     });

                   }
                 });
               }
             });
           }
         });
      }
    });
  }
});

//aggregate_report
//TODO: use the views from the models
router.get('/aggregate_report', sessionChecker, (req, res)=>{
  Transaction.get_points_by_month((err, trans_points_result)=>{
    if(err){
      res.send(err);
      console.log('report1 res: ', trans_points_result);
    } else{
      Giftcard.get_cards_by_month((err, card_points_result)=>{
        if(err){
          res.send(err);
          console.log('report2 res: ', card_points_result);
        } else{
          Transaction.get_user_points_received((err, user_points_result)=>{
            if(err){
              res.send(err);
              console.log('report3 res: ', user_points_result);
            } else{
              var monthly_trans_list = trans_point_list_template(trans_points_result);
              var card_monthly_list = card_point_list_template(card_points_result);
              var user_points_received = points_received_list_template(user_points_result);
              res.render('aggregate_report.ejs', {report1: monthly_trans_list, report2:card_monthly_list, report3: user_points_received} );
            }
          });
        }
      });
    }
  });
});

//leftovers
router.get('/leftovers', sessionChecker, (req, res) => {
  User.get_hoarding_users((err, result)=>{
    if (err){
      res.send(err);
      console.log('error res: ', result);
    } else {
      var hoarding_users_list = hoarding_users_template(result);
      res.render('leftovers.ejs', {report1: hoarding_users_list})
    }
  });
});

//redemptions
router.get('/redemptions', sessionChecker, (req, res) => {
  Giftcard.get_cards_by_month((err, result)=>{
    if(err){
      res.send(err);
      console.log('error res: ', result);
    } else {
      var card_monthly_list = card_point_list_template(result);
      res.render('redemptions.ejs', {report1: card_monthly_list});
    }
  });
});


//Messages
router.get('/messages', sessionChecker, (req, res)=>{
  //get the user_id
  var value_name = 'username';
  var value = req.session.username;
  User.get_user_by_value(value_name, value, (err, user_result)=>{
    if (err){
      res.send(err);
      console.log('error res: ', user_result);
    } else {
      var trans_value_name = 'to_user';
      var user_id = user_result[0].user_id
      Transaction.get_transactions_by_value(trans_value_name, user_id, (err, trans_result)=>{
        if (err){
          res.send(err);
          console.log('error res: ', trans_result);
        } else{
          var transactions = transaction_message_template(trans_result);
          res.render('messages.ejs', {report1: transactions});
        }
      });
    }
  });

});






module.exports = router;
