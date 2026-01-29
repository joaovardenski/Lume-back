CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  important BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE password_resets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  valid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

