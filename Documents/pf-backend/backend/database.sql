CREATE DATABASE PeopleFirst;


CREATE TABLE delegatesorgan(
 id SERIAL PRIMARY KEY,
 title VARCHAR(255) NOT NULL,
 lastEngagement VARCHAR(255) NOT NULL,
  delegateamount VARCHAR(255) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'Not Engaged';
);

- - Insert data into delegatesorgan table
INSERT INTO delegateorgans (organname, delegateAmount, lastengagement, lastmeeting) VALUES
    ('National Women’s Congress', 15, '2025-01-29', '2025-01-29'),
    ('National Young Congress', 15, '2025-01-29', '2025-01-29'),
    ('National Union of APC Students', 20, '2025-01-29', '2025-01-29'),
    ('Diaspora (Each from 22 Districts, and 26 Chapters)', 50, '2025-01-29', '2025-01-29'),
    ('National Veteran Congress (At least 1 from each region)', 15, '2025-01-29', '2025-01-29'),

    -- Constituencies
    ('Kailahun Constituencies', 80, '2025-01-29', '2025-01-29'),
    ('Kenema Constituencies', 88, '2025-01-29', '2025-01-29'),
    ('Kono Constituencies', 72, '2025-01-29', '2025-01-29'),
    ('Bombali Constituencies', 64, '2025-01-29', '2025-01-29'),
    ('Falaba Constituencies', 32, '2025-01-29', '2025-01-29'),
    ('Koinadugu Constituencies', 32, '2025-01-29', '2025-01-29'),
    ('Tonkolili Constituencies', 80, '2025-01-29', '2025-01-29'),
    ('Kambia Constituencies', 48, '2025-01-29', '2025-01-29'),
    ('Karene Constituencies', 40, '2025-01-29', '2025-01-29'),
    ('Portloko Constituencies', 80, '2025-01-29', '2025-01-29'),
    ('Bo Constituencies', 88, '2025-01-29', '2025-01-29'),
    ('Bonthe Constituencies', 32, '2025-01-29', '2025-01-29'),
    ('Moyamba Constituencies', 40, '2025-01-29', '2025-01-29'),
    ('Pujehun Constituencies', 48, '2025-01-29', '2025-01-29'),
    ('Western Rural Constituencies', 64, '2025-01-29', '2025-01-29'),
    ('Western Urban Constituencies', 160, '2025-01-29', '2025-01-29'),

    -- Local Councils
    ('Local Council Kailahun', 2, '2025-01-29', '2025-01-29'),
    ('Local Council Kenema', 5, '2025-01-29', '2025-01-29'),
    ('Local Council Kono', 5, '2025-01-29', '2025-01-29'),
    ('Local Council Bombali', 10, '2025-01-29', '2025-01-29'),
    ('Local Council Falaba', 5, '2025-01-29', '2025-01-29'),
    ('Local Council Koinadugu', 5, '2025-01-29', '2025-01-29'),
    ('Local Council Tonkolili', 5, '2025-01-29', '2025-01-29'),
    ('Local Council Kambia', 5, '2025-01-29', '2025-01-29'),
    ('Local Council Karene', 5, '2025-01-29', '2025-01-29'),
    ('Local Council Portloko', 10, '2025-01-29', '2025-01-29'),
    ('Local Council Bo', 5, '2025-01-29', '2025-01-29'),
    ('Local Council Bonthe', 1, '2025-01-29', '2025-01-29'),
    ('Local Council Moyamba', 4, '2025-01-29', '2025-01-29'),
    ('Local Council Pujehun', 0, '2025-01-29', '2025-01-29'),
    ('Local Council Western Rural', 5, '2025-01-29', '2025-01-29'),
    ('Local Council Western Urban', 5, '2025-01-29', '2025-01-29'),

    -- Party Structure
    ('NAC', 34, '2025-01-29', '2025-01-29'),
    ('NEC', 6, '2025-01-29', '2025-01-29'),
    ('National Officers', 31, '2025-01-29', '2025-01-29'),

    -- Regional Executive Committees
    ('Eastern Region Executive Committee', 24, '2025-01-29', '2025-01-29'),
    ('Northern Region Executive Committee', 25, '2025-01-29', '2025-01-29'),
    ('Northwestern Region Executive Committee', 24, '2025-01-29', '2025-01-29'),
    ('Southern Region Executive Committee', 25, '2025-01-29', '2025-01-29'),
    ('Western Region Executive Committee', 23, '2025-01-29', '2025-01-29'),
    ('Diaspora Region Executive Committee', 43, '2025-01-29', '2025-01-29'),

    -- District Executive Committees
    ('Kailahun District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Kenema District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Kono District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Bombali District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Falaba District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Koinadugu District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Tonkolili District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Kambia District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Karene District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Portloko District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Bo District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Bonthe District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Moyamba District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Pujehun District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Western Rural District Executive', 20, '2025-01-29', '2025-01-29'),
    ('Western Urban District Executive', 20, '2025-01-29', '2025-01-29'),

    ('Current Members of Parliament of the Party', 54, '2025-01-29', '2025-01-29'),
    ('Elders Council', 21, '2025-01-29', '2025-01-29'),

    -- Affiliates
    ('Affiliates Groups (2% of Delegates)', 2, '2025-01-29', '2025-01-29'),
    ('Persons with Disability', 5, '2025-01-29', '2025-01-29');




