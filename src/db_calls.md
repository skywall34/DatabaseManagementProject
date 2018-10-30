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
	from INT NOT NULL,
	to INT NOT NULL,
	trans_date DATETIME,
	amount int NOT NULL,
	PRIMARY KEY (transaction_id),
	FOREIGN KEY(from) REFERENCES Users(user_id) ON DELETE NO ACTION,
	FOREIGN KEY(to) REFERENCES Users(user_id) ON DELETE NO ACTION
);


