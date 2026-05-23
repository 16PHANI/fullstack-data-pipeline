-- ============================================================
-- Full-Stack Data Pipeline — Database Schema & Seed Data
-- ============================================================

CREATE DATABASE IF NOT EXISTS customer_db;
USE customer_db;

-- ============================================================
-- CUSTOMERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(120)  NOT NULL,
  email         VARCHAR(180)  NOT NULL UNIQUE,
  phone         VARCHAR(20),
  region        ENUM('North','South','East','West','Central') NOT NULL DEFAULT 'Central',
  plan          ENUM('Basic','Standard','Premium')            NOT NULL DEFAULT 'Basic',
  tenure_months INT           NOT NULL DEFAULT 0,
  monthly_charge DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  total_charges  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  churn         TINYINT(1)   NOT NULL DEFAULT 0,
  risk_score    DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_tenure      CHECK (tenure_months >= 0),
  CONSTRAINT chk_monthly     CHECK (monthly_charge >= 0),
  CONSTRAINT chk_total       CHECK (total_charges  >= 0),
  CONSTRAINT chk_risk        CHECK (risk_score BETWEEN 0 AND 1)
);

-- ============================================================
-- ANALYTICS SNAPSHOTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  snapshot_date   DATE         NOT NULL,
  total_customers INT          NOT NULL DEFAULT 0,
  churned_count   INT          NOT NULL DEFAULT 0,
  high_risk_count INT          NOT NULL DEFAULT 0,
  avg_monthly_charge DECIMAL(8,2) NOT NULL DEFAULT 0.00,
  avg_tenure      DECIMAL(6,2) NOT NULL DEFAULT 0.00,
  churn_rate      DECIMAL(5,4) NOT NULL DEFAULT 0.0000,
  created_at      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_snapshot_date (snapshot_date)
);

-- ============================================================
-- INDEXES FOR QUERY PERFORMANCE
-- ============================================================
CREATE INDEX idx_customers_region   ON customers (region);
CREATE INDEX idx_customers_plan     ON customers (plan);
CREATE INDEX idx_customers_churn    ON customers (churn);
CREATE INDEX idx_customers_risk     ON customers (risk_score);
CREATE INDEX idx_customers_created  ON customers (created_at);

