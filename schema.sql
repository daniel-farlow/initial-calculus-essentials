CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(50)
);

CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    problem_statement VARCHAR,
    problem_type VARCHAR,
    problem_answer VARCHAR,
    problem_solution VARCHAR,
    category_id INTEGER REFERENCES categories(id)
);

CREATE TABLE user_answers (
    id SERIAL PRIMARY KEY,
    answer VARCHAR,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    user_id INTEGER REFERENCES users(id),
    problem_id INTEGER REFERENCES problems(id)
);