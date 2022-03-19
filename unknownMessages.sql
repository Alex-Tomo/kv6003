CREATE TABLE IF NOT EXISTS kv6003_unknown_messages (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    message VARCHAR(256)
);


CREATE TABLE IF NOT EXISTS kv6003_incorrect_messages (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_message VARCHAR(256),
    bot_message VARCHAR(256)
);

