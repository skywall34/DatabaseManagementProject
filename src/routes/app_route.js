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

*/

let AccountModel = require('../models/app_model.js');
let express = require('express');
let router = express.Router();


module.exports = router;
