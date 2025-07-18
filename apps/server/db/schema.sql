CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    language VARCHAR(50),
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE virtual_rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    is_active BOOLEAN,
    active_user_count INT,
    room_hash INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE user_virtual_room_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    room_id INT,
    position JSON,
    status ENUM('idle', 'offline', 'online'),
    mic_enabled BOOLEAN,
    video_enabled BOOLEAN,
    screen_sharing BOOLEAN,
    joined_at TIMESTAMP,
    last_seen TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (room_id) REFERENCES virtual_rooms(id)
);

CREATE TABLE chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    user_id INT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES virtual_rooms(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE video_calls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT,
    FOREIGN KEY (room_id) REFERENCES virtual_rooms(id)
);