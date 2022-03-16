CREATE TABLE IF NOT EXISTS kv6003_buildings (
    building_code VARCHAR(8) NOT NULL,
    building_name VARCHAR(64) NOT NULL,
    building_number VARCHAR(8) NOT NULL
);

INSERT INTO kv6003_buildings (building_code, building_name, building_number) VALUES
    ('CCE1', 'City Campus East 1', '5'),
    ('CCE2', 'City Campus East 2', '6'),
    ('CIS', 'CIS Building', '4'),
    ('EBA', 'Ellison Building A Block', '10a'),
    ('EBB', 'Ellison Building B Block', '10b'),
    ('EBC', 'Ellison Building C Block', '10c'),
    ('EBD', 'Ellison Building D Block', '10d'),
    ('EBE', 'Ellison Building E Block', '10e'),
    ('LIP', 'Lipman Building', '15'),
    ('NB', 'Northumberland Building', '19'),
    ('SAN', 'Sandyford Building', '22'),
    ('SQX', 'Squires Annexe', '26'),
    ('SQ', 'Squires Building', '27'),
    ('SQW', 'Squires Workshops', '28'),
    ('SUB', 'Sutherland', '30'),
    ('WJB', 'Wynne-Jones Building', '33');

# https://www.northumbria.ac.uk/northumbria-cdn.azureedge.net/-/media/corporate-website/new-sitecore-gallery/undergraduate/campusmapfebruary2020.pdf


