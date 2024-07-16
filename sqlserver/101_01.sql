USE master;
CREATE DATABASE [101_01];
GO

CREATE TABLE [101_01].dbo.customers (cus_id varchar(64) NOT NULL, name varchar(64) NOT NULL);

INSERT INTO [101_01].dbo.customers (cus_id, name) VALUES('111111', 'Harry Potter');
INSERT INTO [101_01].dbo.customers (cus_id, name) VALUES('111112', 'Ronald Weasley');
INSERT INTO [101_01].dbo.customers (cus_id, name) VALUES('111113', 'Hermione Granger');
INSERT INTO [101_01].dbo.customers (cus_id, name) VALUES('111114', 'Luna Lovegood');
INSERT INTO [101_01].dbo.customers (cus_id, name) VALUES('111115', 'Draco Malfoy');
INSERT INTO [101_01].dbo.customers (cus_id, name) VALUES('111116', 'Cedric Diggory');