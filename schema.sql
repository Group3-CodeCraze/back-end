DROP TABLE IF EXISTS GenTasks;

CREATE TABLE IF NOT EXISTS GenTasks(
    id SERIAL PRIMARY KEY,
    task_type VARCHAR(255),
    due_date DATE,
    activity VARCHAR(255),
    comments TEXT,
    is_completed boolean
);
DROP TABLE IF EXISTS users;


CREATE TABLE IF NOT EXISTS users (
    id  SERIAL ,
    username  VARCHAR(255) PRIMARY KEY,
    email  VARCHAR(255) UNIQUE,
    password VARCHAR(255)
);

