# DDL DML Calls

## Creating Tables

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance INT NOT NULL,
    is_admin BOOLEAN,
    monthly_points INT,
    PRIMARY KEY(user_id)
);


CREATE TABLE Giftcard (
	card_id INT NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
  points INT,
  date_created DATETIME,
	FOREIGN KEY (user_id)
		REFERENCES Users(user_id)
		ON DELETE CASCADE,
	PRIMARY KEY (card_id)
);


CREATE TABLE Transactions (
	transaction_id INT NOT NULL AUTO_INCREMENT,
	from_user INT NOT NULL,
	to_user INT NOT NULL,
	trans_date DATETIME,
	amount int NOT NULL,
	message VARCHAR(255),
	PRIMARY KEY (transaction_id),
	FOREIGN KEY(from_user) REFERENCES Users(user_id) ON DELETE NO ACTION,
	FOREIGN KEY(to_user) REFERENCES Users(user_id) ON DELETE NO ACTION
);

# Creating the users and admin
INSERT INTO users VALUES (0, 'admin', PASSWORD('admin'), 0, 1, 0);
INSERT INTO users VALUES (1, 'employee1', PASSWORD('employee1'), 1000, 0, 1000);
INSERT INTO users VALUES (2, 'employee2', PASSWORD('employee2'), 1000, 0, 1000);
INSERT INTO users VALUES (3, 'employee3', PASSWORD('employee3'), 1000, 0, 1000);
INSERT INTO users VALUES (4, 'employee4', PASSWORD('employee4'), 1000, 0, 1000);
INSERT INTO users VALUES (5, 'employee5', PASSWORD('employee5'), 1000, 0, 1000);


INSERT INTO transactions(from_user, to_user, trans_date, amount, message) VALUES (3, 5, '2018-10-26 17:00:00', 50, 'message');
INSERT INTO transactions(from_user, to_user, trans_date, amount, message) VALUES (2, 5, '2018-10-26 17:00:00', 100, 'Hey thanks!');
INSERT INTO transactions(from_user, to_user, trans_date, amount, message) VALUES (5, 3, '2018-10-26 17:00:00', 100, 'Awesome!');
INSERT INTO transactions(from_user, to_user, trans_date, amount, message) VALUES (3, 4, '2018-10-26 17:00:00', 200, 'You are the best!');



INSERT INTO giftcard(user_id, points, date_created) VALUES ( 1, 10000, '2018-10-26 8:00:00');
INSERT INTO giftcard(user_id, points, date_created) VALUES ( 4, 10000, '2018-10-28 12:00:00');
INSERT INTO giftcard(user_id, points, date_created) VALUES ( 5, 10000, '2018-10-14 9:00:00');
INSERT INTO giftcard(user_id, points, date_created) VALUES (3, 10000, '2018-10-20 17:00:00');


# Stored Procedure

DELIMITER // 
CREATE PROCEDURE `send_transaction` (IN from_user INT, IN to_user INT, IN amount INT, IN message VARCHAR(255))
BEGIN
	INSERT INTO transactions (from_user, to_user, trans_date, amount, message) VALUES (from_user, to_user, NOW(), amount, message);
END // DELIMITER ;

SHOW PROCEDURE STATUS;

INSERT INTO transactions (from_user, to_user, trans_date, amount) VALUES (from_user, to_user, NOW(), amount, message);



# Trigger

## Amount Check

DELIMITER //

CREATE TRIGGER amount_min_check BEFORE INSERT ON Transactions
FOR EACH ROW
BEGIN
	IF NEW.amount < 0 THEN
		SET NEW.amount = 0;
	ELSEIF NEW.amount > 1000 THEN
		SET NEW.amount = 0;
	 END IF;
END;//

DELIMITER ;

SHOW TRIGGERS;


## Reset Points

// start scheduler thread

SET GLOBAL event_scheduler = ON;

// stop scheduler thread

SET GLOBAL event_scheduler = OFF;

DELIMITER $$
CREATE EVENT event1
ON SCHEDULE EVERY '1' MONTH
STARTS '2018-11-01 00:00:00'
DO
BEGIN
	UPDATE users SET monthly_points = 1000;
END$$

DELIMITER ;



# View

## Aggregate View

## All gift card points

CREATE VIEW giftcard_points AS
    -> SELECT SUM(points) AS total
    -> FROM giftcard;


## All used points (current month)

CREATE VIEW all_used_points AS
SELECT SUM(amount) AS total_points_used
FROM transactions WHERE MONTH(trans_date) = MONTH(CURRENT_DATE()) AND YEAR(trans_date) = YEAR(CURRENT_DATE());

## ALL used points (sorted by month)

CREATE VIEW points_by_month AS
SELECT YEAR(trans_date) AS year, MONTH(trans_date) AS month, SUM(amount) AS
monthly_points
FROM transactions WHERE EXTRACT(MONTH FROM trans_date)
GROUP BY YEAR(trans_date), MONTH(trans_date);


## Created Giftcards (sorted by month)

CREATE VIEW cards_by_month AS
SELECT YEAR(date_created) AS year, MONTH(date_created) AS month, SUM(points) AS
points
FROM giftcard WHERE EXTRACT(MONTH FROM date_created)
GROUP BY YEAR(date_created), MONTH(date_created);


## Points Received

CREATE VIEW user_points_received AS
SELECT to_user AS user_id, SUM(amount) AS tot_amount
FROM transactions
GROUP BY to_user
ORDER BY tot_amount DESC;


## Users who haven’t used all their points


SELECT username, balance FROM users
WHERE balance > 0;


## User Functions

## Get All Users

Select * from users

## Get User by Value

SELECT * FROM users WHERE ${value_name} = '${value}


## Update User

UPDATE users SET ${target_column} = '${target_value}' WHERE user_id = ${user_id}


## Get hoarding Users (who haven’t used all their points yet)

SELECT username, monthly_points FROM users WHERE monthly_points > 0


# Giftcard Functions

## Create Card

INSERT INTO giftcard VALUES('${user_id}', 10000)


## Get All Cards

Select * from giftcard

## Remove Card

DELETE FROM giftcard WHERE user_id = ${user_id}

# Giftcard View Function

## Get aggregate card points

SELECT * FROM giftcard_points


## Get cards by month

SELECT * FROM cards_by_month


# Transaction Functions

## Create Transaction

INSERT INTO transactions VALUES '${new_transaction}'


## Get Transactions By ID

SELECT * FROM transactions WHERE transaction_id = ${transaction_id}

## Get Transactions by Value

SELECT * FROM transactions WHERE ${value_name} = '${value}'

## Get all transactions

SELECT * FROM transactions

## Update Transactions by id

UPDATE transactions SET ${target_column} = '${target_value}' WHERE transaction_id = ${transaction_id}


## Remove Transactions

DELETE FROM transactions WHERE transaction_id = ${transaction_id}


## Stored Procedure Call

CALL send_transaction(${from_user},${to_user},${amount},'${message}'


# Transaction Views

## Get all used points

SELECT * FROM all_used_points

## Get points by month

SELECT * FROM points_by_month

## Get user points received

SELECT * FROM user_points_received
