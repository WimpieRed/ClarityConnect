-- Sample/Test Data for Gap Detection
-- This file contains sample terms and contexts designed to trigger gap detection scenarios
-- Run this after schema.sql to populate test data for gap detection
--
-- Usage:
--   psql -U postgres -d clarityconnect -f seed_gap_test_data.sql
--   OR execute this file in your PostgreSQL client after running schema.sql
--
-- Test Scenarios Included:
--   1. Conflicting Definitions: AML, KYC (different definitions across clusters)
--   2. Missing Contexts: API Gateway, SLA, Cloud Migration, Microservices
--   3. Outdated Contexts: Customer Onboarding, Transaction Monitoring (6+ months old)
--   4. Good Coverage: Data Warehouse, Regulatory Reporting (no gaps expected)
--
-- After loading this data, run gap detection from the Gap Analysis page to see results.
--
-- Use the default admin user ID
-- Note: This assumes the default admin user exists (created in schema.sql)

-- Insert sample terms with various scenarios

-- Term 1: AML (Anti-Money Laundering) - Will have conflicting definitions
INSERT INTO terms (id, term, base_definition, category, tags, created_by, created_at, updated_at)
VALUES (
    '10000000-0000-0000-0000-000000000001',
    'AML',
    'Anti-Money Laundering - A set of procedures, laws, and regulations designed to stop the practice of generating income through illegal actions.',
    'Compliance',
    ARRAY['compliance', 'regulatory', 'finance'],
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Term 1 Contexts - Conflicting definitions across clusters
INSERT INTO term_contexts (id, term_id, cluster, system, context_definition, created_by, created_at, updated_at)
VALUES
    ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Risk Management', 'RiskSys', 'AML refers to the process of identifying and mitigating financial crime risks through transaction monitoring and customer due diligence.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Compliance', 'ComplianceSys', 'AML is a regulatory requirement that mandates reporting suspicious activities to financial intelligence units within 24 hours of detection.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Term 2: API Gateway - Will have missing context in some clusters
INSERT INTO terms (id, term, base_definition, category, tags, created_by, created_at, updated_at)
VALUES (
    '10000000-0000-0000-0000-000000000002',
    'API Gateway',
    'A server that acts as an API front-end, receiving API requests, enforcing throttling and security policies, passing requests to the back-end service and then passing the response back to the requester.',
    'Technology',
    ARRAY['api', 'infrastructure', 'integration'],
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Term 2 Contexts - Only in IT Operations, missing in other clusters
INSERT INTO term_contexts (id, term_id, cluster, system, context_definition, created_by, created_at, updated_at)
VALUES
    ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002', 'IT Operations', 'AWS', 'API Gateway is our AWS-managed service that handles all external API requests, providing authentication, rate limiting, and request routing.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Term 3: Customer Onboarding - Will have outdated context
INSERT INTO terms (id, term, base_definition, category, tags, created_by, created_at, updated_at)
VALUES (
    '10000000-0000-0000-0000-000000000003',
    'Customer Onboarding',
    'The process of bringing a new customer onto a platform or service, including identity verification, account setup, and initial configuration.',
    'Business Process',
    ARRAY['customer', 'process', 'onboarding'],
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Term 3 Contexts - One outdated (6+ months old)
INSERT INTO term_contexts (id, term_id, cluster, system, context_definition, created_by, created_at, updated_at)
VALUES
    ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000003', 'Risk Management', 'OnboardingSys', 'Customer onboarding includes KYC checks, risk assessment, and initial credit evaluation. Process takes 2-3 business days.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP - INTERVAL '8 months', CURRENT_TIMESTAMP - INTERVAL '8 months'),
    ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000003', 'Compliance', 'ComplianceSys', 'Customer onboarding requires identity verification, AML screening, and regulatory compliance checks before account activation.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Term 4: Data Warehouse - Will have contexts in multiple clusters (good coverage)
INSERT INTO terms (id, term, base_definition, category, tags, created_by, created_at, updated_at)
VALUES (
    '10000000-0000-0000-0000-000000000004',
    'Data Warehouse',
    'A central repository of integrated data from one or more disparate sources, used for reporting and data analysis.',
    'Technology',
    ARRAY['data', 'analytics', 'storage'],
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Term 4 Contexts - Good coverage across clusters
INSERT INTO term_contexts (id, term_id, cluster, system, context_definition, created_by, created_at, updated_at)
VALUES
    ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000004', 'IT Operations', 'Snowflake', 'Our data warehouse is built on Snowflake, providing scalable analytics and reporting capabilities for all business units.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000004', 'Finance', 'FinanceSys', 'Data warehouse stores all financial transaction data, customer records, and regulatory reporting data for compliance purposes.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004', 'Risk Management', 'RiskSys', 'Data warehouse contains historical risk metrics, model outputs, and scenario analysis data for risk assessment.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Term 5: KYC (Know Your Customer) - Will have conflicting definitions
INSERT INTO terms (id, term, base_definition, category, tags, created_by, created_at, updated_at)
VALUES (
    '10000000-0000-0000-0000-000000000005',
    'KYC',
    'Know Your Customer - The process of verifying the identity of clients and assessing potential risks of illegal intentions.',
    'Compliance',
    ARRAY['compliance', 'kyc', 'verification'],
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Term 5 Contexts - Conflicting definitions
INSERT INTO term_contexts (id, term_id, cluster, system, context_definition, created_by, created_at, updated_at)
VALUES
    ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000005', 'Compliance', 'ComplianceSys', 'KYC is a one-time verification process that must be completed within 24 hours of account creation. Requires government-issued ID and proof of address.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('20000000-0000-0000-0000-000000000010', '10000000-0000-0000-0000-000000000005', 'Risk Management', 'RiskSys', 'KYC is an ongoing process that includes periodic re-verification every 3 years and continuous transaction monitoring for suspicious activities.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Term 6: SLA (Service Level Agreement) - Missing context in some clusters
INSERT INTO terms (id, term, base_definition, category, tags, created_by, created_at, updated_at)
VALUES (
    '10000000-0000-0000-0000-000000000006',
    'SLA',
    'Service Level Agreement - A commitment between a service provider and a client regarding the level of service expected.',
    'Business Process',
    ARRAY['sla', 'service', 'agreement'],
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Term 6 Contexts - Only in IT Operations
INSERT INTO term_contexts (id, term_id, cluster, system, context_definition, created_by, created_at, updated_at)
VALUES
    ('20000000-0000-0000-0000-000000000011', '10000000-0000-0000-0000-000000000006', 'IT Operations', 'ServiceDesk', 'SLA for IT support: Critical issues resolved within 1 hour, High priority within 4 hours, Normal priority within 24 hours.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Term 7: Transaction Monitoring - Outdated context
INSERT INTO terms (id, term, base_definition, category, tags, created_by, created_at, updated_at)
VALUES (
    '10000000-0000-0000-0000-000000000007',
    'Transaction Monitoring',
    'The process of reviewing transactions for suspicious activity that might indicate money laundering or other financial crimes.',
    'Compliance',
    ARRAY['monitoring', 'compliance', 'aml'],
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Term 7 Contexts - One outdated
INSERT INTO term_contexts (id, term_id, cluster, system, context_definition, created_by, created_at, updated_at)
VALUES
    ('20000000-0000-0000-0000-000000000012', '10000000-0000-0000-0000-000000000007', 'Compliance', 'LegacyMonitor', 'Transaction monitoring uses rule-based system that flags transactions over $10,000 for manual review. System runs daily batch processing.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP - INTERVAL '7 months', CURRENT_TIMESTAMP - INTERVAL '7 months'),
    ('20000000-0000-0000-0000-000000000013', '10000000-0000-0000-0000-000000000007', 'Risk Management', 'RiskSys', 'Real-time transaction monitoring uses machine learning models to detect anomalies and suspicious patterns across all customer transactions.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Term 8: Cloud Migration - Missing contexts (will trigger missing context gaps)
INSERT INTO terms (id, term, base_definition, category, tags, created_by, created_at, updated_at)
VALUES (
    '10000000-0000-0000-0000-000000000008',
    'Cloud Migration',
    'The process of moving data, applications, and other business elements from on-premises infrastructure to cloud-based infrastructure.',
    'Technology',
    ARRAY['cloud', 'migration', 'infrastructure'],
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Term 8 Contexts - Only in IT Operations, missing in others
INSERT INTO term_contexts (id, term_id, cluster, system, context_definition, created_by, created_at, updated_at)
VALUES
    ('20000000-0000-0000-0000-000000000014', '10000000-0000-0000-0000-000000000008', 'IT Operations', 'CloudOps', 'Cloud migration strategy focuses on AWS for infrastructure, with phased approach: Phase 1 (Q1-Q2) for non-critical systems, Phase 2 (Q3-Q4) for core systems.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Term 9: Regulatory Reporting - Good coverage (no gaps expected)
INSERT INTO terms (id, term, base_definition, category, tags, created_by, created_at, updated_at)
VALUES (
    '10000000-0000-0000-0000-000000000009',
    'Regulatory Reporting',
    'The process of submitting required information to regulatory authorities in compliance with applicable laws and regulations.',
    'Compliance',
    ARRAY['compliance', 'reporting', 'regulatory'],
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Term 9 Contexts - Good coverage
INSERT INTO term_contexts (id, term_id, cluster, system, context_definition, created_by, created_at, updated_at)
VALUES
    ('20000000-0000-0000-0000-000000000015', '10000000-0000-0000-0000-000000000009', 'Compliance', 'ComplianceSys', 'Regulatory reporting includes monthly AML reports to FIU, quarterly capital adequacy reports to central bank, and annual audit reports.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('20000000-0000-0000-0000-000000000016', '10000000-0000-0000-0000-000000000009', 'Finance', 'FinanceSys', 'Regulatory reporting covers financial statements, tax filings, and capital requirements reporting to ensure regulatory compliance.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('20000000-0000-0000-0000-000000000017', '10000000-0000-0000-0000-000000000009', 'Risk Management', 'RiskSys', 'Regulatory reporting includes risk metrics, stress testing results, and model validation reports submitted to regulatory authorities.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Term 10: Microservices - Missing context (will trigger gaps)
INSERT INTO terms (id, term, base_definition, category, tags, created_by, created_at, updated_at)
VALUES (
    '10000000-0000-0000-0000-000000000010',
    'Microservices',
    'An architectural approach where applications are built as a collection of small, independent services that communicate over well-defined APIs.',
    'Technology',
    ARRAY['architecture', 'microservices', 'api'],
    '00000000-0000-0000-0000-000000000001'::uuid,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (id) DO NOTHING;

-- Term 10 Contexts - Only in IT Operations
INSERT INTO term_contexts (id, term_id, cluster, system, context_definition, created_by, created_at, updated_at)
VALUES
    ('20000000-0000-0000-0000-000000000018', '10000000-0000-0000-0000-000000000010', 'IT Operations', 'Architecture', 'Microservices architecture implemented using Kubernetes, with each service deployed in containers. Services communicate via REST APIs and message queues.', '00000000-0000-0000-0000-000000000001'::uuid, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Summary of test scenarios created:
-- 1. AML (Term 1): Conflicting definitions between Risk Management and Compliance
-- 2. API Gateway (Term 2): Missing context in Risk Management, Compliance, Finance
-- 3. Customer Onboarding (Term 3): Outdated context in Risk Management (8 months old)
-- 4. Data Warehouse (Term 4): Good coverage - no gaps expected
-- 5. KYC (Term 5): Conflicting definitions between Compliance and Risk Management
-- 6. SLA (Term 6): Missing context in most clusters (only IT Operations has it)
-- 7. Transaction Monitoring (Term 7): Outdated context in Compliance (7 months old)
-- 8. Cloud Migration (Term 8): Missing context in most clusters
-- 9. Regulatory Reporting (Term 9): Good coverage - no gaps expected
-- 10. Microservices (Term 10): Missing context in most clusters

