CREATE USER "101_01" IDENTIFIED BY "101_01";
GRANT CREATE TABLE TO "101_01";
CREATE TABLE "101_01".customers (cus_id varchar(64) NOT NULL, name varchar(64) NOT NULL);
ALTER USER "101_01" quota unlimited ON USERS;

INSERT INTO "101_01".customers (cus_id, name) VALUES('111111', 'Harry Potter');
INSERT INTO "101_01".customers (cus_id, name) VALUES('111112', 'Ronald Weasley');
INSERT INTO "101_01".customers (cus_id, name) VALUES('111113', 'Hermione Granger');
INSERT INTO "101_01".customers (cus_id, name) VALUES('111114', 'Luna Lovegood');
INSERT INTO "101_01".customers (cus_id, name) VALUES('111115', 'Draco Malfoy');
INSERT INTO "101_01".customers (cus_id, name) VALUES('111116', 'Cedric Diggory');


