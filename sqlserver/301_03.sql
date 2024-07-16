USE master;
CREATE DATABASE [301_03];
GO

CREATE TABLE [301_03].dbo.statement_method (cc_no varchar(20) PRIMARY KEY, method varchar(20));

CREATE TABLE [301_03].dbo.statements (statement_id varchar(64) PRIMARY KEY, ccno varchar(20) not null FOREIGN KEY REFERENCES statement_method (cc_no), period varchar(10) not null,  );

INSERT INTO [301_03].dbo.statement_method (cc_no,method) VALUES
	 ('111111111','sms'),
	 ('111111112','sms'),
	 ('444444441','post'),
	 ('555555551','email'),
	 ('555555552','email'),
	 ('555555553','post'),
	 ('333333331','post');


INSERT INTO [301_03].dbo.statements (statement_id,ccno,period) VALUES
	 ('abh320bkjh45','111111111','0624'),
	 ('2130495ryuhj','111111112','0624'),
	 ('193uj54rnqa7','444444441','0624'),
	 ('n3412oiu2n59','444444441','0624'),
	 ('09ih1234erae','555555552','0624'),
	 ('n30asdnr32nm','555555553','0624'),
	 ('0913h42nb5n1','333333331','0624');

