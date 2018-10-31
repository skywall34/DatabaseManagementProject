// Specific logic when a user enters an input on a certain url format or API calls
// handles views and controller
// GET PUT DELETE POST
// These routes would be referenced in the index.js file
/*
Example
router.get('/tasks', (req, res) => {
  Task.getAllTask(function(err, task) { //getAllTask is a function inside of models

    console.log('controller')
    if (err)
      res.send(err);
      console.log('res', task);
    res.send(task);
  });
});


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



router.get('/users', (req, res) => {
  User.get_all_users((err, user) => {
    console.log('router get users');
    if (err){
      res.send(err);
      console.log('res', user);
    } else {
      res.send(user);
    }
  });
});






module.exports = router;
