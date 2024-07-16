USE master;
CREATE DATABASE [201_02];
GO

CREATE TABLE [201_02].dbo.billing_address (card_no varchar(64) NOT NULL, address varchar(64) NOT NULL, cus_id varchar(64) DEFAULT ('000000') NOT NULL);

CREATE TABLE [201_02].dbo.cards(cus_id varchar(64) NOT NULL, card_no varchar(20) PRIMARY KEY, expiry_date varchar(64) NOT NULL);

CREATE INDEX cards_cus_id_IDX ON [201_02].dbo.cards (cus_id);
GO

INSERT INTO [201_02].dbo.cards (cus_id,card_no,expiry_date) VALUES
	 ('111111','111111111','0825'),
	 ('111111','111111112','0927'),
	 ('111114','444444441','0925'),
	 ('111115','555555551','1026'),
	 ('111115','555555552','1127'),
	 ('111115','555555553','0325'),
	 ('111113','333333331','0829');

INSERT INTO [201_02].dbo.billing_address (card_no,address,cus_id) VALUES
	 ('111111111','1/1 Silom Bangrak BKK','111111'),
	 ('111111112','1/1 Silom Bangrak BKK','111111'),
	 ('555555551','CP Tower, Rama IX, BKK','111115'),
	 ('555555552','CP Tower, Rama IX, BKK','111115'),
	 ('555555553','CP Tower, Rama IX, BKK','111115'),
	 ('333333331','31/F CP Tower, Rama IX, BKK','111113'),
	 ('444444441','15/F Muengthong, Chaengwattana','111114');