CREATE TABLE delegateorgans (
    id SERIAL PRIMARY KEY,
    organname VARCHAR(255) NOT NULL,
    delegateamount INT NOT NULL,
    last_engagement DATE NOT NULL
);


SELECT 
    organname, 
    delegateamount, 
    TO_CHAR(lastengagement, 'FMMonth DD, YYYY') AS formatted_last_engagement,
    TO_CHAR(lastmeeting, 'FMMonth DD, YYYY') AS formatted_last_meeting
FROM delegateorgans;


CREATE TABLE delegates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    phonenumber VARCHAR(255),
  email VARCHAR(255),
  address VARCHAR(255),
  constituency VARCHAR(255),
   profilepic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    supportstatus TEXT CHECK (supportstatus IN ('supports', 'opposes', 'neutral')),
    organname TEXT REFERENCES delegateorgans(organname) ON DELETE CASCADE
);

    INSERT INTO delegates (name, role, phonenumber, email, address, constituency, profilepic, supportstatus, organname, organ_id) VALUES
-- National Women’s Congress
('Fatmata Kallon', 'Women’s Rights Advocate', '+232-76-123456', 'fatmata.kallon@example.com', 'Freetown', 'National Women’s Congress', NULL, 'supports', 'National Women’s Congress', 
 (SELECT id FROM delegateorgans WHERE organname = 'National Women’s Congress')),

-- National Young Congress
('Alusine Kamara', 'Youth Mobilizer', '+232-78-654321', 'alusine.kamara@example.com', 'Bo', 'National Young Congress', NULL, 'opposes', 'National Young Congress', 
 (SELECT id FROM delegateorgans WHERE organname = 'National Young Congress')),

-- National Union of APC Students
('Sorie Bangura', 'Student Representative', '+232-77-987654', 'sorie.bangura@example.com', 'Makeni', 'National Union of APC Students', NULL, 'neutral', 'National Union of APC Students', 
 (SELECT id FROM delegateorgans WHERE organname = 'National Union of APC Students')),

-- Diaspora (22 Districts, 26 Chapters)
('Isatu Sesay', 'Diaspora Liaison Officer', '+232-30-567890', 'isatu.sesay@example.com', 'London, UK', 'Diaspora', NULL, 'supports', 'Diaspora (Each from 22 Districts, and 26 Chapters)', 
 (SELECT id FROM delegateorgans WHERE organname = 'Diaspora (Each from 22 Districts, and 26 Chapters)')),

