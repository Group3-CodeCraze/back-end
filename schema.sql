DROP TABLE IF EXISTS GenTasks;

CREATE TABLE IF NOT EXISTS GenTasks(
    id SERIAL PRIMARY KEY,
    task_type VARCHAR(255),
    due_date DATE,
    activity VARCHAR(255),
    comments TEXT,
    is_completed boolean
);