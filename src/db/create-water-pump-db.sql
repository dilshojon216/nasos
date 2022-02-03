USE test_db;
DROP TABLE IF EXISTS water_pump; 

CREATE TABLE IF NOT EXISTS water_pump 
  ( 
     id         INT PRIMARY KEY auto_increment, 
     name_pump   VARCHAR(25)  NOT NULL, 
     region   VARCHAR(50) NOT NULL, 
     district  VARCHAR(50) NOT NULL, 
     balans_tash      VARCHAR(50)  NOT NULL, 
     code       VARCHAR(25) UNIQUE NOT NULL,
     lat       VARCHAR(25) ,
     lon VARCHAR(25) ,
     topic VARCHAR(25) UNIQUE  NOT NULL ,
     phone_number  VARCHAR(25),
     volume_today VARCHAR(25)
  );