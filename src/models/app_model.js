// has the basic database functions
// INSERT, DELETE, and SELECT
let express = require('express');
let sql = require('../server');

//Create a constructor for each table

let User = (user) => {
  this.username = user.username;
  this.password = user.password;
  this.balance = user.balance;
  this.is_admin = user.is_admin;
};

let Giftcard = {};

let Transaction = (transaction) => {
    this.from_user = transaction.from_user;
    this.to_user = transaction.to_user;
    this.trans_date = new Date();
    this.amount = transaction.amount;
};

// User Functions
User.get_all_users = (result) => {
        sql.query("Select * from users", function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                  console.log('tasks : ', res);
                  result(null, res);
                }
            });
};

User.get_user_by_value = (value_name, value, result) => {
  sql.query(`SELECT * FROM users WHERE ${value_name} = '${value}'`, function (err, res){
    if (err) {
      console.log("error: ", err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};


User.update_user_by_id = (user_id, target_column, target_value, result) => {
  sql.query(`UPDATE users SET ${target_column} = '${target_value}' WHERE user_id = ${user_id}`,  function (err, res) {
          if(err) {
              console.log("error: ", err);
              result(null, err);
             }
           else{
             result(null, res);
                }
            });
};

/*
User.remove_user = function(id, result){
     sql.query(`DELETE FROM users WHERE user_id = ${user_id}`, function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{

                 result(null, res);
                }
            });
};
*/

// Giftcard functions

Giftcard.create_card = (user_id, result) => {
        sql.query(`INSERT INTO giftcard VALUES('${user_id}', 10000)`, function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    console.log(res.card_id);
                    result(null, res.card_id);
                }
            });
};

Giftcard.get_all_cards = (result) => {
        sql.query("Select * from giftcard", function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                  console.log('tasks : ', res);
                  result(null, res);
                }
            });
};



Giftcard.remove_card = (id, result) => {
     sql.query(`DELETE FROM giftcard WHERE user_id = ${user_id}`, function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                  result(null, res);
                }
            });
};

//Transaction Model Functions
Transaction.create_transaction = (new_transaction, result) => {
        sql.query(`INSERT INTO transactions SET '${new_transaction}'`, function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    console.log(res.insert_id);
                    result(null, res.insert_id);
                }
            });
};
Transaction.get_transaction_by_id = (transaction_id, result) => {
        sql.query(`SELECT * FROM transactions WHERE transaction_id = ${transaction_id} `,function (err, res) {
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                }
                else{
                    result(null, res);

                }
            });
};
Transaction.get_all_transactions = (result) => {
        sql.query("SELECT * FROM transactions", function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                  console.log('tasks : ', res);
                  result(null, res);
                }
            });
};
Transaction.update_transaction_by_id = (transaction_id, target_column, target_value, result) => {
  sql.query(`UPDATE transactions SET ${target_column} = '${target_value}' WHERE transaction_id = ${transaction_id}`,  function (err, res) {
          if(err) {
              console.log("error: ", err);
              result(null, err);
             }
           else{
             result(null, res);
                }
            });
};
Transaction.remove_transaction = (transaction_id, result) => {
     sql.query(`DELETE FROM transactions WHERE transaction_id = ${transaction_id}`, function (err, res) {

                if(err) {
                    console.log("error: ", err);
                    result(null, err);
                }
                else{
                  result(null, res);
                }
            });
};

//this sends the stored procedure to make a transaction
Transaction.send_transaction = (from_user, to_user, amount, result) => {
  sql.query(`CALL send_transaction(${from_user},${to_user},${amount})`, function(err, res){
    if(err){
      console.log("error: ", err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
}

//Using views
//sql: SELECT * FROM cards_by_month;
// SELECT * FROM points_by_month;


module.exports= {User, Giftcard, Transaction};
