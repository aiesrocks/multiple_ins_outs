CREATE USER "301_03" IDENTIFIED BY "301_03";
GRANT CREATE TABLE TO "301_03";


CREATE TABLE "301_03".statement_method (cc_no varchar(20) PRIMARY KEY, method varchar(20));

CREATE TABLE "301_03".statements 
	(statement_id varchar(64) PRIMARY KEY,
	 ccno varchar(20) NOT NULL, 
	 period varchar(10) NOT NULL,
	 CONSTRAINT STATEMENTS_STATEMENT_METHOD_FK FOREIGN KEY (ccno) REFERENCES "301_03".statement_method(cc_no)
	);



-- CREATE TABLE "301_03".STATEMENTS (
-- 	STATEMENT_ID VARCHAR(64) NOT NULL,
-- 	CCNO VARCHAR(20) NOT NULL,
-- 	PERIOD VARCHAR2(10) NULL,
-- 	CONSTRAINT STATEMENTS_PK PRIMARY KEY (STATEMENT_ID),
-- 	CONSTRAINT STATEMENTS_STATEMENT_METHOD_FK FOREIGN KEY (CCNO) REFERENCES "301_03".STATEMENT_METHOD(CC_NO)
-- );


ALTER USER "301_03" quota unlimited ON USERS;


INSERT ALL
	INTO "301_03".statement_method (cc_no,method) VALUES ('111111111','sms')
	INTO "301_03".statement_method (cc_no,method) VALUES ('111111112','sms')
	INTO "301_03".statement_method (cc_no,method) VALUES ('444444441','post')
	INTO "301_03".statement_method (cc_no,method) VALUES ('555555551','email')
	INTO "301_03".statement_method (cc_no,method) VALUES ('555555552','email')
	INTO "301_03".statement_method (cc_no,method) VALUES ('555555553','post')
	INTO "301_03".statement_method (cc_no,method) VALUES ('333333331','post')
SELECT 1 FROM DUAL;	


INSERT ALL 
	INTO "301_03".statements (statement_id,ccno,period) VALUES ('abh320bkjh45','111111111','0624')
	INTO "301_03".statements (statement_id,ccno,period) VALUES ('2130495ryuhj','111111112','0624')
	INTO "301_03".statements (statement_id,ccno,period) VALUES ('193uj54rnqa7','444444441','0624')
	INTO "301_03".statements (statement_id,ccno,period) VALUES ('n3412oiu2n59','444444441','0624')
	INTO "301_03".statements (statement_id,ccno,period) VALUES ('09ih1234erae','555555552','0624')
	INTO "301_03".statements (statement_id,ccno,period) VALUES ('n30asdnr32nm','555555553','0624')
	INTO "301_03".statements (statement_id,ccno,period) VALUES ('0913h42nb5n1','333333331','0624')
SELECT 1 FROM DUAL;	