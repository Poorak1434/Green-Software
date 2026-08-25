INSERT INTO users (id, email, is_premium) VALUES 
('user_2tXY', 'admin@example.com', true),
('user_3abc', 'test1@example.com', false),
('user_4def', 'test2@example.com', true)
ON CONFLICT (id) DO NOTHING;
