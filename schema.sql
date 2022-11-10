DROP TABLE IF EXISTS users;

CREATE TABLE users
(
    user_id TEXT PRIMARY KEY,
    password TEXT NOT NULL
);

DROP TABLE IF EXISTS leaderboard;

CREATE TABLE leaderboard
(
    user_id TEXT PRIMARY KEY NOT NULL,
    score INTEGER NOT NULL
);

DROP TABLE IF EXISTS likes;

CREATE TABLE likes
(
    yes INTEGER,
    nope INTEGER,
    user_id TEXT PRIMARY KEY
);