-- National Veteran Congress
('Momoh Koroma', 'Veteran Political Advisor', '+232-33-234567', 'momoh.koroma@example.com', 'Kenema', 'National Veteran Congress', NULL, 'opposes', 'National Veteran Congress', 
 (SELECT id FROM delegateorgans WHERE organname = 'National Veteran Congress (At least 1 from each region)')),

-- Regional Constituencies
('Mohamed Jalloh', 'Local Representative', '+232-76-345678', 'mohamed.jalloh@example.com', 'Kailahun', 'Kailahun', NULL, 'neutral', 'Kailahun', 
 (SELECT id FROM delegateorgans WHERE organname = 'Kailahun')),

('Adama Conteh', 'Community Leader', '+232-78-456789', 'adama.conteh@example.com', 'Kenema', 'Kenema', NULL, 'supports', 'Kenema', 
 (SELECT id FROM delegateorgans WHERE organname = 'Kenema')),

('Abdulai Turay', 'Political Coordinator', '+232-77-567890', 'abdulai.turay@example.com', 'Kono', 'Kono ', NULL, 'opposes', 'Kono', 
 (SELECT id FROM delegateorgans WHERE organname = 'Kono')),

('Zainab Mansaray', 'Youth Engagement Officer', '+232-30-678901', 'zainab.mansaray@example.com', 'Bombali', 'Bombali ', NULL, 'neutral', 'Bombali', 
 (SELECT id FROM delegateorgans WHERE organname = 'Bombali')),

('Ibrahim Kargbo', 'Policy Analyst', '+232-33-789012', 'ibrahim.kargbo@example.com', 'Falaba', 'Falaba ', NULL, 'supports', 'Falaba', 
 (SELECT id FROM delegateorgans WHERE organname = 'Falaba')),

('Jeneba Kamara', 'Women’s Rights Advocate', '+232-76-890123', 'jeneba.kamara@example.com', 'Koinadugu', 'Koinadugu ', NULL, 'opposes', 'Koinadugu', 
 (SELECT id FROM delegateorgans WHERE organname = 'Koinadugu')),

('Saidu Bangura', 'Community Development Officer', '+232-78-901234', 'saidu.bangura@example.com', 'Tonkolili', 'Tonkolili ', NULL, 'neutral', 'Tonkolili', 
 (SELECT id FROM delegateorgans WHERE organname = 'Tonkolili')),

('Mariam Sesay', 'Grassroots Mobilizer', '+232-77-012345', 'mariam.sesay@example.com', 'Kambia', 'Kambia ', NULL, 'supports', 'Kambia', 
 (SELECT id FROM delegateorgans WHERE organname = 'Kambia')),

('John Koroma', 'Political Analyst', '+232-30-123456', 'john.koroma@example.com', 'Karene', 'Karene ', NULL, 'opposes', 'Karene', 
 (SELECT id FROM delegateorgans WHERE organname = 'Karene')),

('Nancy Kallon', 'Social Welfare Coordinator', '+232-33-234567', 'nancy.kallon@example.com', 'Portloko', 'Portloko ', NULL, 'neutral', 'Portloko', 
 (SELECT id FROM delegateorgans WHERE organname = 'Portloko')),

('Sahr Bah', 'Local Council Member', '+232-76-345678', 'sahr.bah@example.com', 'Bo', 'Bo ', NULL, 'supports', 'Bo', 
 (SELECT id FROM delegateorgans WHERE organname = 'Bo')),

('James Conteh', 'Regional Coordinator', '+232-78-456789', 'james.conteh@example.com', 'Bonthe', 'Bonthe ', NULL, 'opposes', 'Bonthe', 
 (SELECT id FROM delegateorgans WHERE organname = 'Bonthe')),

