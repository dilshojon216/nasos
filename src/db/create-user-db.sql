DROP TABLE IF EXISTS users; 
CREATE TABLE IF NOT EXISTS users 
  (  id         INT PRIMARY KEY auto_increment, 
     username   VARCHAR(25) UNIQUE NOT NULL, 
     password   CHAR(60) NOT NULL, 
     first_name VARCHAR(50) NOT NULL, 
     role       ENUM('Admin', 'SuperUser') DEFAULT 'SuperUser'
  )