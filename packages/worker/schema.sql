DROP TABLE IF EXISTS registrations;
CREATE TABLE registrations (
  id VARCHAR(10) PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  semester TEXT NOT NULL,
  branch TEXT NOT NULL,
  college TEXT NOT NULL,
  registration_date DATETIME NOT NULL
);