-- ============================================================
-- SEED DATA — 50 representative records
-- ============================================================
INSERT INTO customers (name, email, phone, region, plan, tenure_months, monthly_charge, total_charges, churn, risk_score) VALUES
('Alice Johnson',      'alice.johnson@email.com',   '555-0101', 'North',   'Premium',  36, 89.99, 3239.64, 0, 0.12),
('Bob Martinez',       'bob.martinez@email.com',    '555-0102', 'South',   'Basic',     2, 29.99,   59.98, 1, 0.87),
('Carol White',        'carol.white@email.com',     '555-0103', 'East',    'Standard', 18, 59.99, 1079.82, 0, 0.23),
('David Lee',          'david.lee@email.com',       '555-0104', 'West',    'Premium',  48, 89.99, 4319.52, 0, 0.08),
('Emma Davis',         'emma.davis@email.com',      '555-0105', 'Central', 'Basic',     1, 29.99,   29.99, 1, 0.92),
('Frank Wilson',       'frank.wilson@email.com',    '555-0106', 'North',   'Standard', 24, 59.99, 1439.76, 0, 0.19),
('Grace Taylor',       'grace.taylor@email.com',    '555-0107', 'South',   'Premium',  60, 89.99, 5399.40, 0, 0.05),
('Henry Anderson',     'henry.anderson@email.com',  '555-0108', 'East',    'Basic',     3, 29.99,   89.97, 1, 0.78),
('Isabel Thomas',      'isabel.thomas@email.com',   '555-0109', 'West',    'Standard', 12, 59.99,  719.88, 0, 0.34),
('James Jackson',      'james.jackson@email.com',   '555-0110', 'Central', 'Premium',  72, 89.99, 6479.28, 0, 0.04),
('Karen Harris',       'karen.harris@email.com',    '555-0111', 'North',   'Basic',     6, 29.99,  179.94, 0, 0.55),
('Liam Martin',        'liam.martin@email.com',     '555-0112', 'South',   'Standard', 30, 59.99, 1799.70, 0, 0.16),
('Mia Garcia',         'mia.garcia@email.com',      '555-0113', 'East',    'Premium',  15, 89.99, 1349.85, 0, 0.28),
('Noah Rodriguez',     'noah.rodriguez@email.com',  '555-0114', 'West',    'Basic',     1, 29.99,   29.99, 1, 0.95),
('Olivia Lewis',       'olivia.lewis@email.com',    '555-0115', 'Central', 'Standard', 42, 59.99, 2519.58, 0, 0.11),
('Paul Walker',        'paul.walker@email.com',     '555-0116', 'North',   'Premium',   4, 89.99,  359.96, 1, 0.72),
('Quinn Hall',         'quinn.hall@email.com',      '555-0117', 'South',   'Basic',    54, 29.99, 1619.46, 0, 0.09),
('Rachel Allen',       'rachel.allen@email.com',    '555-0118', 'East',    'Standard',  2, 59.99,  119.98, 1, 0.83),
('Samuel Young',       'samuel.young@email.com',    '555-0119', 'West',    'Premium',  66, 89.99, 5939.34, 0, 0.06),
('Tina Hernandez',     'tina.hernandez@email.com',  '555-0120', 'Central', 'Basic',    10, 29.99,  299.90, 0, 0.47),
('Umar King',          'umar.king@email.com',       '555-0121', 'North',   'Standard', 20, 59.99, 1199.80, 0, 0.22),
('Vera Wright',        'vera.wright@email.com',     '555-0122', 'South',   'Premium',   3, 89.99,  269.97, 1, 0.76),
('Will Lopez',         'will.lopez@email.com',      '555-0123', 'East',    'Basic',    38, 29.99, 1139.62, 0, 0.15),
('Xena Hill',          'xena.hill@email.com',       '555-0124', 'West',    'Standard',  5, 59.99,  299.95, 1, 0.69),
('Yusuf Scott',        'yusuf.scott@email.com',     '555-0125', 'Central', 'Premium',  80, 89.99, 7199.20, 0, 0.03),
('Zara Green',         'zara.green@email.com',      '555-0126', 'North',   'Basic',     8, 29.99,  239.92, 0, 0.51),
('Aaron Adams',        'aaron.adams@email.com',     '555-0127', 'South',   'Standard', 26, 59.99, 1559.74, 0, 0.18),
('Beth Baker',         'beth.baker@email.com',      '555-0128', 'East',    'Premium',   2, 89.99,  179.98, 1, 0.89),
('Carlos Gonzalez',    'carlos.gonzalez@email.com', '555-0129', 'West',    'Basic',    45, 29.99, 1349.55, 0, 0.10),
('Diana Nelson',       'diana.nelson@email.com',    '555-0130', 'Central', 'Standard',  7, 59.99,  419.93, 1, 0.63),
('Ethan Carter',       'ethan.carter@email.com',    '555-0131', 'North',   'Premium',  56, 89.99, 5039.44, 0, 0.07),
('Fiona Mitchell',     'fiona.mitchell@email.com',  '555-0132', 'South',   'Basic',     4, 29.99,  119.96, 1, 0.81),
('George Perez',       'george.perez@email.com',    '555-0133', 'East',    'Standard', 33, 59.99, 1979.67, 0, 0.14),
('Hannah Roberts',     'hannah.roberts@email.com',  '555-0134', 'West',    'Premium',  11, 89.99,  989.89, 0, 0.39),
('Ivan Turner',        'ivan.turner@email.com',     '555-0135', 'Central', 'Basic',     1, 29.99,   29.99, 1, 0.97),
('Julia Phillips',     'julia.phillips@email.com',  '555-0136', 'North',   'Standard', 50, 59.99, 2999.50, 0, 0.08),
('Kevin Campbell',     'kevin.campbell@email.com',  '555-0137', 'South',   'Premium',   6, 89.99,  539.94, 1, 0.68),
('Laura Parker',       'laura.parker@email.com',    '555-0138', 'East',    'Basic',    70, 29.99, 2099.30, 0, 0.05),
('Mike Evans',         'mike.evans@email.com',      '555-0139', 'West',    'Standard',  3, 59.99,  179.97, 1, 0.74),
('Nina Edwards',       'nina.edwards@email.com',    '555-0140', 'Central', 'Premium',  44, 89.99, 3959.56, 0, 0.09),
('Oscar Collins',      'oscar.collins@email.com',   '555-0141', 'North',   'Basic',    16, 29.99,  479.84, 0, 0.42),
('Penny Stewart',      'penny.stewart@email.com',   '555-0142', 'South',   'Standard',  9, 59.99,  539.91, 0, 0.48),
('Ray Sanchez',        'ray.sanchez@email.com',     '555-0143', 'East',    'Premium',   2, 89.99,  179.98, 1, 0.91),
('Sara Morris',        'sara.morris@email.com',     '555-0144', 'West',    'Basic',    28, 29.99,  839.72, 0, 0.20),
('Tom Rogers',         'tom.rogers@email.com',      '555-0145', 'Central', 'Standard', 64, 59.99, 3839.36, 0, 0.06),
('Uma Reed',           'uma.reed@email.com',        '555-0146', 'North',   'Premium',   5, 89.99,  449.95, 1, 0.66),
('Victor Cook',        'victor.cook@email.com',     '555-0147', 'South',   'Basic',    40, 29.99, 1199.60, 0, 0.13),
('Wendy Morgan',       'wendy.morgan@email.com',    '555-0148', 'East',    'Standard',  1, 59.99,   59.99, 1, 0.88),
('Xavier Bell',        'xavier.bell@email.com',     '555-0149', 'West',    'Premium',  76, 89.99, 6839.24, 0, 0.03),
('Yvonne Murphy',      'yvonne.murphy@email.com',   '555-0150', 'Central', 'Basic',    22, 29.99,  659.78, 0, 0.31);

-- ============================================================
-- ANALYTICS SNAPSHOT VIEW
-- ============================================================
CREATE OR REPLACE VIEW vw_analytics_summary AS
SELECT
  COUNT(*)                                          AS total_customers,
  SUM(churn)                                        AS churned_count,
  SUM(CASE WHEN risk_score >= 0.60 THEN 1 ELSE 0 END) AS high_risk_count,
  ROUND(AVG(monthly_charge), 2)                     AS avg_monthly_charge,
  ROUND(AVG(tenure_months), 2)                      AS avg_tenure_months,
  ROUND(SUM(churn) / COUNT(*), 4)                   AS churn_rate,
  ROUND(SUM(CASE WHEN risk_score >= 0.60 THEN 1 ELSE 0 END) / COUNT(*), 4) AS high_risk_rate
FROM customers;

-- ============================================================
-- REGIONAL BREAKDOWN VIEW
-- ============================================================
CREATE OR REPLACE VIEW vw_regional_breakdown AS
SELECT
  region,
  COUNT(*)                                             AS total,
  SUM(churn)                                           AS churned,
  ROUND(AVG(monthly_charge), 2)                        AS avg_charge,
  ROUND(AVG(risk_score), 4)                            AS avg_risk,
  ROUND(SUM(churn) / COUNT(*), 4)                      AS churn_rate
FROM customers
GROUP BY region
ORDER BY total DESC;
