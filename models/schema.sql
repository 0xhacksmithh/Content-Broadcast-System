CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('teacher','principal'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  subject VARCHAR(50),
  file_path VARCHAR(255),
  file_type VARCHAR(50),
  file_size INT,
  uploaded_by INT,
  status ENUM('pending','approved','rejected') DEFAULT 'pending',
  rejection_reason TEXT,
  approved_by INT,
  approved_at TIMESTAMP,
  start_time DATETIME,
  end_time DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

CREATE TABLE content_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE content_schedule (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content_id INT,
  rotation_order INT,
  duration INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (content_id) REFERENCES content(id)
);