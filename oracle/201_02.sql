CREATE USER "201_02" IDENTIFIED BY "201_02";
GRANT CREATE TABLE TO "201_02";


CREATE TABLE "201_02".billing_address (card_no varchar(64) NOT NULL, address varchar(64) NOT NULL, cus_id varchar(64) DEFAULT ('000000') NOT NULL);

CREATE TABLE "201_02".cards(cus_id varchar(64) NOT NULL, card_no varchar(20) PRIMARY KEY, expiry_date varchar(64) NOT NULL);


ALTER USER "201_02" quota unlimited ON USERS;

CREATE INDEX cards_cus_id_IDX ON "201_02".cards (cus_id);


INSERT ALL 
	INTO "201_02".cards (cus_id,card_no,expiry_date) VALUES ('111111','111111111','0825')
 	INTO "201_02".cards (cus_id,card_no,expiry_date) VALUES('111111','111111112','0927')
 	INTO "201_02".cards (cus_id,card_no,expiry_date) VALUES('111114','444444441','0925')
 	INTO "201_02".cards (cus_id,card_no,expiry_date) VALUES('111115','555555551','1026')
 	INTO "201_02".cards (cus_id,card_no,expiry_date) VALUES('111115','555555552','1127')
 	INTO "201_02".cards (cus_id,card_no,expiry_date) VALUES('111115','555555553','0325')
 	INTO "201_02".cards (cus_id,card_no,expiry_date) VALUES('111113','333333331','0829')
 	SELECT 1 FROM DUAL;

INSERT ALL
	INTO "201_02".billing_address (card_no,address,cus_id) VALUES ('111111111','1/1 Silom Bangrak BKK','111111')
	INTO "201_02".billing_address (card_no,address,cus_id) VALUES ('111111112','1/1 Silom Bangrak BKK','111111')
	INTO "201_02".billing_address (card_no,address,cus_id) VALUES ('555555551','CP Tower, Rama IX, BKK','111115')
	INTO "201_02".billing_address (card_no,address,cus_id) VALUES ('555555552','CP Tower, Rama IX, BKK','111115')
	INTO "201_02".billing_address (card_no,address,cus_id) VALUES ('555555553','CP Tower, Rama IX, BKK','111115')
	INTO "201_02".billing_address (card_no,address,cus_id) VALUES ('333333331','31/F CP Tower, Rama IX, BKK','111113')
	INTO "201_02".billing_address (card_no,address,cus_id) VALUES ('444444441','15/F Muengthong, Chaengwattana','111114')
	SELECT 1 FROM DUAL;
