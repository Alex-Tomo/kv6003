CREATE TABLE IF NOT EXISTS kv6003_course_fees (
    course_code VARCHAR(16) PRIMARY KEY,
    uk_fees TEXT,
    international_fees TEXT
);

INSERT INTO kv6003_course_fees (course_code, uk_fees, international_fees) VALUES
    ('GF44', 'Current UK fees are £9,250', 'Current international fees are £16,500'),
    ('G4W3', 'Current UK fees are £9,250', 'Current international fees are £16,500'),
    ('G400', 'Current UK fees are £9,250', 'Current international fees are £16,500'),
    ('G403', 'Current UK fees are £9,250', 'Current international fees are £16,500'),
    ('G405', 'Current UK fees are £9,250', 'Current international fees are £16,500'),
    ('G404', 'Current UK fees are £9,250', 'Current international fees are £16,500');
