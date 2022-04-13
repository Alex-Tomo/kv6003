CREATE TABLE IF NOT EXISTS kv6003_entry_requirements (
    course_code VARCHAR(16) PRIMARY KEY,
    tariff_points TEXT NOT NULL,
    subject_requirements TEXT,
    gcse_requirements TEXT,
    english_requirements TEXT,
    additional_requirements TEXT
);

INSERT INTO kv6003_entry_requirements (course_code, tariff_points, subject_requirements, gcse_requirements, english_requirements, additional_requirements) VALUES
    ('GF44', '120 UCAS tariff points', 'No subject requirements', 'Maths and English Language at minimum grade 4/C or equivalent', 'International applicants should have a minimum overall IELTS (Academic) score of 6.0 with 5.5 in each component', 'No additional requirements'),
    ('G4W3', '120 UCAS tariff points', 'No subject requirements', 'Maths and English Language at minimum grade 4/C or equivalent', 'International applicants should have a minimum overall IELTS (Academic) score of 6.0 with 5.5 in each component', 'No additional requirements'),
    ('G400', '120 UCAS tariff points', 'No subject requirements', 'Maths and English Language at minimum grade 4/C or equivalent', 'International applicants should have a minimum overall IELTS (Academic) score of 6.0 with 5.5 in each component', 'No additional requirements'),
    ('G403', '120 UCAS tariff points', 'No subject requirements', 'Maths and English Language at minimum grade 4/C or equivalent', 'International applicants should have a minimum overall IELTS (Academic) score of 6.0 with 5.5 in each component', 'No additional requirements'),
    ('G405', '120 UCAS tariff points', 'No subject requirements', 'Maths and English Language at minimum grade 4/C or equivalent', 'International applicants should have a minimum overall IELTS (Academic) score of 6.0 with 5.5 in each component', 'No additional requirements'),
    ('G404', '120 UCAS tariff points', 'No subject requirements', 'Maths and English Language at minimum grade 4/C or equivalent', 'International applicants should have a minimum overall IELTS (Academic) score of 6.0 with 5.5 in each component', 'No additional requirements');