
DROP TABLE IF EXISTS users;


CREATE TABLE IF NOT EXISTS users (
    id  SERIAL ,
    username  VARCHAR(255) PRIMARY KEY,
    email  VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);


DROP TABLE IF EXISTS GenTasks;


CREATE TABLE IF NOT EXISTS tasks (
    id  SERIAL ,
    content VARCHAR(255),
    is_completed boolean


CREATE TABLE IF NOT EXISTS GenTasks(
    id SERIAL PRIMARY KEY,
    username VARCHAR(25)  REFERENCES users(username),
    task_type VARCHAR(255),
    due_date DATE,
    activity VARCHAR(255),
    comments TEXT,
    is_completed boolean
     
);

