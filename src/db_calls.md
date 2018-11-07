# DDL DML Calls

## Creating Tables

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance INT NOT NULL,
    is_admin BOOLEAN,
    PRIMARY KEY(user_id)
);


CREATE TABLE GIftcard (
	card_id INT NOT NULL AUTO_INCREMENT,
	user_id INT NOT NULL,
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
	message VARCHAR
	PRIMARY KEY (transaction_id),
	FOREIGN KEY(from) REFERENCES Users(user_id) ON DELETE NO ACTION,
	FOREIGN KEY(to) REFERENCES Users(user_id) ON DELETE NO ACTION
);


INSERT INTO transactions VALUES (2,3, 5, '2018-8-26 17:00:00', 50, ‘message’);


#Stored Procedure

DELIMITER // 
CREATE PROCEDURE `send_transaction` (IN from_user INT, IN to_user INT, IN amount INT, IN message VARCHAR(255))
BEGIN
	INSERT INTO transactions (from_user, to_user, trans_date, amount, message) VALUES (from_user, to_user, NOW(), amount, message);
END // DELIMITER ;

SHOW PROCEDURE STATUS;

INSERT INTO transactions (from_user, to_user, trans_date, amount) VALUES (from_user, to_user, NOW(), amount, message);



#Trigger

##Amount Check

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


##Reset Points

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



#View

##Aggregate View

##All gift card points

CREATE VIEW giftcard_points AS
    -> SELECT SUM(points) AS total
    -> FROM giftcard;


##All used points (current month)

CREATE VIEW all_used_points AS
SELECT SUM(amount) AS total_points_used
FROM transactions WHERE MONTH(trans_date) = MONTH(CURRENT_DATE()) AND YEAR(trans_date) = YEAR(CURRENT_DATE());

##ALL used points (sorted by month)

CREATE VIEW points_by_month AS
SELECT YEAR(trans_date) AS year, MONTH(trans_date) AS month, SUM(amount) AS
monthly_points
FROM transactions WHERE EXTRACT(MONTH FROM trans_date)
GROUP BY YEAR(trans_date), MONTH(trans_date);


##Created Giftcards (sorted by month)

CREATE VIEW cards_by_month AS
SELECT YEAR(date_created) AS year, MONTH(date_created) AS month, SUM(points) AS
points
FROM giftcard WHERE EXTRACT(MONTH FROM date_created)
GROUP BY YEAR(date_created), MONTH(date_created);


##Points Received

CREATE VIEW user_points_received AS
SELECT to_user AS user_id, SUM(amount) AS tot_amount
FROM transactions
GROUP BY to_user
ORDER BY tot_amount DESC;


##Users who haven’t used all their points


SELECT username, balance FROM users
WHERE balance > 0;