('Isata Turay', 'Social Justice Advocate', '+232-77-567890', 'isata.turay@example.com', 'Moyamba', 'Moyamba ', NULL, 'neutral', 'Moyamba', 
 (SELECT id FROM delegateorgans WHERE organname = 'Moyamba')),

 ('Isata Turay', 'Social Justice Advocate', '+232-77-567890', 'isata.turay@example.com', 'Pujehun', 'Pujehun ', NULL, 'neutral', 'Pujehun', 
 (SELECT id FROM delegateorgans WHERE organname = 'Pujehun')),

('Musa Kargbo', 'Regional Organizer', '+232-30-678901', 'musa.kargbo@example.com', 'Western Rural', 'Western Rural ', NULL, 'supports', 'Western Rural', 
 (SELECT id FROM delegateorgans WHERE organname = 'Western Rural')),

('Mariama Bangura', 'Community Engagement Specialist', '+232-76-890123', 'mariama.bangura@example.com', 'Western Urban', 'Western Urban ', NULL, 'neutral', 'Western Urban', 
 (SELECT id FROM delegateorgans WHERE organname = 'Western Urban'));

 -- Local Councils
('Mohamed Jalloh', 'Local Representative', '+232-76-345678', 'mohamed.jalloh@example.com', 'Kailahun', 'Kailahun', NULL, 'neutral', 'Local Councils - Kailahun', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Kailahun')),

('Adama Conteh', 'Community Leader', '+232-78-456789', 'adama.conteh@example.com', 'Kenema', 'Kenema', NULL, 'supports', 'Local Councils - Kenema', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Kenema')),

('Abdulai Turay', 'Political Coordinator', '+232-77-567890', 'abdulai.turay@example.com', 'Kono', 'Kono ', NULL, 'opposes', 'Local Councils - Kono', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Kono')),

('Zainab Mansaray', 'Youth Engagement Officer', '+232-30-678901', 'zainab.mansaray@example.com', 'Bombali', 'Bombali ', NULL, 'neutral', 'Local Councils - Bombali', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Bombali')),

('Ibrahim Kargbo', 'Policy Analyst', '+232-33-789012', 'ibrahim.kargbo@example.com', 'Falaba', 'Falaba ', NULL, 'supports', 'Local Councils - Falaba', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Falaba')),

('Jeneba Kamara', 'Women’s Rights Advocate', '+232-76-890123', 'jeneba.kamara@example.com', 'Koinadugu', 'Koinadugu ', NULL, 'opposes', 'Local Councils - Koinadugu', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Koinadugu')),

('Saidu Bangura', 'Community Development Officer', '+232-78-901234', 'saidu.bangura@example.com', 'Tonkolili', 'Tonkolili ', NULL, 'neutral', 'Local Councils - Tonkolili', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Tonkolili')),

('Mariam Sesay', 'Grassroots Mobilizer', '+232-77-012345', 'mariam.sesay@example.com', 'Kambia', 'Kambia ', NULL, 'supports', 'Local Councils - Kambia', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Kambia')),

('John Koroma', 'Political Analyst', '+232-30-123456', 'john.koroma@example.com', 'Karene', 'Karene ', NULL, 'opposes', 'Local Councils - Karene', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Karene')),

('Nancy Kallon', 'Social Welfare Coordinator', '+232-33-234567', 'nancy.kallon@example.com', 'Portloko', 'Portloko ', NULL, 'neutral', 'Local Councils - Portloko', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Portloko')),

('Sahr Bah', 'Local Council Member', '+232-76-345678', 'sahr.bah@example.com', 'Bo', 'Bo ', NULL, 'supports', 'Local Councils - Bo', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Bo')),

('James Conteh', 'Regional Coordinator', '+232-78-456789', 'james.conteh@example.com', 'Bonthe', 'Bonthe ', NULL, 'opposes', 'Local Councils - Bonthe', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Bonthe')),

('Isata Turay', 'Social Justice Advocate', '+232-77-567890', 'isata.turay@example.com', 'Moyamba', 'Moyamba ', NULL, 'neutral', 'Local Councils - Moyamba', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Moyamba')),

 ('Isata Turay', 'Social Justice Advocate', '+232-77-567890', 'isata.turay@example.com', 'Pujehun', 'Pujehun ', NULL, 'neutral', 'Pujehun', 
 (SELECT id FROM delegateorgans WHERE organname = 'Pujehun')),

('Musa Kargbo', 'Regional Organizer', '+232-30-678901', 'musa.kargbo@example.com', 'Western Rural', 'Western Rural ', NULL, 'supports', 'Local Councils - Western Rural', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Western Rural')),

('Mariama Bangura', 'Community Engagement Specialist', '+232-76-890123', 'mariama.bangura@example.com', 'Western Urban', 'Western Urban ', NULL, 'neutral', 'Local Councils - Western Urban', 
 (SELECT id FROM delegateorgans WHERE organname = 'Local Councils - Western Urban'));

 -- Party Structure
('Mohamed Jalloh', 'Local Representative', '+232-76-345678', 'mohamed.jalloh@example.com', 'Kailahun', 'Kailahun', NULL, 'neutral', 'NAC', 
 (SELECT id FROM delegateorgans WHERE organname = 'NAC')),

('Adama Conteh', 'Community Leader', '+232-78-456789', 'adama.conteh@example.com', 'Kenema', 'Kenema', NULL, 'supports', 'NEC', 
 (SELECT id FROM delegateorgans WHERE organname = 'NEC')),

('Abdulai Turay', 'Political Coordinator', '+232-77-567890', 'abdulai.turay@example.com', 'Kono', 'Kono ', NULL, 'opposes', 'National Officers', 
 (SELECT id FROM delegateorgans WHERE organname = 'National Officers')),

('Zainab Mansaray', 'Youth Engagement Officer', '+232-30-678901', 'zainab.mansaray@example.com', 'Bombali', 'Bombali ', NULL, 'neutral', 'Eastern Region Executive Committee', 
 (SELECT id FROM delegateorgans WHERE organname = 'Eastern Region Executive Committee')),

('Ibrahim Kargbo', 'Policy Analyst', '+232-33-789012', 'ibrahim.kargbo@example.com', 'Falaba', 'Falaba ', NULL, 'supports', 'Northern Region Executive Committee', 
 (SELECT id FROM delegateorgans WHERE organname = 'Northern Region Executive Committee')),

('Jeneba Kamara', 'Women’s Rights Advocate', '+232-76-890123', 'jeneba.kamara@example.com', 'Koinadugu', 'Koinadugu ', NULL, 'opposes', 'Northwestern Region Executive Committee', 
 (SELECT id FROM delegateorgans WHERE organname = 'Northwestern Region Executive Committee')),

('Saidu Bangura', 'Community Development Officer', '+232-78-901234', 'saidu.bangura@example.com', 'Tonkolili', 'Tonkolili ', NULL, 'neutral', 'Southern Region Executive Committee', 
 (SELECT id FROM delegateorgans WHERE organname = 'Southern Region Executive Committee')),

('Mariam Sesay', 'Grassroots Mobilizer', '+232-77-012345', 'mariam.sesay@example.com', 'Kambia', 'Kambia ', NULL, 'supports', 'Western Region Executive Committee', 
 (SELECT id FROM delegateorgans WHERE organname = 'Western Region Executive Committee')),

('John Koroma', 'Political Analyst', '+232-30-123456', 'john.koroma@example.com', 'Karene', 'Karene ', NULL, 'opposes', 'Diaspora Region Executive Committee', 
 (SELECT id FROM delegateorgans WHERE organname = 'Diaspora Region Executive Committee')),

('Nancy Kallon', 'Social Welfare Coordinator', '+232-33-234567', 'nancy.kallon@example.com', 'Portloko', 'Portloko ', NULL, 'neutral', 'District Executive Committee - Kailahun', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Kailahun')),

('Sahr Bah', 'Local Council Member', '+232-76-345678', 'sahr.bah@example.com', 'Bo', 'Bo ', NULL, 'supports', 'District Executive Committee - Kenema', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Kenema')),

('James Conteh', 'Regional Coordinator', '+232-78-456789', 'james.conteh@example.com', 'Bonthe', 'Bonthe ', NULL, 'opposes', 'District Executive Committee - Kono', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Kono')),

('Isata Turay', 'Social Justice Advocate', '+232-77-567890', 'isata.turay@example.com', 'Moyamba', 'Moyamba ', NULL, 'neutral', 'District Executive Committee - Bombali', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Bombali')),

 ('Isata Turay', 'Social Justice Advocate', '+232-77-567890', 'isata.turay@example.com', 'Pujehun', 'Pujehun ', NULL, 'neutral', 'District Executive Committee - Falaba', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Falaba')),

('Musa Kargbo', 'Regional Organizer', '+232-30-678901', 'musa.kargbo@example.com', 'Western Rural', 'Western Rural ', NULL, 'supports', 'District Executive Committee - Koinadugu', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Koinadugu')),

('Mariama Bangura', 'Community Engagement Specialist', '+232-76-890123', 'mariama.bangura@example.com', 'Western Urban', 'Western Urban ', NULL, 'neutral', 'District Executive Committee - Tonkolili', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Tonkolili'));

 INSERT INTO delegates (name, role, phonenumber, email, address, constituency, profilepic, supportstatus, organname, organ_id) VALUES
-- District Executive Committees
('Ibrahim Jalloh', 'Committee Chairman', '+232-76-345678', 'ibrahim.jalloh@example.com', 'Kambia', 'District Executive Committee - Kambia', NULL, 'supports', 'District Executive Committee - Kambia', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Kambia')),

('Mabinty Kamara', 'Women’s Coordinator', '+232-78-456789', 'mabinty.kamara@example.com', 'Karene', 'District Executive Committee - Karene', NULL, 'opposes', 'District Executive Committee - Karene', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Karene')),

('Sahr Sesay', 'Political Advisor', '+232-77-567890', 'sahr.sesay@example.com', 'Portloko', 'District Executive Committee - Portloko', NULL, 'neutral', 'District Executive Committee - Portloko', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Portloko')),

('Adama Kargbo', 'Youth Mobilizer', '+232-30-678901', 'adama.kargbo@example.com', 'Bo', 'District Executive Committee - Bo', NULL, 'supports', 'District Executive Committee - Bo', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Bo')),

('Momodu Bangura', 'Community Leader', '+232-33-789012', 'momodu.bangura@example.com', 'Bonthe', 'District Executive Committee - Bonthe', NULL, 'opposes', 'District Executive Committee - Bonthe', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Bonthe')),

('Kadiatu Conteh', 'Social Welfare Officer', '+232-76-890123', 'kadiatu.conteh@example.com', 'Moyamba', 'District Executive Committee - Moyamba', NULL, 'neutral', 'District Executive Committee - Moyamba', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Moyamba')),

('Ismail Koroma', 'Regional Organizer', '+232-78-901234', 'ismail.koroma@example.com', 'Pujehun', 'District Executive Committee - Pujehun', NULL, 'supports', 'District Executive Committee - Pujehun', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Pujehun')),

('Fatmata Sesay', 'Political Strategist', '+232-77-012345', 'fatmata.sesay@example.com', 'Western Rural', 'District Executive Committee - Western Rural', NULL, 'neutral', 'District Executive Committee - Western Rural', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Western Rural')),

('Alhaji Bah', 'Policy Analyst', '+232-30-123456', 'alhaji.bah@example.com', 'Western Urban', 'District Executive Committee - Western Urban', NULL, 'supports', 'District Executive Committee - Western Urban', 
 (SELECT id FROM delegateorgans WHERE organname = 'District Executive Committee - Western Urban')),

-- Current Members of Parliament
('Musa Kamara', 'Member of Parliament', '+232-33-234567', 'musa.kamara@example.com', 'Freetown', 'Current Members of Parliament', NULL, 'opposes', 'Current Members of Parliament', 
 (SELECT id FROM delegateorgans WHERE organname = 'Current Members of Parliament')),

-- Elders Council
('Hassan Koroma', 'Senior Council Member', '+232-76-345678', 'hassan.koroma@example.com', 'Kenema', 'Elders Council', NULL, 'supports', 'Elders Council', 
 (SELECT id FROM delegateorgans WHERE organname = 'Elders Council')),

-- Affiliates Groups
('Mariama Bangura', 'Community Engagement Officer', '+232-78-456789', 'mariama.bangura@example.com', 'Makeni', 'Affiliates Groups', NULL, 'neutral', 'Affiliates Groups', 
 (SELECT id FROM delegateorgans WHERE organname = 'Affiliates Groups')),

-- Persons with Disabilities
('Sorie Conteh', 'Disability Rights Advocate', '+232-77-567890', 'sorie.conteh@example.com', 'Bo', 'Persons with Disabilities', NULL, 'supports', 'Persons with Disabilities', 
 (SELECT id FROM delegateorgans WHERE organname = 'Persons with Disabilities'));


CREATE TABLE engagements (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    name TEXT NOT NULL,
    time TIME NOT NULL,
    details TEXT,
    delegate_id INT NOT NULL REFERENCES delegates(id) ON DELETE CASCADE,
    organ_id INT NOT NULL REFERENCES delegateorgans(id) ON DELETE CASCADE
);

ALTER TABLE engagements 
ADD COLUMN name TEXT NOT NULL,
ADD COLUMN time TIME NOT NULL,
ADD COLUMN details TEXT;


CREATE TABLE campaigns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    details TEXT NOT NULL,
    category TEXT CHECK (category IN ('Politics', 'Presidential Campaign', 'Health', 'Education')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    payment_methods TEXT[] NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE campaigns 
ADD COLUMN thumbnail TEXT; -- Stores the image filename or URL


const categories = [ "Presidential Campaign", "Health", "Education", "Environment", "Elderly Care", "Labor", "Technology", "Political Support"];


CREATE TABLE surveyresponses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    answers JSONB NOT NULL,  -- Store responses in JSON format
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    questions JSONB NOT NULL, -- Store survey questions in JSON format
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE surveyresponses ADD COLUMN survey_id INT REFERENCES surveys(id) ON DELETE CASCADE;

CREATE TABLE supportmessages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT CHECK (category IN ('Presidential Campaign', 'Health', 'Education', 'Environment', 'Elderly Care', 'Labor', 'Technology', 'Political Support')),
    thumbnail TEXT,
    likes INT DEFAULT 0,
    comments INT DEFAULT 0,
    shares INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, phone_number, password, role) 
VALUES ('Pallo Bangura', '076450307', crypt('password', gen_salt('bf')), 'admin');

CREATE TABLE skills_directory (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    skills TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO skills_directory (name, email, address, date_of_birth, skills) VALUES
('John Doe', 'jdoe@email.com', '23 King Street, Freetown', '1990-05-12', 'Web Development, React, Node.js'),
('Aisha Kamara','aishak@email.com',  '45 Lumley Road, Freetown', '1987-09-25', 'Accounting, Financial Analysis, QuickBooks'),
('Mohamed Conteh','mconteh@email.com',  '12 Wilkinson Road, Freetown', '1995-11-03', 'Data Science, Machine Learning, Python'),
('Fatmata Sesay','fsesay@email.com','78 Aberdeen, Freetown', '1992-07-18', 'UI/UX Design, Figma, Adobe XD'),
('Samuel Koroma','skoroma@email.com', '30 Regent Road, Freetown', '1998-02-10', 'Mobile App Development, React Native, Firebase');