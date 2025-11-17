import {
  Term,
  TermProposal,
  TermFlag,
  BrandingConfig,
  PaginatedResponse,
  GapAnalysis,
  Cluster,
  GapAnalytics,
  ClusterCoverage,
  AccessRequest,
  Notification,
  TermVersion,
  VersionComparison,
} from '../types';

// Mock Terms Data
export const mockTerms: Term[] = [
  {
    id: '1',
    term: 'KYC',
    base_definition: 'Know Your Customer - A process used by financial institutions to verify the identity of their clients and assess potential risks of illegal intentions.',
    category: 'Compliance',
    tags: ['compliance', 'regulatory', 'risk'],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    contexts: [
      {
        id: '1-1',
        term_id: '1',
        cluster: 'Risk Management',
        system: 'Compliance System',
        compliance_required: false,
        context_definition: 'In the Risk Management cluster, KYC refers specifically to the automated screening process that runs during account onboarding.',
        created_at: '2024-01-15T10:05:00Z',
        updated_at: '2024-01-15T10:05:00Z',
      },
      {
        id: '1-2',
        term_id: '1',
        cluster: 'Customer Onboarding',
        system: 'Onboarding Platform',
        compliance_required: false,
        context_definition: 'For Customer Onboarding, KYC encompasses the entire customer verification workflow including document collection and validation.',
        created_at: '2024-01-15T10:10:00Z',
        updated_at: '2024-01-15T10:10:00Z',
      },
    ],
    examples: [
      {
        id: '1-1',
        term_id: '1',
        example_text: 'All new customers must complete KYC verification before their account can be activated.',
        source: 'Customer Onboarding Policy v2.1',
        created_at: '2024-01-15T10:15:00Z',
      },
      {
        id: '1-2',
        term_id: '1',
        context_id: '1-1',
        example_text: 'The KYC process flagged 15% of applications for manual review last quarter.',
        source: 'Q4 Risk Report',
        created_at: '2024-01-15T10:20:00Z',
      },
    ],
    relationships: [
      {
        id: '1-1',
        term_id: '1',
        related_term_id: '2',
        relationship_type: 'related',
        created_at: '2024-01-15T10:25:00Z',
      },
    ],
  },
  {
    id: '2',
    term: 'AML',
    base_definition: 'Anti-Money Laundering - A set of laws, regulations, and procedures intended to prevent criminals from disguising illegally obtained funds as legitimate income.',
    category: 'Compliance',
    tags: ['compliance', 'regulatory', 'fraud'],
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-16T09:00:00Z',
    contexts: [
      {
        id: '2-1',
        term_id: '2',
        cluster: 'Risk Management',
        system: 'Transaction Monitoring',
        compliance_required: false,
        context_definition: 'AML in Transaction Monitoring refers to the real-time analysis of transactions to detect suspicious patterns.',
        created_at: '2024-01-16T09:05:00Z',
        updated_at: '2024-01-16T09:05:00Z',
      },
    ],
    examples: [
      {
        id: '2-1',
        term_id: '2',
        example_text: 'The AML system generated 250 alerts this month requiring investigation.',
        source: 'Monthly Compliance Report',
        created_at: '2024-01-16T09:10:00Z',
      },
    ],
    relationships: [
      {
        id: '2-1',
        term_id: '2',
        related_term_id: '1',
        relationship_type: 'related',
        created_at: '2024-01-16T09:15:00Z',
      },
    ],
  },
  {
    id: '3',
    term: 'Data Warehouse',
    base_definition: 'A central repository of integrated data from one or more disparate sources, used for reporting and data analysis.',
    category: 'Data & Analytics',
    code_name: 'DW_SNOWFLAKE',
    tags: ['data', 'analytics', 'infrastructure'],
    created_at: '2024-01-17T08:00:00Z',
    updated_at: '2024-01-17T08:00:00Z',
    contexts: [
      {
        id: '3-1',
        term_id: '3',
        cluster: 'Data Engineering',
        system: 'ETL Pipeline',
        compliance_required: false,
        context_definition: 'In Data Engineering, the Data Warehouse refers specifically to our Snowflake instance that consolidates data from all operational systems.',
        created_at: '2024-01-17T08:05:00Z',
        updated_at: '2024-01-17T08:05:00Z',
      },
      {
        id: '3-2',
        term_id: '3',
        cluster: 'Business Intelligence',
        system: 'Reporting Platform',
        compliance_required: false,
        context_definition: 'For Business Intelligence teams, the Data Warehouse is the source of truth for all business metrics and KPIs.',
        created_at: '2024-01-17T08:10:00Z',
        updated_at: '2024-01-17T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '3-1',
        term_id: '3',
        example_text: 'The Data Warehouse is updated nightly with transaction data from all core banking systems.',
        source: 'Data Architecture Documentation',
        created_at: '2024-01-17T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '3-1',
        term_id: '3',
        related_term_id: '4',
        relationship_type: 'related',
        created_at: '2024-01-17T08:20:00Z',
      },
    ],
  },
  {
    id: '4',
    term: 'Data Lake',
    base_definition: 'A storage repository that holds a vast amount of raw data in its native format until it is needed for analytics.',
    category: 'Data & Analytics',
    code_name: 'DL_S3_BUCKET',
    tags: ['data', 'analytics', 'storage'],
    created_at: '2024-01-18T07:00:00Z',
    updated_at: '2024-01-18T07:00:00Z',
    contexts: [
      {
        id: '4-1',
        term_id: '4',
        cluster: 'Data Engineering',
        system: 'Big Data Platform',
        compliance_required: false,
        context_definition: 'Our Data Lake on AWS S3 stores raw, unstructured data from IoT devices and social media feeds.',
        created_at: '2024-01-18T07:05:00Z',
        updated_at: '2024-01-18T07:05:00Z',
      },
    ],
    examples: [
      {
        id: '4-1',
        term_id: '4',
        example_text: 'Data scientists query the Data Lake directly for exploratory analysis before data is structured in the Warehouse.',
        source: 'Data Strategy Guide',
        created_at: '2024-01-18T07:10:00Z',
      },
    ],
    relationships: [
      {
        id: '4-1',
        term_id: '4',
        related_term_id: '3',
        relationship_type: 'related',
        created_at: '2024-01-18T07:15:00Z',
      },
    ],
  },
  {
    id: '5',
    term: 'API Gateway',
    base_definition: 'A service that acts as an entry point for API requests, handling routing, authentication, rate limiting, and other cross-cutting concerns.',
    category: 'Technology',
    code_name: 'api/v1/gateway',
    tags: ['api', 'infrastructure', 'microservices'],
    created_at: '2024-01-19T06:00:00Z',
    updated_at: '2024-01-19T06:00:00Z',
    contexts: [
      {
        id: '5-1',
        term_id: '5',
        cluster: 'Platform Engineering',
        system: 'API Management',
        compliance_required: false,
        context_definition: 'Our API Gateway (Kong) routes all external API requests and enforces authentication and rate limiting policies.',
        created_at: '2024-01-19T06:05:00Z',
        updated_at: '2024-01-19T06:05:00Z',
      },
    ],
    examples: [
      {
        id: '5-1',
        term_id: '5',
        example_text: 'All mobile app requests go through the API Gateway before reaching backend services.',
        source: 'Architecture Overview',
        created_at: '2024-01-19T06:10:00Z',
      },
    ],
    relationships: [],
  },
  {
    id: '6',
    term: 'BCBS 239',
    base_definition: 'Basel Committee on Banking Supervision standard 239 - Principles for effective risk data aggregation and risk reporting.',
    category: 'Compliance',
    tags: ['compliance', 'regulatory', 'risk', 'reporting'],
    compliance_frameworks: ['BCBS 239'],
    created_at: '2024-01-20T05:00:00Z',
    updated_at: '2024-01-20T05:00:00Z',
    contexts: [
      {
        id: '6-1',
        term_id: '6',
        cluster: 'Risk Management',
        system: 'Risk Reporting',
        compliance_required: true,
        context_definition: 'BCBS 239 compliance requires that our risk data aggregation system can produce accurate reports within 24 hours of a stress event.',
        created_at: '2024-01-20T05:05:00Z',
        updated_at: '2024-01-20T05:05:00Z',
      },
    ],
    examples: [
      {
        id: '6-1',
        term_id: '6',
        example_text: 'Our BCBS 239 compliance program ensures risk data is accurate, complete, and timely across all reporting systems.',
        source: 'Regulatory Compliance Framework',
        created_at: '2024-01-20T05:10:00Z',
      },
    ],
    relationships: [],
  },
  {
    id: '7',
    term: 'Microservice',
    base_definition: 'A software development technique where an application is built as a suite of small, independent services that communicate over well-defined APIs.',
    category: 'Technology',
    code_name: 'MS_ARCH',
    tags: ['architecture', 'software', 'api'],
    created_at: '2024-01-21T04:00:00Z',
    updated_at: '2024-01-21T04:00:00Z',
    contexts: [
      {
        id: '7-1',
        term_id: '7',
        cluster: 'Platform Engineering',
        system: 'Service Architecture',
        compliance_required: false,
        context_definition: 'Each microservice in our platform owns its own database and can be deployed independently.',
        created_at: '2024-01-21T04:05:00Z',
        updated_at: '2024-01-21T04:05:00Z',
      },
    ],
    examples: [
      {
        id: '7-1',
        term_id: '7',
        example_text: 'The Payment Service is a microservice that handles all payment processing logic independently.',
        source: 'Service Architecture Guide',
        created_at: '2024-01-21T04:10:00Z',
      },
    ],
    relationships: [
      {
        id: '7-1',
        term_id: '7',
        related_term_id: '5',
        relationship_type: 'related',
        created_at: '2024-01-21T04:15:00Z',
      },
    ],
  },
  {
    id: '8',
    term: 'ETL',
    base_definition: 'Extract, Transform, Load - A process in data warehousing that involves extracting data from source systems, transforming it to fit operational needs, and loading it into a target database.',
    category: 'Data & Analytics',
    code_name: 'ETL_AIRFLOW',
    tags: ['data', 'etl', 'pipeline'],
    created_at: '2024-01-22T03:00:00Z',
    updated_at: '2024-01-22T03:00:00Z',
    contexts: [
      {
        id: '8-1',
        term_id: '8',
        cluster: 'Data Engineering',
        system: 'Data Pipeline',
        compliance_required: false,
        context_definition: 'Our ETL processes run on Apache Airflow and extract data from 15+ source systems daily.',
        created_at: '2024-01-22T03:05:00Z',
        updated_at: '2024-01-22T03:05:00Z',
      },
    ],
    examples: [
      {
        id: '8-1',
        term_id: '8',
        example_text: 'The nightly ETL job extracts transaction data, transforms it to our standard schema, and loads it into the Data Warehouse.',
        source: 'Data Operations Manual',
        created_at: '2024-01-22T03:10:00Z',
      },
    ],
    relationships: [
      {
        id: '8-1',
        term_id: '8',
        related_term_id: '3',
        relationship_type: 'related',
        created_at: '2024-01-22T03:15:00Z',
      },
    ],
  },
  {
    id: '9',
    term: 'GDPR',
    base_definition: 'General Data Protection Regulation - A comprehensive data protection law in the European Union that governs how personal data is collected, processed, and stored.',
    category: 'Compliance',
    tags: ['compliance', 'privacy', 'data-protection', 'regulatory'],
    compliance_frameworks: ['GDPR'],
    created_at: '2024-01-23T02:00:00Z',
    updated_at: '2024-01-23T02:00:00Z',
    contexts: [
      {
        id: '9-1',
        term_id: '9',
        cluster: 'Legal & Compliance',
        system: 'Data Privacy Platform',
        compliance_required: true,
        context_definition: 'GDPR compliance requires us to implement data minimization, consent management, and right-to-be-forgotten capabilities.',
        created_at: '2024-01-23T02:05:00Z',
        updated_at: '2024-01-23T02:05:00Z',
      },
    ],
    examples: [
      {
        id: '9-1',
        term_id: '9',
        example_text: 'All customer data processing must comply with GDPR requirements, including explicit consent and data portability.',
        source: 'Data Privacy Policy',
        created_at: '2024-01-23T02:10:00Z',
      },
    ],
    relationships: [],
  },
  {
    id: '10',
    term: 'CI/CD',
    base_definition: 'Continuous Integration/Continuous Deployment - A set of practices that automate the building, testing, and deployment of applications.',
    category: 'Technology',
    code_name: 'cicd/jenkins',
    tags: ['devops', 'automation', 'software'],
    created_at: '2024-01-24T01:00:00Z',
    updated_at: '2024-01-24T01:00:00Z',
    contexts: [
      {
        id: '10-1',
        term_id: '10',
        cluster: 'Platform Engineering',
        system: 'Build Pipeline',
        compliance_required: false,
        context_definition: 'Our CI/CD pipeline runs automated tests and deploys to staging and production environments.',
        created_at: '2024-01-24T01:05:00Z',
        updated_at: '2024-01-24T01:05:00Z',
      },
    ],
    examples: [
      {
        id: '10-1',
        term_id: '10',
        example_text: 'Every code commit triggers the CI/CD pipeline to run tests and deploy if successful.',
        source: 'DevOps Handbook',
        created_at: '2024-01-24T01:10:00Z',
      },
    ],
    relationships: [
      {
        id: '10-1',
        term_id: '10',
        related_term_id: '7',
        relationship_type: 'related',
        created_at: '2024-01-24T01:15:00Z',
      },
    ],
  },
  {
    id: '11',
    term: 'Data Governance',
    base_definition: 'The overall management of the availability, usability, integrity, and security of data used in an organization.',
    category: 'Data & Analytics',
    tags: ['data', 'governance', 'quality', 'management'],
    created_at: '2024-01-25T00:00:00Z',
    updated_at: '2024-01-25T00:00:00Z',
    contexts: [
      {
        id: '11-1',
        term_id: '11',
        cluster: 'Data Management',
        system: 'Data Catalog',
        compliance_required: false,
        context_definition: 'Data Governance ensures that all data assets are documented, classified, and accessible to authorized users.',
        created_at: '2024-01-25T00:05:00Z',
        updated_at: '2024-01-25T00:05:00Z',
      },
    ],
    examples: [
      {
        id: '11-1',
        term_id: '11',
        example_text: 'Our Data Governance framework establishes policies for data quality, lineage tracking, and access controls.',
        source: 'Data Strategy Document',
        created_at: '2024-01-25T00:10:00Z',
      },
    ],
    relationships: [
      {
        id: '11-1',
        term_id: '11',
        related_term_id: '3',
        relationship_type: 'related',
        created_at: '2024-01-25T00:15:00Z',
      },
    ],
  },
  {
    id: '12',
    term: 'SLA',
    base_definition: 'Service Level Agreement - A contract between a service provider and customer that defines the level of service expected.',
    category: 'Operations',
    tags: ['operations', 'service', 'agreement'],
    created_at: '2024-01-26T23:00:00Z',
    updated_at: '2024-01-26T23:00:00Z',
    contexts: [
      {
        id: '12-1',
        term_id: '12',
        cluster: 'IT Operations',
        system: 'Service Management',
        compliance_required: false,
        context_definition: 'Our SLA guarantees 99.9% uptime for critical banking systems with defined response times for incidents.',
        created_at: '2024-01-26T23:05:00Z',
        updated_at: '2024-01-26T23:05:00Z',
      },
    ],
    examples: [
      {
        id: '12-1',
        term_id: '12',
        example_text: 'The payment processing service has an SLA of 99.95% availability with 4-hour resolution time for P1 incidents.',
        source: 'Service Catalog',
        created_at: '2024-01-26T23:10:00Z',
      },
    ],
    relationships: [],
  },
  {
    id: '13',
    term: 'Home Loan',
    base_definition: 'A loan provided by a bank to an individual for the purchase of residential property, secured by the property itself. The property serves as collateral, and the loan is typically repaid over 20-30 years with monthly installments.',
    category: 'Products',
    tags: ['product', 'retail-banking', 'mortgage', 'lending', 'home-loan'],
    created_at: '2024-02-01T08:00:00Z',
    updated_at: '2024-02-01T08:00:00Z',
    contexts: [
      {
        id: '13-1',
        term_id: '13',
        cluster: 'Home Loans',
        system: 'Mortgage Origination System',
        compliance_required: false,
        context_definition: 'In the Home Loans cluster, a Home Loan is defined as a secured lending product with loan-to-value ratios up to 100% for first-time buyers, with interest rates linked to prime lending rate plus margin. The product includes features like access bond facility, payment holidays, and portability options.',
        created_at: '2024-02-01T08:05:00Z',
        updated_at: '2024-02-01T08:05:00Z',
      },
      {
        id: '13-2',
        term_id: '13',
        cluster: 'Credit Management',
        system: 'Loan Servicing Platform',
        compliance_required: false,
        context_definition: 'For Credit Management, a Home Loan represents a secured credit facility with monthly repayments calculated using amortization schedules. The loan is secured by a first or second bond registered against the property title deed, providing security for the bank.',
        created_at: '2024-02-01T08:10:00Z',
        updated_at: '2024-02-01T08:10:00Z',
      },
      {
        id: '13-3',
        term_id: '13',
        cluster: 'Risk Management',
        system: 'Credit Risk Assessment',
        compliance_required: false,
        context_definition: 'In Risk Management, a Home Loan is assessed based on loan-to-value ratio, debt-to-income ratio, credit score, and property valuation. The risk weighting for regulatory capital purposes is typically 35% for owner-occupied residential property under Basel III.',
        created_at: '2024-02-01T08:15:00Z',
        updated_at: '2024-02-01T08:15:00Z',
      },
      {
        id: '13-4',
        term_id: '13',
        cluster: 'Retail Banking',
        system: 'Product Catalog',
        compliance_required: false,
        context_definition: 'In Retail Banking, Home Loans are marketed as long-term financing solutions for property purchase, with competitive interest rates, flexible repayment terms, and additional features like access bonds and building loans for construction.',
        created_at: '2024-02-01T08:20:00Z',
        updated_at: '2024-02-01T08:20:00Z',
      },
    ],
    examples: [
      {
        id: '13-1',
        term_id: '13',
        example_text: 'A customer applies for a R2.5 million Home Loan at prime + 0.5% (currently 11.5%) over 20 years, with monthly repayments of R25,450.',
        source: 'Home Loan Product Guide',
        created_at: '2024-02-01T08:25:00Z',
      },
      {
        id: '13-2',
        term_id: '13',
        context_id: '13-1',
        example_text: 'The Home Loans department approved 1,200 new applications last month, with an average loan amount of R1.8 million.',
        source: 'Monthly Home Loans Report',
        created_at: '2024-02-01T08:30:00Z',
      },
    ],
    relationships: [
      {
        id: '13-1',
        term_id: '13',
        related_term_id: '14',
        relationship_type: 'related',
        created_at: '2024-02-01T08:35:00Z',
      },
      {
        id: '13-2',
        term_id: '13',
        related_term_id: '15',
        relationship_type: 'related',
        created_at: '2024-02-01T08:40:00Z',
      },
    ],
  },
  {
    id: '14',
    term: 'Access Bond',
    base_definition: 'A flexible home loan facility that allows borrowers to access surplus funds paid into their bond account. Funds can be withdrawn up to the original loan amount, providing a revolving credit facility linked to the home loan.',
    category: 'Products',
    tags: ['product', 'home-loan', 'credit-facility', 'revolving-credit'],
    created_at: '2024-02-02T08:00:00Z',
    updated_at: '2024-02-02T08:00:00Z',
    contexts: [
      {
        id: '14-1',
        term_id: '14',
        cluster: 'Home Loans',
        system: 'Mortgage Product Management',
        compliance_required: false,
        context_definition: 'In Home Loans, an Access Bond is a feature that can be added to any home loan product, allowing customers to make additional payments and withdraw those funds later. The interest rate is typically the same as the home loan rate, making it a cost-effective credit facility.',
        created_at: '2024-02-02T08:05:00Z',
        updated_at: '2024-02-02T08:05:00Z',
      },
      {
        id: '14-2',
        term_id: '14',
        cluster: 'Credit Management',
        system: 'Credit Facility Management',
        compliance_required: false,
        context_definition: 'For Credit Management, an Access Bond is treated as a revolving credit facility with the home loan as security. Withdrawals reduce available credit, and repayments increase available credit up to the original loan amount.',
        created_at: '2024-02-02T08:10:00Z',
        updated_at: '2024-02-02T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '14-1',
        term_id: '14',
        example_text: 'A customer with a R2 million Access Bond who has paid down to R1.5 million can withdraw up to R500,000 at any time without additional approval.',
        source: 'Access Bond Product Guide',
        created_at: '2024-02-02T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '14-1',
        term_id: '14',
        related_term_id: '13',
        relationship_type: 'child',
        created_at: '2024-02-02T08:20:00Z',
      },
    ],
  },
  {
    id: '15',
    term: 'Building Loan',
    base_definition: 'A specialized home loan product that provides financing in stages to fund the construction of a new home. Funds are disbursed progressively as construction milestones are reached, rather than as a lump sum.',
    category: 'Products',
    tags: ['product', 'home-loan', 'construction', 'staged-disbursement'],
    created_at: '2024-02-03T08:00:00Z',
    updated_at: '2024-02-03T08:00:00Z',
    contexts: [
      {
        id: '15-1',
        term_id: '15',
        cluster: 'Home Loans',
        system: 'Mortgage Origination System',
        compliance_required: false,
        context_definition: 'In Home Loans, a Building Loan is approved for the full construction amount but disbursed in stages: foundation (20%), walls up (30%), roof on (30%), and completion (20%). Each stage requires inspection and certification before funds are released.',
        created_at: '2024-02-03T08:05:00Z',
        updated_at: '2024-02-03T08:05:00Z',
      },
      {
        id: '15-2',
        term_id: '15',
        cluster: 'Credit Management',
        system: 'Loan Disbursement System',
        compliance_required: false,
        context_definition: 'For Credit Management, Building Loans require careful monitoring of construction progress and compliance with building regulations. Interest is charged only on funds actually disbursed, not the full approved amount.',
        created_at: '2024-02-03T08:10:00Z',
        updated_at: '2024-02-03T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '15-1',
        term_id: '15',
        example_text: 'A R3 million Building Loan is approved, with R600,000 disbursed at foundation stage, R900,000 at walls stage, R900,000 at roof stage, and R600,000 at completion.',
        source: 'Building Loan Procedures',
        created_at: '2024-02-03T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '15-1',
        term_id: '15',
        related_term_id: '13',
        relationship_type: 'child',
        created_at: '2024-02-03T08:20:00Z',
      },
    ],
  },
  {
    id: '16',
    term: 'Personal Loan',
    base_definition: 'An unsecured loan granted to an individual based on their creditworthiness, used for personal expenses such as debt consolidation, home improvements, or major purchases. Unlike secured loans, no collateral is required.',
    category: 'Products',
    tags: ['product', 'retail-banking', 'unsecured-loan', 'personal-finance'],
    created_at: '2024-02-04T08:00:00Z',
    updated_at: '2024-02-04T08:00:00Z',
    contexts: [
      {
        id: '16-1',
        term_id: '16',
        cluster: 'Retail Banking',
        system: 'Loan Origination System',
        compliance_required: false,
        context_definition: 'In Retail Banking, Personal Loans are offered with fixed interest rates and fixed monthly repayments over terms of 12-84 months. Loan amounts range from R5,000 to R350,000, with interest rates based on credit score and risk assessment.',
        created_at: '2024-02-04T08:05:00Z',
        updated_at: '2024-02-04T08:05:00Z',
      },
      {
        id: '16-2',
        term_id: '16',
        cluster: 'Credit Management',
        system: 'Credit Assessment Platform',
        compliance_required: false,
        context_definition: 'For Credit Management, Personal Loans are assessed using credit bureau scores, debt-to-income ratios, and affordability calculations. As unsecured loans, they carry higher risk and therefore higher interest rates than secured loans.',
        created_at: '2024-02-04T08:10:00Z',
        updated_at: '2024-02-04T08:10:00Z',
      },
      {
        id: '16-3',
        term_id: '16',
        cluster: 'Risk Management',
        system: 'Credit Risk Models',
        compliance_required: false,
        context_definition: 'In Risk Management, Personal Loans are assigned risk weights of 75% for regulatory capital purposes under Basel III, reflecting their unsecured nature. Default rates are monitored closely, and risk-based pricing is applied.',
        created_at: '2024-02-04T08:15:00Z',
        updated_at: '2024-02-04T08:15:00Z',
      },
    ],
    examples: [
      {
        id: '16-1',
        term_id: '16',
        example_text: 'A customer with a credit score of 680 is approved for a R50,000 Personal Loan at 18.5% APR over 36 months, with monthly repayments of R1,850.',
        source: 'Personal Loan Product Guide',
        created_at: '2024-02-04T08:20:00Z',
      },
    ],
    relationships: [
      {
        id: '16-1',
        term_id: '16',
        related_term_id: '17',
        relationship_type: 'related',
        created_at: '2024-02-04T08:25:00Z',
      },
    ],
  },
  {
    id: '17',
    term: 'Credit Card',
    base_definition: 'A payment card issued by a bank that allows the holder to borrow funds up to a pre-approved credit limit for purchases or cash advances. The cardholder can repay the full balance or make minimum payments, with interest charged on outstanding balances.',
    category: 'Products',
    tags: ['product', 'retail-banking', 'credit-card', 'revolving-credit', 'payment-card'],
    created_at: '2024-02-05T08:00:00Z',
    updated_at: '2024-02-05T08:00:00Z',
    contexts: [
      {
        id: '17-1',
        term_id: '17',
        cluster: 'Retail Banking',
        system: 'Card Management System',
        compliance_required: false,
        context_definition: 'In Retail Banking, Credit Cards are offered with credit limits from R5,000 to R500,000, with interest rates typically ranging from 15% to 24% APR. Cards include features like rewards programs, travel insurance, and contactless payments.',
        created_at: '2024-02-05T08:05:00Z',
        updated_at: '2024-02-05T08:05:00Z',
      },
      {
        id: '17-2',
        term_id: '17',
        cluster: 'Credit Management',
        system: 'Credit Limit Management',
        compliance_required: false,
        context_definition: 'For Credit Management, Credit Cards are revolving credit facilities where available credit decreases with spending and increases with repayments. Minimum payments are typically 3-5% of outstanding balance, with interest charged on remaining balance.',
        created_at: '2024-02-05T08:10:00Z',
        updated_at: '2024-02-05T08:10:00Z',
      },
      {
        id: '17-3',
        term_id: '17',
        cluster: 'Payments & Settlements',
        system: 'Card Processing Network',
        compliance_required: false,
        context_definition: 'In Payments & Settlements, Credit Card transactions are processed through card networks (Visa, Mastercard) and settled via BankservAfrica. Merchant fees (interchange) are charged to merchants, while cardholders pay interest on outstanding balances.',
        created_at: '2024-02-05T08:15:00Z',
        updated_at: '2024-02-05T08:15:00Z',
      },
    ],
    examples: [
      {
        id: '17-1',
        term_id: '17',
        example_text: 'A customer with a R50,000 credit limit who spends R10,000 must make a minimum payment of R300 (3%) or pay the full R10,000 to avoid interest charges.',
        source: 'Credit Card Terms & Conditions',
        created_at: '2024-02-05T08:20:00Z',
      },
    ],
    relationships: [
      {
        id: '17-1',
        term_id: '17',
        related_term_id: '18',
        relationship_type: 'related',
        created_at: '2024-02-05T08:25:00Z',
      },
    ],
  },
  {
    id: '18',
    term: 'Debit Card',
    base_definition: 'A payment card linked directly to a bank account that deducts money immediately from the account balance for purchases or cash withdrawals. Unlike credit cards, no borrowing is involved - transactions are limited to available account balance.',
    category: 'Products',
    tags: ['product', 'retail-banking', 'debit-card', 'payment-card', 'transactional'],
    created_at: '2024-02-06T08:00:00Z',
    updated_at: '2024-02-06T08:00:00Z',
    contexts: [
      {
        id: '18-1',
        term_id: '18',
        cluster: 'Retail Banking',
        system: 'Card Management System',
        compliance_required: false,
        context_definition: 'In Retail Banking, Debit Cards are issued automatically with current and savings accounts, allowing customers to make purchases at point-of-sale terminals and withdraw cash from ATMs. Cards can be linked to multiple accounts.',
        created_at: '2024-02-06T08:05:00Z',
        updated_at: '2024-02-06T08:05:00Z',
      },
      {
        id: '18-2',
        term_id: '18',
        cluster: 'Payments & Settlements',
        system: 'Card Processing Network',
        compliance_required: false,
        context_definition: 'For Payments & Settlements, Debit Card transactions are processed in real-time, with funds immediately debited from the customer\'s account. Transactions are authorized against available balance and settled through BankservAfrica.',
        created_at: '2024-02-06T08:10:00Z',
        updated_at: '2024-02-06T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '18-1',
        term_id: '18',
        example_text: 'A customer uses their Debit Card to purchase groceries for R500 - the amount is immediately deducted from their current account balance.',
        source: 'Debit Card User Guide',
        created_at: '2024-02-06T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '18-1',
        term_id: '18',
        related_term_id: '17',
        relationship_type: 'related',
        created_at: '2024-02-06T08:20:00Z',
      },
      {
        id: '18-2',
        term_id: '18',
        related_term_id: '20',
        relationship_type: 'related',
        created_at: '2024-02-06T08:25:00Z',
      },
    ],
  },
  {
    id: '19',
    term: 'Savings Account',
    base_definition: 'A deposit account designed for individuals to save money over time, earning interest on the balance. Savings accounts typically have restrictions on the number of transactions allowed per month and may require a minimum balance.',
    category: 'Products',
    tags: ['product', 'retail-banking', 'deposit-account', 'savings', 'interest-bearing'],
    created_at: '2024-02-07T08:00:00Z',
    updated_at: '2024-02-07T08:00:00Z',
    contexts: [
      {
        id: '19-1',
        term_id: '19',
        cluster: 'Retail Banking',
        system: 'Account Management System',
        compliance_required: false,
        context_definition: 'In Retail Banking, Savings Accounts offer interest rates typically ranging from 3.5% to 7% per annum, with higher rates for larger balances. Accounts may have transaction limits (e.g., 6 free transactions per month) and minimum balance requirements.',
        created_at: '2024-02-07T08:05:00Z',
        updated_at: '2024-02-07T08:05:00Z',
      },
      {
        id: '19-2',
        term_id: '19',
        cluster: 'Treasury Operations',
        system: 'Liquidity Management',
        compliance_required: false,
        context_definition: 'For Treasury Operations, Savings Accounts represent stable, low-cost funding sources. Interest is calculated daily and paid monthly or quarterly. These deposits are classified as retail deposits for liquidity coverage ratio (LCR) purposes.',
        created_at: '2024-02-07T08:10:00Z',
        updated_at: '2024-02-07T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '19-1',
        term_id: '19',
        example_text: 'A customer opens a Savings Account with R10,000 at 5.5% interest per annum, earning approximately R550 in interest over the year, paid monthly.',
        source: 'Savings Account Product Guide',
        created_at: '2024-02-07T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '19-1',
        term_id: '19',
        related_term_id: '20',
        relationship_type: 'related',
        created_at: '2024-02-07T08:20:00Z',
      },
      {
        id: '19-2',
        term_id: '19',
        related_term_id: '21',
        relationship_type: 'related',
        created_at: '2024-02-07T08:25:00Z',
      },
    ],
  },
  {
    id: '20',
    term: 'Current Account',
    base_definition: 'A transactional bank account designed for frequent deposits and withdrawals, typically used for daily banking needs. Current accounts offer features like cheque facilities, debit cards, internet banking, and may have monthly fees.',
    category: 'Products',
    tags: ['product', 'retail-banking', 'deposit-account', 'transactional', 'current-account'],
    created_at: '2024-02-08T08:00:00Z',
    updated_at: '2024-02-08T08:00:00Z',
    contexts: [
      {
        id: '20-1',
        term_id: '20',
        cluster: 'Retail Banking',
        system: 'Account Management System',
        compliance_required: false,
        context_definition: 'In Retail Banking, Current Accounts are offered with various fee structures: basic accounts with minimal fees, premium accounts with bundled benefits, and student accounts with reduced fees. Most accounts include unlimited electronic transactions.',
        created_at: '2024-02-08T08:05:00Z',
        updated_at: '2024-02-08T08:05:00Z',
      },
      {
        id: '20-2',
        term_id: '20',
        cluster: 'Treasury Operations',
        system: 'Liquidity Management',
        compliance_required: false,
        context_definition: 'For Treasury Operations, Current Accounts are demand deposits with no fixed term, providing immediate liquidity but requiring the bank to maintain sufficient reserves. These are core deposits for liquidity coverage ratio calculations.',
        created_at: '2024-02-08T08:10:00Z',
        updated_at: '2024-02-08T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '20-1',
        term_id: '20',
        example_text: 'A customer maintains a Current Account with an average balance of R15,000, paying R85 monthly fee for unlimited transactions, debit card, and internet banking access.',
        source: 'Current Account Product Guide',
        created_at: '2024-02-08T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '20-1',
        term_id: '20',
        related_term_id: '19',
        relationship_type: 'related',
        created_at: '2024-02-08T08:20:00Z',
      },
    ],
  },
  {
    id: '21',
    term: 'Fixed Deposit',
    base_definition: 'An investment account where funds are deposited for a fixed term (typically 1-60 months) at a predetermined interest rate. Funds cannot be withdrawn before maturity without penalty, but offer higher interest rates than savings accounts.',
    category: 'Products',
    tags: ['product', 'retail-banking', 'deposit-account', 'investment', 'fixed-term'],
    created_at: '2024-02-09T08:00:00Z',
    updated_at: '2024-02-09T08:00:00Z',
    contexts: [
      {
        id: '21-1',
        term_id: '21',
        cluster: 'Retail Banking',
        system: 'Investment Product Management',
        compliance_required: false,
        context_definition: 'In Retail Banking, Fixed Deposits offer interest rates from 6% to 11% per annum depending on term length and deposit amount. Minimum deposits typically range from R1,000 to R10,000. Early withdrawal incurs penalty fees and loss of interest.',
        created_at: '2024-02-09T08:05:00Z',
        updated_at: '2024-02-09T08:05:00Z',
      },
      {
        id: '21-2',
        term_id: '21',
        cluster: 'Treasury Operations',
        system: 'Funding Management',
        compliance_required: false,
        context_definition: 'For Treasury Operations, Fixed Deposits provide stable, predictable funding with known maturity dates, enabling better asset-liability matching. These are term deposits classified separately from demand deposits for regulatory purposes.',
        created_at: '2024-02-09T08:10:00Z',
        updated_at: '2024-02-09T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '21-1',
        term_id: '21',
        example_text: 'A customer invests R100,000 in a 12-month Fixed Deposit at 8.5% per annum, earning R8,500 interest at maturity.',
        source: 'Fixed Deposit Product Guide',
        created_at: '2024-02-09T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '21-1',
        term_id: '21',
        related_term_id: '19',
        relationship_type: 'related',
        created_at: '2024-02-09T08:20:00Z',
      },
    ],
  },
  {
    id: '22',
    term: 'Mzansi Account',
    base_definition: 'A low-income transactional banking account developed specifically for previously unbanked communities in South Africa. Mzansi Accounts offer basic banking services with minimal fees and simplified requirements, making banking accessible to lower-income customers.',
    category: 'Products',
    tags: ['product', 'retail-banking', 'transactional', 'financial-inclusion', 'south-africa'],
    created_at: '2024-02-10T08:00:00Z',
    updated_at: '2024-02-10T08:00:00Z',
    contexts: [
      {
        id: '22-1',
        term_id: '22',
        cluster: 'Retail Banking',
        system: 'Account Management System',
        compliance_required: false,
        context_definition: 'In Retail Banking, Mzansi Accounts are basic transactional accounts with low monthly fees (typically R4.50-R10), limited free transactions (usually 4-8 per month), and simplified FICA requirements. They serve as entry-level banking products for financial inclusion.',
        created_at: '2024-02-10T08:05:00Z',
        updated_at: '2024-02-10T08:05:00Z',
      },
      {
        id: '22-2',
        term_id: '22',
        cluster: 'Compliance & Regulatory',
        system: 'FICA Compliance',
        compliance_required: true,
        context_definition: 'For Compliance teams, Mzansi Accounts have simplified KYC requirements under FICA, allowing customers to open accounts with basic identification documents. This supports financial inclusion while maintaining regulatory compliance.',
        created_at: '2024-02-10T08:10:00Z',
        updated_at: '2024-02-10T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '22-1',
        term_id: '22',
        example_text: 'A customer opens a Mzansi Account with just a South African ID and proof of residence, paying R5 monthly fee for 6 free transactions.',
        source: 'Mzansi Account Product Guide',
        created_at: '2024-02-10T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '22-1',
        term_id: '22',
        related_term_id: '20',
        relationship_type: 'related',
        created_at: '2024-02-10T08:20:00Z',
      },
    ],
  },
  {
    id: '23',
    term: 'Corporate Loan',
    base_definition: 'A loan provided to businesses for operational funding, expansion, capital expenditure, or working capital needs. Corporate loans are typically larger than retail loans and may be secured by business assets or unsecured based on creditworthiness.',
    category: 'Products',
    tags: ['product', 'corporate-banking', 'business-loan', 'commercial-lending'],
    created_at: '2024-02-11T08:00:00Z',
    updated_at: '2024-02-11T08:00:00Z',
    contexts: [
      {
        id: '23-1',
        term_id: '23',
        cluster: 'Corporate and Investment Banking',
        system: 'Corporate Lending Platform',
        compliance_required: false,
        context_definition: 'In CIB, Corporate Loans range from R1 million to R500 million+, with terms of 1-10 years. Loans may be structured as term loans, revolving credit facilities, or asset-based lending. Interest rates are typically prime plus margin, negotiated based on risk and relationship.',
        created_at: '2024-02-11T08:05:00Z',
        updated_at: '2024-02-11T08:05:00Z',
      },
      {
        id: '23-2',
        term_id: '23',
        cluster: 'Credit Management',
        system: 'Credit Assessment Platform',
        compliance_required: false,
        context_definition: 'For Credit Management, Corporate Loans require comprehensive credit analysis including financial statements, cash flow projections, industry analysis, and management assessment. Security may include business assets, personal guarantees, or both.',
        created_at: '2024-02-11T08:10:00Z',
        updated_at: '2024-02-11T08:10:00Z',
      },
      {
        id: '23-3',
        term_id: '23',
        cluster: 'Risk Management',
        system: 'Credit Risk Models',
        compliance_required: false,
        context_definition: 'In Risk Management, Corporate Loans are risk-weighted at 100% for regulatory capital (standard corporate exposure) unless secured by qualifying collateral. Large exposures require additional capital buffers and monitoring.',
        created_at: '2024-02-11T08:15:00Z',
        updated_at: '2024-02-11T08:15:00Z',
      },
    ],
    examples: [
      {
        id: '23-1',
        term_id: '23',
        example_text: 'A manufacturing company secures a R25 million Corporate Loan at prime + 2.5% over 5 years to expand production facilities, secured by plant and equipment.',
        source: 'Corporate Lending Case Study',
        created_at: '2024-02-11T08:20:00Z',
      },
    ],
    relationships: [
      {
        id: '23-1',
        term_id: '23',
        related_term_id: '24',
        relationship_type: 'related',
        created_at: '2024-02-11T08:25:00Z',
      },
    ],
  },
  {
    id: '24',
    term: 'Overdraft Facility',
    base_definition: 'A credit facility that allows a business or individual to withdraw more than the available balance in their account, up to a pre-approved limit. Interest is charged only on the amount overdrawn, making it a flexible short-term financing solution.',
    category: 'Products',
    tags: ['product', 'credit-facility', 'overdraft', 'revolving-credit'],
    created_at: '2024-02-12T08:00:00Z',
    updated_at: '2024-02-12T08:00:00Z',
    contexts: [
      {
        id: '24-1',
        term_id: '24',
        cluster: 'Corporate and Investment Banking',
        system: 'Credit Facility Management',
        compliance_required: false,
        context_definition: 'In CIB, Overdraft Facilities for corporates range from R500,000 to R50 million+, with interest rates at prime + 1% to prime + 4%. Facilities are reviewed annually and may be secured by business assets or unsecured based on credit strength.',
        created_at: '2024-02-12T08:05:00Z',
        updated_at: '2024-02-12T08:05:00Z',
      },
      {
        id: '24-2',
        term_id: '24',
        cluster: 'Retail Banking',
        system: 'Personal Credit Management',
        compliance_required: false,
        context_definition: 'In Retail Banking, Personal Overdraft Facilities range from R5,000 to R250,000, typically linked to current accounts. Interest rates are higher (prime + 3% to prime + 7%) and facilities are reviewed based on account conduct and credit score.',
        created_at: '2024-02-12T08:10:00Z',
        updated_at: '2024-02-12T08:10:00Z',
      },
      {
        id: '24-3',
        term_id: '24',
        cluster: 'Credit Management',
        system: 'Credit Facility Monitoring',
        compliance_required: false,
        context_definition: 'For Credit Management, Overdraft Facilities are revolving credit facilities requiring ongoing monitoring of utilization, account conduct, and adherence to terms. Facilities may be called if terms are breached or credit quality deteriorates.',
        created_at: '2024-02-12T08:15:00Z',
        updated_at: '2024-02-12T08:15:00Z',
      },
    ],
    examples: [
      {
        id: '24-1',
        term_id: '24',
        example_text: 'A business with a R2 million Overdraft Facility uses R800,000, paying interest only on the R800,000 utilized at prime + 2.5%.',
        source: 'Overdraft Facility Guide',
        created_at: '2024-02-12T08:20:00Z',
      },
    ],
    relationships: [
      {
        id: '24-1',
        term_id: '24',
        related_term_id: '23',
        relationship_type: 'related',
        created_at: '2024-02-12T08:25:00Z',
      },
    ],
  },
  {
    id: '25',
    term: 'Trade Finance',
    base_definition: 'Financial instruments and products used to facilitate international and domestic trade transactions. Trade finance helps businesses manage payment risks, improve cash flow, and secure supply chains by providing financing and payment guarantees.',
    category: 'Products',
    tags: ['product', 'corporate-banking', 'trade-finance', 'international-trade', 'letters-of-credit'],
    created_at: '2024-02-13T08:00:00Z',
    updated_at: '2024-02-13T08:00:00Z',
    contexts: [
      {
        id: '25-1',
        term_id: '25',
        cluster: 'Corporate and Investment Banking',
        system: 'Trade Finance Platform',
        compliance_required: false,
        context_definition: 'In CIB, Trade Finance includes Letters of Credit, Documentary Collections, Bank Guarantees, Export Finance, Import Finance, and Supply Chain Finance. Products help manage counterparty risk and provide working capital for trade transactions.',
        created_at: '2024-02-13T08:05:00Z',
        updated_at: '2024-02-13T08:05:00Z',
      },
      {
        id: '25-2',
        term_id: '25',
        cluster: 'Risk Management',
        system: 'Trade Risk Assessment',
        compliance_required: false,
        context_definition: 'For Risk Management, Trade Finance products carry country risk, counterparty risk, and documentary risk. Letters of Credit are off-balance sheet commitments until drawn, requiring appropriate capital allocation and risk monitoring.',
        created_at: '2024-02-13T08:10:00Z',
        updated_at: '2024-02-13T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '25-1',
        term_id: '25',
        example_text: 'A South African exporter receives a Letter of Credit from a Chinese buyer\'s bank, guaranteeing payment upon presentation of shipping documents, reducing payment risk.',
        source: 'Trade Finance Case Study',
        created_at: '2024-02-13T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '25-1',
        term_id: '25',
        related_term_id: '23',
        relationship_type: 'related',
        created_at: '2024-02-13T08:20:00Z',
      },
    ],
  },
  {
    id: '26',
    term: 'Private Wealth Management',
    base_definition: 'A specialized banking service providing comprehensive financial planning, investment management, and advisory services to high-net-worth individuals and families. Services include portfolio management, estate planning, tax optimization, and philanthropic advisory.',
    category: 'Products',
    tags: ['product', 'private-wealth', 'wealth-management', 'investment-advisory', 'high-net-worth'],
    created_at: '2024-02-14T08:00:00Z',
    updated_at: '2024-02-14T08:00:00Z',
    contexts: [
      {
        id: '26-1',
        term_id: '26',
        cluster: 'Private Wealth',
        system: 'Wealth Management Platform',
        compliance_required: false,
        context_definition: 'In Private Wealth, services are provided to clients with investable assets typically exceeding R5 million. Services include discretionary portfolio management, estate planning, trust services, tax advisory, and access to alternative investments like private equity and hedge funds.',
        created_at: '2024-02-14T08:05:00Z',
        updated_at: '2024-02-14T08:05:00Z',
      },
      {
        id: '26-2',
        term_id: '26',
        cluster: 'Compliance & Regulatory',
        system: 'FSCA Compliance',
        compliance_required: true,
        context_definition: 'For Compliance teams, Private Wealth Management services require FSCA licensing for financial advice and discretionary investment management. Advisors must be registered and comply with Treating Customers Fairly (TCF) principles and suitability requirements.',
        created_at: '2024-02-14T08:10:00Z',
        updated_at: '2024-02-14T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '26-1',
        term_id: '26',
        example_text: 'A high-net-worth client with R20 million in assets receives comprehensive wealth management including a diversified investment portfolio, estate planning, and tax-efficient structures.',
        source: 'Private Wealth Services Guide',
        created_at: '2024-02-14T08:15:00Z',
      },
    ],
    relationships: [],
  },
  {
    id: '27',
    term: 'Discretionary Portfolio Management',
    base_definition: 'An investment management service where a portfolio manager makes investment decisions on behalf of the client within agreed-upon investment guidelines and risk parameters. The client grants discretionary authority, allowing the manager to buy and sell investments without prior approval for each transaction.',
    category: 'Products',
    tags: ['product', 'private-wealth', 'investment-management', 'portfolio-management', 'discretionary'],
    created_at: '2024-02-15T08:00:00Z',
    updated_at: '2024-02-15T08:00:00Z',
    contexts: [
      {
        id: '27-1',
        term_id: '27',
        cluster: 'Private Wealth',
        system: 'Portfolio Management System',
        compliance_required: false,
        context_definition: 'In Private Wealth, Discretionary Portfolio Management is offered to clients with minimum investments of R2-5 million. Portfolios are managed according to client risk profiles (conservative, moderate, aggressive) and investment mandates, with regular rebalancing and performance reporting.',
        created_at: '2024-02-15T08:05:00Z',
        updated_at: '2024-02-15T08:05:00Z',
      },
      {
        id: '27-2',
        term_id: '27',
        cluster: 'Compliance & Regulatory',
        system: 'FSCA Compliance',
        compliance_required: true,
        context_definition: 'For Compliance teams, Discretionary Portfolio Management requires FSCA Category II license and compliance with Collective Investment Schemes Act. Investment mandates must be documented, and clients must receive regular performance reports and statements.',
        created_at: '2024-02-15T08:10:00Z',
        updated_at: '2024-02-15T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '27-1',
        term_id: '27',
        example_text: 'A client with R10 million grants discretionary authority to their portfolio manager, who rebalances the portfolio quarterly across equities, bonds, and alternative investments based on the agreed investment strategy.',
        source: 'Portfolio Management Agreement',
        created_at: '2024-02-15T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '27-1',
        term_id: '27',
        related_term_id: '26',
        relationship_type: 'child',
        created_at: '2024-02-15T08:20:00Z',
      },
    ],
  },
  {
    id: '28',
    term: 'Vehicle Finance',
    base_definition: 'A secured loan product specifically designed for the purchase of new or used vehicles (cars, trucks, motorcycles). The vehicle serves as collateral, and the loan is typically repaid over 12-72 months with fixed monthly installments.',
    category: 'Products',
    tags: ['product', 'retail-banking', 'vehicle-finance', 'asset-finance', 'secured-loan'],
    created_at: '2024-02-16T08:00:00Z',
    updated_at: '2024-02-16T08:00:00Z',
    contexts: [
      {
        id: '28-1',
        term_id: '28',
        cluster: 'Retail Banking',
        system: 'Asset Finance Platform',
        compliance_required: false,
        context_definition: 'In Retail Banking, Vehicle Finance is offered for amounts from R50,000 to R1.5 million, with interest rates typically ranging from prime + 1% to prime + 5% depending on credit profile and vehicle age. Loans can finance up to 100% of vehicle value for new cars.',
        created_at: '2024-02-16T08:05:00Z',
        updated_at: '2024-02-16T08:05:00Z',
      },
      {
        id: '28-2',
        term_id: '28',
        cluster: 'Credit Management',
        system: 'Asset Finance Servicing',
        compliance_required: false,
        context_definition: 'For Credit Management, Vehicle Finance requires registration of a credit agreement and retention of vehicle registration documents. The vehicle is repossessed if the customer defaults, and the bank has first claim on proceeds from vehicle sale.',
        created_at: '2024-02-16T08:10:00Z',
        updated_at: '2024-02-16T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '28-1',
        term_id: '28',
        example_text: 'A customer finances a R350,000 vehicle at prime + 2.5% over 60 months, with monthly repayments of R7,200. The vehicle registration is held by the bank until the loan is fully repaid.',
        source: 'Vehicle Finance Product Guide',
        created_at: '2024-02-16T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '28-1',
        term_id: '28',
        related_term_id: '16',
        relationship_type: 'related',
        created_at: '2024-02-16T08:20:00Z',
      },
    ],
  },
  {
    id: '29',
    term: 'Project Finance',
    base_definition: 'Long-term financing of infrastructure and industrial projects based on projected cash flows rather than the balance sheets of project sponsors. Repayment is primarily from project revenues, with project assets serving as collateral.',
    category: 'Products',
    tags: ['product', 'corporate-banking', 'project-finance', 'infrastructure', 'structured-finance'],
    created_at: '2024-02-17T08:00:00Z',
    updated_at: '2024-02-17T08:00:00Z',
    contexts: [
      {
        id: '29-1',
        term_id: '29',
        cluster: 'Corporate and Investment Banking',
        system: 'Structured Finance Platform',
        compliance_required: false,
        context_definition: 'In CIB, Project Finance is used for large infrastructure projects (power plants, toll roads, mines) typically exceeding R100 million. Financing is structured with multiple lenders, long tenors (15-25 years), and complex security packages including revenue guarantees and completion guarantees.',
        created_at: '2024-02-17T08:05:00Z',
        updated_at: '2024-02-17T08:05:00Z',
      },
      {
        id: '29-2',
        term_id: '29',
        cluster: 'Risk Management',
        system: 'Project Risk Assessment',
        compliance_required: false,
        context_definition: 'For Risk Management, Project Finance carries construction risk, operational risk, revenue risk, and political risk. Projects are assessed using financial models, sensitivity analysis, and stress testing. Lenders typically require completion guarantees and revenue guarantees.',
        created_at: '2024-02-17T08:10:00Z',
        updated_at: '2024-02-17T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '29-1',
        term_id: '29',
        example_text: 'A R2 billion solar power plant is financed through Project Finance, with repayment based on power purchase agreement revenues over 20 years, secured by the power plant assets.',
        source: 'Project Finance Case Study',
        created_at: '2024-02-17T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '29-1',
        term_id: '29',
        related_term_id: '23',
        relationship_type: 'related',
        created_at: '2024-02-17T08:20:00Z',
      },
    ],
  },
  {
    id: '30',
    term: 'Mergers and Acquisitions',
    base_definition: 'M&A - Advisory services provided to companies involved in merging with or acquiring other businesses. Services include deal structuring, valuation, due diligence, negotiation support, and financing arrangements.',
    category: 'Products',
    tags: ['product', 'investment-banking', 'm-and-a', 'advisory', 'corporate-finance'],
    created_at: '2024-02-18T08:00:00Z',
    updated_at: '2024-02-18T08:00:00Z',
    contexts: [
      {
        id: '30-1',
        term_id: '30',
        cluster: 'Corporate and Investment Banking',
        system: 'Investment Banking Platform',
        compliance_required: false,
        context_definition: 'In CIB, M&A advisory services include buy-side advisory (helping acquirers), sell-side advisory (helping sellers), merger advisory, and strategic alternatives. Deals range from R50 million to multi-billion rand transactions. Fees are typically success-based (1-3% of transaction value).',
        created_at: '2024-02-18T08:05:00Z',
        updated_at: '2024-02-18T08:05:00Z',
      },
      {
        id: '30-2',
        term_id: '30',
        cluster: 'Compliance & Regulatory',
        system: 'Regulatory Compliance',
        compliance_required: false,
        context_definition: 'For Compliance teams, M&A transactions may require Competition Commission approval for deals exceeding R600 million, and JSE listing requirements for public company transactions. Cross-border deals require exchange control approval from SARB.',
        created_at: '2024-02-18T08:10:00Z',
        updated_at: '2024-02-18T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '30-1',
        term_id: '30',
        example_text: 'A bank advises on a R1.5 billion acquisition, conducting due diligence, structuring the deal, arranging financing, and managing regulatory approvals including Competition Commission clearance.',
        source: 'M&A Transaction Case Study',
        created_at: '2024-02-18T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '30-1',
        term_id: '30',
        related_term_id: '31',
        relationship_type: 'related',
        created_at: '2024-02-18T08:20:00Z',
      },
    ],
  },
  {
    id: '31',
    term: 'Capital Raising',
    base_definition: 'Services assisting companies in raising capital through debt or equity markets. Includes initial public offerings (IPOs), secondary offerings, private placements, bond issuances, and structured finance solutions.',
    category: 'Products',
    tags: ['product', 'investment-banking', 'capital-raising', 'ipo', 'equity', 'debt'],
    created_at: '2024-02-19T08:00:00Z',
    updated_at: '2024-02-19T08:00:00Z',
    contexts: [
      {
        id: '31-1',
        term_id: '31',
        cluster: 'Corporate and Investment Banking',
        system: 'Capital Markets Platform',
        compliance_required: false,
        context_definition: 'In CIB, Capital Raising services include underwriting equity offerings (IPOs, rights issues), arranging debt issuances (corporate bonds, commercial paper), and private placements. The bank acts as lead arranger, underwriter, or placement agent, earning fees and underwriting commissions.',
        created_at: '2024-02-19T08:05:00Z',
        updated_at: '2024-02-19T08:05:00Z',
      },
      {
        id: '31-2',
        term_id: '31',
        cluster: 'Compliance & Regulatory',
        system: 'Securities Regulation',
        compliance_required: false,
        context_definition: 'For Compliance teams, Capital Raising requires FSCA approval for public offerings, JSE listing requirements for equity issuances, and compliance with Companies Act disclosure requirements. Prospectuses must be registered and approved.',
        created_at: '2024-02-19T08:10:00Z',
        updated_at: '2024-02-19T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '31-1',
        term_id: '31',
        example_text: 'A company raises R500 million through an IPO, with the bank acting as lead underwriter, pricing the shares, and managing the listing process on the JSE.',
        source: 'Capital Raising Case Study',
        created_at: '2024-02-19T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '31-1',
        term_id: '31',
        related_term_id: '30',
        relationship_type: 'related',
        created_at: '2024-02-19T08:20:00Z',
      },
    ],
  },
  {
    id: '32',
    term: 'FICA',
    base_definition: 'Financial Intelligence Centre Act - South African legislation (Act 38 of 2001) that requires financial institutions to implement measures to combat money laundering and the financing of terrorism. It mandates customer identification, record-keeping, and reporting of suspicious transactions to the Financial Intelligence Centre (FIC).',
    category: 'Compliance',
    tags: ['compliance', 'regulatory', 'south-africa', 'anti-money-laundering', 'legislation', 'fica'],
    compliance_frameworks: ['FICA'],
    created_at: '2024-02-20T08:00:00Z',
    updated_at: '2024-02-20T08:00:00Z',
    contexts: [
      {
        id: '32-1',
        term_id: '32',
        cluster: 'Customer Onboarding',
        system: 'Onboarding Platform',
        compliance_required: false,
        context_definition: 'In Customer Onboarding, FICA requires verification of customer identity documents (SA ID or passport), proof of residence (not older than 3 months), and collection of tax information before account activation. All new customers must provide FICA documentation.',
        created_at: '2024-02-20T08:05:00Z',
        updated_at: '2024-02-20T08:05:00Z',
      },
      {
        id: '32-2',
        term_id: '32',
        cluster: 'Compliance & Regulatory',
        system: 'FIC Reporting System',
        compliance_required: false,
        context_definition: 'For Compliance teams, FICA compliance involves ongoing customer due diligence, suspicious transaction reporting to the FIC, maintaining comprehensive customer records for 5 years, and enhanced due diligence for high-risk customers including PEPs and high-value transactions.',
        created_at: '2024-02-20T08:10:00Z',
        updated_at: '2024-02-20T08:10:00Z',
      },
      {
        id: '32-3',
        term_id: '32',
        cluster: 'Risk Management',
        system: 'Risk Assessment Platform',
        compliance_required: false,
        context_definition: 'In Risk Management, FICA compliance is integrated into risk assessment models to identify high-risk customers requiring enhanced due diligence and ongoing monitoring. Risk-based approach determines the level of due diligence required.',
        created_at: '2024-02-20T08:15:00Z',
        updated_at: '2024-02-20T08:15:00Z',
      },
    ],
    examples: [
      {
        id: '32-1',
        term_id: '32',
        example_text: 'All new customers must provide FICA documentation including a valid South African ID and proof of residence before opening an account, with records maintained for 5 years.',
        source: 'Customer Onboarding Policy v3.0',
        created_at: '2024-02-20T08:20:00Z',
      },
      {
        id: '32-2',
        term_id: '32',
        context_id: '32-2',
        example_text: 'FICA requires us to report all suspicious transactions to the FIC within 15 days of detection, including cash transactions exceeding R25,000.',
        source: 'FIC Reporting Procedures',
        created_at: '2024-02-20T08:25:00Z',
      },
    ],
    relationships: [
      {
        id: '32-1',
        term_id: '32',
        related_term_id: '1',
        relationship_type: 'parent',
        created_at: '2024-02-20T08:30:00Z',
      },
      {
        id: '32-2',
        term_id: '32',
        related_term_id: '2',
        relationship_type: 'related',
        created_at: '2024-02-20T08:35:00Z',
      },
    ],
  },
  {
    id: '33',
    term: 'SARB',
    base_definition: 'South African Reserve Bank - The central bank of South Africa, responsible for maintaining price stability, issuing currency, ensuring the soundness of the financial system, and implementing monetary policy. The SARB also houses the Prudential Authority which regulates banks.',
    category: 'Regulatory',
    tags: ['regulatory', 'south-africa', 'central-bank', 'monetary-policy', 'sarb'],
    created_at: '2024-02-21T08:00:00Z',
    updated_at: '2024-02-21T08:00:00Z',
    contexts: [
      {
        id: '33-1',
        term_id: '33',
        cluster: 'Treasury Operations',
        system: 'Liquidity Management',
        compliance_required: false,
        context_definition: 'In Treasury Operations, the SARB sets the repo rate which determines our cost of funding and influences our lending rates. We also maintain reserve requirements with the SARB and participate in open market operations.',
        created_at: '2024-02-21T08:05:00Z',
        updated_at: '2024-02-21T08:05:00Z',
      },
      {
        id: '33-2',
        term_id: '33',
        cluster: 'Compliance & Regulatory',
        system: 'Regulatory Reporting',
        compliance_required: false,
        context_definition: 'For Compliance teams, the SARB (through the Prudential Authority) requires regular regulatory reporting including capital adequacy ratios, liquidity coverage ratios, stress testing results, and large exposure reporting.',
        created_at: '2024-02-21T08:10:00Z',
        updated_at: '2024-02-21T08:10:00Z',
      },
      {
        id: '33-3',
        term_id: '33',
        cluster: 'Payments & Settlements',
        system: 'SAMOS',
        compliance_required: false,
        context_definition: 'In Payments & Settlements, the SARB operates SAMOS (South African Multiple Option Settlement System) for real-time gross settlement of high-value interbank transactions, ensuring finality of payment.',
        created_at: '2024-02-21T08:15:00Z',
        updated_at: '2024-02-21T08:15:00Z',
      },
    ],
    examples: [
      {
        id: '33-1',
        term_id: '33',
        example_text: 'The SARB increased the repo rate by 0.5% to 7.25%, which will impact our prime lending rate and customer borrowing costs across all lending products.',
        source: 'Treasury Market Update',
        created_at: '2024-02-21T08:20:00Z',
      },
      {
        id: '33-2',
        term_id: '33',
        context_id: '33-3',
        example_text: 'All interbank settlements over R1 million are processed through SARB\'s SAMOS system for same-day settlement, ensuring no credit risk between banks.',
        source: 'Payments Operations Manual',
        created_at: '2024-02-21T08:25:00Z',
      },
    ],
    relationships: [],
  },
  {
    id: '34',
    term: 'PASA',
    base_definition: 'Payments Association of South Africa - An organization responsible for managing the safety, efficiency, and integrity of the national payment system in South Africa. PASA sets rules and standards for payment clearing and settlement processes, ensuring interoperability between banks.',
    category: 'Payments',
    tags: ['payments', 'south-africa', 'clearing', 'settlement', 'regulatory', 'pasa'],
    created_at: '2024-02-22T08:00:00Z',
    updated_at: '2024-02-22T08:00:00Z',
    contexts: [
      {
        id: '34-1',
        term_id: '34',
        cluster: 'Payments & Settlements',
        system: 'Payment Clearing',
        compliance_required: false,
        context_definition: 'In Payments & Settlements, PASA governs the clearing rules for EFT, debit orders, and card transactions. We must comply with PASA rules for transaction processing times, dispute resolution procedures, and settlement deadlines.',
        created_at: '2024-02-22T08:05:00Z',
        updated_at: '2024-02-22T08:05:00Z',
      },
      {
        id: '34-2',
        term_id: '34',
        cluster: 'Digital Banking',
        system: 'Payment Gateway',
        compliance_required: false,
        context_definition: 'For Digital Banking, PASA standards ensure interoperability between different banks\' payment systems and define security requirements for online and mobile payments, including authentication and encryption standards.',
        created_at: '2024-02-22T08:10:00Z',
        updated_at: '2024-02-22T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '34-1',
        term_id: '34',
        example_text: 'PASA rules require that EFT payments are processed within 2 business days, with same-day processing available for urgent transactions at higher fees.',
        source: 'Payment Operations Guide',
        created_at: '2024-02-22T08:15:00Z',
      },
    ],
    relationships: [],
  },
  {
    id: '35',
    term: 'EFT',
    base_definition: 'Electronic Funds Transfer - The electronic transfer of money from one bank account to another, either within a single financial institution or across multiple institutions. In South Africa, EFTs are governed by PASA rules and can be processed as same-day or standard (2 business days) transactions.',
    category: 'Payments',
    tags: ['payments', 'south-africa', 'electronic-transfer', 'pasa', 'eft'],
    created_at: '2024-02-23T08:00:00Z',
    updated_at: '2024-02-23T08:00:00Z',
    contexts: [
      {
        id: '35-1',
        term_id: '35',
        cluster: 'Retail Banking',
        system: 'Internet Banking',
        compliance_required: false,
        context_definition: 'In Retail Banking, customers use EFT to transfer funds between accounts via internet banking, mobile banking, or branch channels. Standard EFTs process in 2 business days, while urgent EFTs settle same-day at higher fees.',
        created_at: '2024-02-23T08:05:00Z',
        updated_at: '2024-02-23T08:05:00Z',
      },
      {
        id: '35-2',
        term_id: '35',
        cluster: 'Corporate Banking',
        system: 'Bulk Payment System',
        compliance_required: false,
        context_definition: 'For Corporate Banking, EFT includes bulk payment processing for payroll, supplier payments, and batch transfers. Corporate clients can schedule recurring EFTs and use file-based uploads for high-volume transactions.',
        created_at: '2024-02-23T08:10:00Z',
        updated_at: '2024-02-23T08:10:00Z',
      },
      {
        id: '35-3',
        term_id: '35',
        cluster: 'Payments & Settlements',
        system: 'Payment Processing',
        compliance_required: false,
        context_definition: 'In Payments & Settlements, EFT transactions are cleared through BankservAfrica and settled via the SARB\'s SAMOS system for interbank transfers. Same-day EFTs use real-time clearing infrastructure.',
        created_at: '2024-02-23T08:15:00Z',
        updated_at: '2024-02-23T08:15:00Z',
      },
    ],
    examples: [
      {
        id: '35-1',
        term_id: '35',
        example_text: 'Customers can initiate EFT payments up to R1 million per day through internet banking, with higher limits available for corporate clients and same-day processing for urgent transfers.',
        source: 'Internet Banking User Guide',
        created_at: '2024-02-23T08:20:00Z',
      },
      {
        id: '35-2',
        term_id: '35',
        context_id: '35-2',
        example_text: 'Corporate clients process an average of 5,000 EFT payments daily through our bulk payment system for payroll and supplier payments, with automated reconciliation.',
        source: 'Corporate Banking Statistics',
        created_at: '2024-02-23T08:25:00Z',
      },
    ],
    relationships: [
      {
        id: '35-1',
        term_id: '35',
        related_term_id: '34',
        relationship_type: 'related',
        created_at: '2024-02-23T08:30:00Z',
      },
    ],
  },
  {
    id: '36',
    term: 'RTC',
    base_definition: 'Real-Time Clearing - A payment system that allows for the immediate clearing and settlement of interbank transactions. RTC enables near-instantaneous payment processing, typically completing within seconds of initiation, providing real-time fund availability.',
    category: 'Payments',
    tags: ['payments', 'south-africa', 'real-time', 'clearing', 'pasa', 'rtc'],
    created_at: '2024-02-24T08:00:00Z',
    updated_at: '2024-02-24T08:00:00Z',
    contexts: [
      {
        id: '36-1',
        term_id: '36',
        cluster: 'Digital Banking',
        system: 'Mobile Payment App',
        compliance_required: false,
        context_definition: 'In Digital Banking, RTC powers instant payment features in mobile banking apps, allowing customers to send and receive money in real-time using mobile numbers or account numbers, with funds available immediately.',
        created_at: '2024-02-24T08:05:00Z',
        updated_at: '2024-02-24T08:05:00Z',
      },
      {
        id: '36-2',
        term_id: '36',
        cluster: 'Payments & Settlements',
        system: 'Real-Time Payment Gateway',
        compliance_required: false,
        context_definition: 'For Payments & Settlements, RTC transactions are processed through BankservAfrica\'s real-time clearing infrastructure and settled immediately via SAMOS, ensuring finality of payment and immediate fund availability.',
        created_at: '2024-02-24T08:10:00Z',
        updated_at: '2024-02-24T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '36-1',
        term_id: '36',
        example_text: 'RTC enables customers to send money instantly to any bank account in South Africa using just a mobile number, with funds available immediately for the recipient.',
        source: 'Mobile Banking Features',
        created_at: '2024-02-24T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '36-1',
        term_id: '36',
        related_term_id: '35',
        relationship_type: 'related',
        created_at: '2024-02-24T08:20:00Z',
      },
    ],
  },
  {
    id: '37',
    term: 'DebiCheck',
    base_definition: 'Authenticated Collections (DebiCheck) - A system introduced in South Africa that allows consumers to electronically authenticate debit orders before they are processed. DebiCheck enhances security and reduces unauthorized debits by requiring customer authentication via their banking app or SMS.',
    category: 'Payments',
    tags: ['payments', 'south-africa', 'debit-order', 'authentication', 'pasa', 'debicheck'],
    created_at: '2024-02-25T08:00:00Z',
    updated_at: '2024-02-25T08:00:00Z',
    contexts: [
      {
        id: '37-1',
        term_id: '37',
        cluster: 'Retail Banking',
        system: 'Debit Order Management',
        compliance_required: false,
        context_definition: 'In Retail Banking, DebiCheck requires customers to authenticate recurring debit orders through their banking app, providing consent before each collection. This replaces the older NAEDO system for authenticated collections, reducing disputes.',
        created_at: '2024-02-25T08:05:00Z',
        updated_at: '2024-02-25T08:05:00Z',
      },
      {
        id: '37-2',
        term_id: '37',
        cluster: 'Payments & Settlements',
        system: 'Collection Processing',
        compliance_required: false,
        context_definition: 'For Payments & Settlements, DebiCheck collections are processed through BankservAfrica with authentication verification, ensuring only authorized debits are executed. Failed authentications result in rejected collections.',
        created_at: '2024-02-25T08:10:00Z',
        updated_at: '2024-02-25T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '37-1',
        term_id: '37',
        example_text: 'Customers must authenticate their insurance premium debit order via DebiCheck before the collection is processed, reducing unauthorized debit disputes by 40% compared to NAEDO.',
        source: 'Debit Order Policy',
        created_at: '2024-02-25T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '37-1',
        term_id: '37',
        related_term_id: '35',
        relationship_type: 'related',
        created_at: '2024-02-25T08:20:00Z',
      },
    ],
  },
  {
    id: '38',
    term: 'SAMOS',
    base_definition: 'South African Multiple Option Settlement System - The real-time gross settlement system operated by the South African Reserve Bank (SARB) for the settlement of interbank obligations. SAMOS processes high-value transactions and ensures final settlement between banks with no credit risk.',
    category: 'Payments',
    tags: ['payments', 'south-africa', 'settlement', 'sarb', 'interbank', 'samos'],
    created_at: '2024-02-26T08:00:00Z',
    updated_at: '2024-02-26T08:00:00Z',
    contexts: [
      {
        id: '38-1',
        term_id: '38',
        cluster: 'Treasury Operations',
        system: 'Liquidity Management',
        compliance_required: false,
        context_definition: 'In Treasury Operations, SAMOS is used for managing nostro accounts and ensuring sufficient liquidity for same-day settlement of high-value interbank transfers. Banks must maintain adequate balances with SARB for SAMOS settlements.',
        created_at: '2024-02-26T08:05:00Z',
        updated_at: '2024-02-26T08:05:00Z',
      },
      {
        id: '38-2',
        term_id: '38',
        cluster: 'Payments & Settlements',
        system: 'Interbank Settlement',
        compliance_required: false,
        context_definition: 'For Payments & Settlements, SAMOS processes all interbank settlements over R1 million in real-time, with finality of payment and no credit risk. Transactions are settled individually on a gross basis, not netted.',
        created_at: '2024-02-26T08:10:00Z',
        updated_at: '2024-02-26T08:10:00Z',
      },
    ],
    examples: [
      {
        id: '38-1',
        term_id: '38',
        example_text: 'All interbank settlements exceeding R1 million are processed through SAMOS for same-day final settlement, ensuring no credit risk between banks and immediate fund availability.',
        source: 'Treasury Operations Manual',
        created_at: '2024-02-26T08:15:00Z',
      },
    ],
    relationships: [
      {
        id: '38-1',
        term_id: '38',
        related_term_id: '33',
        relationship_type: 'related',
        created_at: '2024-02-26T08:20:00Z',
      },
    ],
  },
];

// Mock Proposals
export const mockProposals: TermProposal[] = [
  {
    id: 'p1',
    term_id: '1',
    proposal_type: 'update',
    proposed_data: {
      base_definition: 'Know Your Customer - An enhanced process used by financial institutions to verify the identity of their clients, assess potential risks, and ensure regulatory compliance.',
    },
    reason: 'The current definition should emphasize regulatory compliance more clearly.',
    status: 'pending',
    created_at: '2024-01-25T10:00:00Z',
    updated_at: '2024-01-25T10:00:00Z',
  },
  {
    id: 'p2',
    proposal_type: 'create',
    proposed_data: {
      term: 'GDPR',
      base_definition: 'General Data Protection Regulation - EU regulation on data protection and privacy.',
      category: 'Compliance',
      tags: ['compliance', 'privacy', 'data-protection'],
    },
    reason: 'This term is frequently used but not yet in our glossary.',
    status: 'pending',
    created_at: '2024-01-26T11:00:00Z',
    updated_at: '2024-01-26T11:00:00Z',
  },
  {
    id: 'p3',
    term_id: '3',
    proposal_type: 'update',
    proposed_data: {
      category: 'Data Infrastructure',
    },
    reason: 'Category should be more specific.',
    status: 'approved',
    created_at: '2024-01-24T09:00:00Z',
    updated_at: '2024-01-24T10:00:00Z',
    reviewed_at: '2024-01-24T10:00:00Z',
  },
];

// Mock Flags
export const mockFlags: TermFlag[] = [
  {
    id: 'f1',
    term_id: '2',
    flag_type: 'inconsistency',
    description: 'The definition of AML in Risk Management cluster conflicts with the definition in Compliance cluster.',
    status: 'open',
    created_at: '2024-01-27T12:00:00Z',
    updated_at: '2024-01-27T12:00:00Z',
  },
  {
    id: 'f2',
    term_id: '5',
    flag_type: 'outdated',
    description: 'The API Gateway definition references Kong, but we have migrated to AWS API Gateway.',
    status: 'open',
    created_at: '2024-01-28T13:00:00Z',
    updated_at: '2024-01-28T13:00:00Z',
  },
  {
    id: 'f3',
    term_id: '4',
    flag_type: 'duplicate',
    description: 'This term may be a duplicate of "Data Warehouse" - needs review.',
    status: 'resolved',
    created_at: '2024-01-23T14:00:00Z',
    updated_at: '2024-01-23T15:00:00Z',
    resolved_at: '2024-01-23T15:00:00Z',
  },
];

// Mock Gap Analysis Data
export const mockGaps: GapAnalysis[] = [
  {
    id: 'gap-1',
    term_id: '1',
    gap_type: 'conflicting_definition',
    affected_clusters: ['Risk Management', 'Compliance'],
    severity: 'high',
    description: 'Term has conflicting definitions across 2 cluster(s)',
    detected_at: '2024-01-20T10:00:00Z',
    term: mockTerms.find(t => t.id === '1'),
  },
  {
    id: 'gap-2',
    term_id: '2',
    gap_type: 'missing_context',
    affected_clusters: ['Customer Onboarding', 'IT Operations'],
    severity: 'medium',
    description: 'Term has contexts in 1 cluster(s) but is missing in 2 cluster(s)',
    detected_at: '2024-01-20T10:05:00Z',
    term: mockTerms.find(t => t.id === '2'),
  },
  {
    id: 'gap-3',
    term_id: '3',
    gap_type: 'outdated',
    affected_clusters: ['Risk Management'],
    severity: 'low',
    description: 'Term has outdated context definitions in 1 cluster(s) (not updated in 6+ months)',
    detected_at: '2024-01-20T10:10:00Z',
    term: mockTerms.find(t => t.id === '3'),
  },
  {
    id: 'gap-4',
    term_id: '4',
    gap_type: 'missing_context',
    affected_clusters: ['Risk Management', 'Compliance', 'IT Operations'],
    severity: 'high',
    description: 'Term has contexts in 1 cluster(s) but is missing in 3 cluster(s)',
    detected_at: '2024-01-20T10:15:00Z',
    term: mockTerms.find(t => t.id === '4'),
  },
  {
    id: 'gap-5',
    term_id: '5',
    gap_type: 'conflicting_definition',
    affected_clusters: ['Risk Management', 'Compliance'],
    severity: 'medium',
    description: 'Term has conflicting definitions across 2 cluster(s)',
    detected_at: '2024-01-20T10:20:00Z',
    term: mockTerms.find(t => t.id === '5'),
  },
  {
    id: 'gap-6',
    term_id: '6',
    gap_type: 'missing_context',
    affected_clusters: ['Risk Management', 'Compliance', 'Finance'],
    severity: 'medium',
    description: 'Term has contexts in 1 cluster(s) but is missing in 3 cluster(s)',
    detected_at: '2024-01-20T10:25:00Z',
    term: mockTerms.find(t => t.id === '6'),
  },
  {
    id: 'gap-7',
    term_id: '7',
    gap_type: 'outdated',
    affected_clusters: ['Compliance'],
    severity: 'low',
    description: 'Term has outdated context definitions in 1 cluster(s) (not updated in 6+ months)',
    detected_at: '2024-01-20T10:30:00Z',
    term: mockTerms.find(t => t.id === '7'),
  },
  {
    id: 'gap-8',
    term_id: '8',
    gap_type: 'missing_context',
    affected_clusters: ['Risk Management', 'Compliance', 'Finance'],
    severity: 'high',
    description: 'Term has contexts in 1 cluster(s) but is missing in 3 cluster(s)',
    detected_at: '2024-01-20T10:35:00Z',
    term: mockTerms.find(t => t.id === '8'),
  },
];

// Mock Clusters
export const mockClusters: Cluster[] = [
  {
    id: 'cluster-1',
    name: 'Risk Management',
    description: 'Risk management and assessment cluster',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cluster-2',
    name: 'Compliance',
    description: 'Regulatory compliance and governance cluster',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cluster-3',
    name: 'IT Operations',
    description: 'IT infrastructure and operations cluster',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cluster-4',
    name: 'Finance',
    description: 'Financial operations and reporting cluster',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cluster-5',
    name: 'Customer Onboarding',
    description: 'Customer acquisition and onboarding processes',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Mock Gap Analytics
export const mockGapAnalytics: GapAnalytics = {
  total_gaps: 8,
  resolved_gaps: 2,
  gaps_by_type: {
    missing_context: 4,
    conflicting_definition: 2,
    outdated: 2,
  },
  gaps_by_severity: {
    high: 3,
    medium: 3,
    low: 2,
  },
};

// Mock Cluster Coverage
export const mockClusterCoverage: ClusterCoverage = {
  total_terms: 10,
  clusters: [
    {
      cluster: 'Risk Management',
      terms_with_context: 6,
      total_terms: 10,
      coverage_percent: 60.0,
      gaps_count: 2,
    },
    {
      cluster: 'Compliance',
      terms_with_context: 7,
      total_terms: 10,
      coverage_percent: 70.0,
      gaps_count: 3,
    },
    {
      cluster: 'IT Operations',
      terms_with_context: 4,
      total_terms: 10,
      coverage_percent: 40.0,
      gaps_count: 1,
    },
    {
      cluster: 'Finance',
      terms_with_context: 5,
      total_terms: 10,
      coverage_percent: 50.0,
      gaps_count: 2,
    },
    {
      cluster: 'Customer Onboarding',
      terms_with_context: 3,
      total_terms: 10,
      coverage_percent: 30.0,
      gaps_count: 0,
    },
  ],
};

// Mock Branding Config
export const mockBrandingConfig: BrandingConfig = {
  id: 'b1',
  organization_id: 'default',
  light_color: '#EAF9E7',
  pastel_color: '#C0E6BA',
  primary_color: '#4CA771',
  dark_color: '#013237',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

// Mock Access Requests Data
export const mockAccessRequests: AccessRequest[] = [
  {
    id: 'ar1',
    term_id: '5',
    term_name: 'API Gateway',
    requested_by: 'user1',
    requested_by_name: 'John Doe',
    reason: 'Need access to API Gateway documentation for integration project in Retail Banking.',
    status: 'pending',
    created_at: '2024-02-20T10:00:00Z',
    updated_at: '2024-02-20T10:00:00Z',
  },
  {
    id: 'ar2',
    term_id: '8',
    term_name: 'ETL',
    requested_by: 'user2',
    requested_by_name: 'Jane Smith',
    reason: 'Working on data pipeline migration and need to understand ETL processes.',
    status: 'approved',
    reviewed_by: 'admin1',
    reviewed_by_name: 'Admin User',
    reviewed_at: '2024-02-21T14:30:00Z',
    created_at: '2024-02-20T11:00:00Z',
    updated_at: '2024-02-21T14:30:00Z',
  },
  {
    id: 'ar3',
    term_id: '10',
    term_name: 'CI/CD',
    requested_by: 'user3',
    requested_by_name: 'Bob Johnson',
    reason: 'Setting up deployment pipelines for new microservices.',
    status: 'rejected',
    reviewed_by: 'admin1',
    reviewed_by_name: 'Admin User',
    reviewed_at: '2024-02-22T09:15:00Z',
    created_at: '2024-02-21T08:00:00Z',
    updated_at: '2024-02-22T09:15:00Z',
  },
];

// Mock Onboarding Data
export const mockOnboardingProgress = {
  viewed_count: 5,
  total_count: 20,
  progress_percent: 25.0,
  onboarding_completed: false,
};

// Mock Notifications Data
export const mockNotifications: Notification[] = [
  {
    id: 'n1',
    user_id: 'current-user',
    type: 'proposal',
    message: 'Your proposal for "KYC" term update has been approved',
    read: false,
    created_at: '2024-02-25T10:00:00Z',
  },
  {
    id: 'n2',
    user_id: 'current-user',
    type: 'flag',
    message: 'A flag has been raised on term "AML" for potential inconsistency',
    read: false,
    created_at: '2024-02-25T09:30:00Z',
  },
  {
    id: 'n3',
    user_id: 'current-user',
    type: 'gap_resolved',
    message: 'Gap analysis issue for "FICA" has been resolved',
    read: true,
    created_at: '2024-02-24T15:20:00Z',
  },
  {
    id: 'n4',
    user_id: 'current-user',
    type: 'new_term',
    message: 'New term "API Gateway" has been added to the glossary',
    read: false,
    created_at: '2024-02-24T14:00:00Z',
  },
  {
    id: 'n5',
    user_id: 'current-user',
    type: 'proposal',
    message: 'Your proposal for "ETL" term creation is pending review',
    read: true,
    created_at: '2024-02-23T11:15:00Z',
  },
  {
    id: 'n6',
    user_id: 'current-user',
    type: 'flag',
    message: 'Flag on term "CI/CD" has been resolved',
    read: true,
    created_at: '2024-02-22T16:45:00Z',
  },
];

// Mock Term Versions Data
export const mockTermVersions: TermVersion[] = [
  {
    id: 'v1',
    term_id: '1',
    version_number: 1,
    term_data: {
      id: '1',
      term: 'KYC',
      base_definition: 'Know Your Customer - A process used by financial institutions to verify the identity of their clients and assess potential risks of illegal intentions.',
      category: 'Compliance',
      tags: ['compliance', 'regulatory', 'risk'],
    },
    changed_by: 'user1',
    change_reason: 'Initial version',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'v2',
    term_id: '1',
    version_number: 2,
    term_data: {
      id: '1',
      term: 'KYC',
      base_definition: 'Know Your Customer - A comprehensive process used by financial institutions to verify the identity of their clients, assess potential risks of illegal intentions, and ensure compliance with regulatory requirements.',
      category: 'Compliance',
      tags: ['compliance', 'regulatory', 'risk', 'verification'],
    },
    changed_by: 'user2',
    change_reason: 'Expanded definition to include compliance aspect',
    created_at: '2024-02-10T14:30:00Z',
  },
  {
    id: 'v3',
    term_id: '2',
    version_number: 1,
    term_data: {
      id: '2',
      term: 'AML',
      base_definition: 'Anti-Money Laundering - A set of laws, regulations, and procedures intended to prevent criminals from disguising illegally obtained funds as legitimate income.',
      category: 'Compliance',
      tags: ['compliance', 'regulatory', 'fraud'],
    },
    changed_by: 'user1',
    change_reason: 'Initial version',
    created_at: '2024-01-16T09:00:00Z',
  },
  {
    id: 'v4',
    term_id: '5',
    version_number: 1,
    term_data: {
      id: '5',
      term: 'API Gateway',
      base_definition: 'A server that acts as an API front-end, receiving API requests, enforcing throttling and security policies, passing requests to the back-end service and then passing the response back to the requester.',
      category: 'Technology',
      tags: ['api', 'infrastructure', 'integration'],
    },
    changed_by: 'user3',
    change_reason: 'Initial version',
    created_at: '2024-02-01T11:00:00Z',
  },
  {
    id: 'v5',
    term_id: '5',
    version_number: 2,
    term_data: {
      id: '5',
      term: 'API Gateway',
      base_definition: 'A server that acts as an API front-end, receiving API requests, enforcing throttling and security policies, passing requests to the back-end service and then passing the response back to the requester. It provides a unified entry point for multiple microservices.',
      category: 'Technology',
      tags: ['api', 'infrastructure', 'integration', 'microservices'],
    },
    changed_by: 'user2',
    change_reason: 'Added microservices context',
    created_at: '2024-02-15T16:20:00Z',
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockApi = {
  terms: {
    list: async (params?: { limit?: number; offset?: number; category?: string }): Promise<PaginatedResponse<Term>> => {
      await delay(300);
      let filtered = [...mockTerms];
      
      // Get department from localStorage (set by UserContext)
      const department = typeof window !== 'undefined' ? localStorage.getItem('clarityconnect_user_department') : null;
      
      // Apply department filtering if department is set
      if (department && department !== '') {
        filtered = filtered.filter(t => {
          // Terms are visible if:
          // 1. visibility_type is 'public' (or undefined/null, defaulting to public)
          // 2. visibility_type is 'department_restricted' AND user's department is in allowed_departments
          // 3. Term has contexts matching user's department (cluster match)
          
          const isPublic = !t.visibility_type || t.visibility_type === 'public';
          const isAllowedDepartment = t.visibility_type === 'department_restricted' && 
            t.allowed_departments?.includes(department);
          const hasMatchingContext = t.contexts?.some(ctx => ctx.cluster === department);
          
          return isPublic || isAllowedDepartment || hasMatchingContext;
        });
      }
      
      if (params?.category) {
        filtered = filtered.filter(t => t.category === params.category);
      }
      
      const limit = params?.limit || 20;
      const offset = params?.offset || 0;
      const total = filtered.length;
      const data = filtered.slice(offset, offset + limit);
      
      return { data, total, limit, offset };
    },
    
    get: async (id: string): Promise<Term> => {
      await delay(200);
      const term = mockTerms.find(t => t.id === id);
      if (!term) throw new Error('Term not found');
      return term;
    },
    
    create: async (data: any): Promise<Term> => {
      await delay(400);
      const newTerm: Term = {
        id: String(mockTerms.length + 1),
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        contexts: [],
        examples: [],
        relationships: [],
      };
      mockTerms.push(newTerm);
      return newTerm;
    },
    
    update: async (id: string, data: any): Promise<Term> => {
      await delay(400);
      const index = mockTerms.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Term not found');
      mockTerms[index] = { ...mockTerms[index], ...data, updated_at: new Date().toISOString() };
      return mockTerms[index];
    },
    
    delete: async (id: string): Promise<void> => {
      await delay(300);
      const index = mockTerms.findIndex(t => t.id === id);
      if (index === -1) throw new Error('Term not found');
      mockTerms.splice(index, 1);
    },
    
    createContext: async (termId: string, data: any) => {
      await delay(300);
      return { id: 'new-context', term_id: termId, ...data, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    },
    
    createExample: async (termId: string, data: any) => {
      await delay(300);
      return { id: 'new-example', term_id: termId, ...data, created_at: new Date().toISOString() };
    },
    
    createRelationship: async (termId: string, data: any) => {
      await delay(300);
      return { id: 'new-rel', term_id: termId, ...data, created_at: new Date().toISOString() };
    },
  },
  
  search: {
    search: async (params: { q: string; category?: string; cluster?: string; system?: string; limit?: number; offset?: number }): Promise<PaginatedResponse<Term>> => {
      await delay(400);
      let filtered = [...mockTerms];
      
      if (params.q) {
        const query = params.q.toLowerCase();
        filtered = filtered.filter(t => 
          t.term.toLowerCase().includes(query) ||
          t.base_definition.toLowerCase().includes(query) ||
          t.category?.toLowerCase().includes(query) ||
          t.tags?.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      if (params.category) {
        filtered = filtered.filter(t => t.category === params.category);
      }
      
      if (params.cluster || params.system) {
        filtered = filtered.filter(t => 
          t.contexts?.some(ctx => 
            (params.cluster && ctx.cluster === params.cluster) ||
            (params.system && ctx.system === params.system)
          )
        );
      }
      
      const limit = params.limit || 20;
      const offset = params.offset || 0;
      const total = filtered.length;
      const data = filtered.slice(offset, offset + limit);
      
      return { data, total, limit, offset };
    },
  },
  
  governance: {
    proposals: {
      list: async (params?: { limit?: number; offset?: number; status?: string }): Promise<PaginatedResponse<TermProposal>> => {
        await delay(300);
        let filtered = [...mockProposals];
        
        if (params?.status) {
          filtered = filtered.filter(p => p.status === params.status);
        }
        
        const limit = params?.limit || 20;
        const offset = params?.offset || 0;
        const total = filtered.length;
        const data = filtered.slice(offset, offset + limit);
        
        return { data, total, limit, offset };
      },
      
      get: async (id: string): Promise<TermProposal> => {
        await delay(200);
        const proposal = mockProposals.find(p => p.id === id);
        if (!proposal) throw new Error('Proposal not found');
        return proposal;
      },
      
      create: async (data: any): Promise<TermProposal> => {
        await delay(400);
        const newProposal: TermProposal = {
          id: `p${mockProposals.length + 1}`,
          ...data,
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockProposals.push(newProposal);
        return newProposal;
      },
      
      updateStatus: async (id: string, status: 'approved' | 'rejected'): Promise<TermProposal> => {
        await delay(300);
        const proposal = mockProposals.find(p => p.id === id);
        if (!proposal) throw new Error('Proposal not found');
        proposal.status = status;
        proposal.updated_at = new Date().toISOString();
        proposal.reviewed_at = new Date().toISOString();
        return proposal;
      },
    },
    
    flags: {
      list: async (params?: { limit?: number; offset?: number; term_id?: string; status?: string }): Promise<PaginatedResponse<TermFlag>> => {
        await delay(300);
        let filtered = [...mockFlags];
        
        if (params?.term_id) {
          filtered = filtered.filter(f => f.term_id === params.term_id);
        }
        
        if (params?.status) {
          filtered = filtered.filter(f => f.status === params.status);
        }
        
        const limit = params?.limit || 20;
        const offset = params?.offset || 0;
        const total = filtered.length;
        const data = filtered.slice(offset, offset + limit);
        
        return { data, total, limit, offset };
      },
      
      get: async (id: string): Promise<TermFlag> => {
        await delay(200);
        const flag = mockFlags.find(f => f.id === id);
        if (!flag) throw new Error('Flag not found');
        return flag;
      },
      
      create: async (termId: string, data: any): Promise<TermFlag> => {
        await delay(400);
        const newFlag: TermFlag = {
          id: `f${mockFlags.length + 1}`,
          term_id: termId,
          ...data,
          status: 'open',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockFlags.push(newFlag);
        return newFlag;
      },
      
      updateStatus: async (id: string, status: 'open' | 'resolved' | 'dismissed'): Promise<TermFlag> => {
        await delay(300);
        const flag = mockFlags.find(f => f.id === id);
        if (!flag) throw new Error('Flag not found');
        flag.status = status;
        flag.updated_at = new Date().toISOString();
        if (status === 'resolved') {
          flag.resolved_at = new Date().toISOString();
        }
        return flag;
      },
    },
  },
  
  branding: {
    get: async (organizationId?: string): Promise<BrandingConfig> => {
      await delay(200);
      return mockBrandingConfig;
    },
    
    update: async (config: Partial<BrandingConfig>, organizationId?: string): Promise<BrandingConfig> => {
      await delay(300);
      return { ...mockBrandingConfig, ...config, updated_at: new Date().toISOString() };
    },
  },
  
  gaps: {
    list: async (params?: {
      limit?: number;
      offset?: number;
      gap_type?: string;
      cluster?: string;
      severity?: string;
      resolved?: boolean;
    }): Promise<PaginatedResponse<GapAnalysis>> => {
      await delay(300);
      let filtered = [...mockGaps];
      
      if (params?.gap_type) {
        filtered = filtered.filter(g => g.gap_type === params.gap_type);
      }
      
      if (params?.severity) {
        filtered = filtered.filter(g => g.severity === params.severity);
      }
      
      if (params?.cluster) {
        filtered = filtered.filter(g => g.affected_clusters.includes(params.cluster!));
      }
      
      if (params?.resolved !== undefined) {
        if (params.resolved) {
          filtered = filtered.filter(g => g.resolved_at);
        } else {
          filtered = filtered.filter(g => !g.resolved_at);
        }
      }
      
      const limit = params?.limit || 20;
      const offset = params?.offset || 0;
      const total = filtered.length;
      const data = filtered.slice(offset, offset + limit);
      
      return { data, total, limit, offset };
    },
    
    get: async (id: string): Promise<GapAnalysis> => {
      await delay(200);
      const gap = mockGaps.find(g => g.id === id);
      if (!gap) throw new Error('Gap not found');
      return gap;
    },
    
    detect: async (): Promise<{ message: string; gaps_detected: number; gaps: GapAnalysis[] }> => {
      await delay(1000);
      return {
        message: 'Gap detection completed',
        gaps_detected: mockGaps.length,
        gaps: mockGaps,
      };
    },
    
    resolve: async (id: string): Promise<void> => {
      await delay(300);
      const gap = mockGaps.find(g => g.id === id);
      if (gap) {
        gap.resolved_at = new Date().toISOString();
      }
    },
  },
  
  clusters: {
    list: async (): Promise<Cluster[]> => {
      await delay(200);
      return mockClusters;
    },
    
    getTerms: async (clusterName: string): Promise<Term[]> => {
      await delay(300);
      return mockTerms.filter(t => 
        t.contexts?.some(ctx => ctx.cluster === clusterName)
      );
    },
    
    getComparison: async (clusterName: string): Promise<any> => {
      await delay(300);
      return {
        cluster: clusterName,
        terms: mockTerms.filter(t => 
          t.contexts?.some(ctx => ctx.cluster === clusterName)
        ),
        other_clusters: mockClusters.filter(c => c.name !== clusterName).map(c => c.name),
      };
    },
  },
  
  analytics: {
    getGapAnalytics: async (): Promise<GapAnalytics> => {
      await delay(200);
      return mockGapAnalytics;
    },
    
    getClusterCoverage: async (): Promise<ClusterCoverage> => {
      await delay(300);
      return mockClusterCoverage;
    },
  },
  
  termCluster: {
    getComparison: async (termId: string): Promise<Record<string, any[]>> => {
      await delay(300);
      const term = mockTerms.find(t => t.id === termId);
      if (!term || !term.contexts) return {};
      
      const comparison: Record<string, any[]> = {};
      term.contexts.forEach(ctx => {
        if (ctx.cluster) {
          if (!comparison[ctx.cluster]) {
            comparison[ctx.cluster] = [];
          }
          comparison[ctx.cluster].push(ctx);
        }
      });
      
      return comparison;
    },
  },
  
  compliance: {
    getDashboard: async (framework?: string): Promise<any> => {
      await delay(300);
      
      let terms = mockTerms;
      if (framework && framework !== 'All') {
        terms = mockTerms.filter(t => 
          t.compliance_frameworks?.includes(framework)
        );
      } else {
        terms = mockTerms.filter(t => 
          t.compliance_frameworks && t.compliance_frameworks.length > 0
        );
      }
      
      const totalTerms = terms.length;
      const termsWithComplianceContext = terms.filter(t => 
        t.contexts?.some(ctx => ctx.compliance_required === true)
      ).length;
      
      const clusters = new Set<string>();
      terms.forEach(t => {
        t.contexts?.forEach(ctx => {
          if (ctx.cluster && ctx.compliance_required) {
            clusters.add(ctx.cluster);
          }
        });
      });
      
      const coveragePercent = totalTerms > 0 
        ? (termsWithComplianceContext / totalTerms) * 100 
        : 0;
      
      return {
        total_terms: totalTerms,
        terms_with_compliance_context: termsWithComplianceContext,
        clusters_covered: clusters.size,
        coverage_percent: coveragePercent,
      };
    },
    
    getTerms: async (framework: string): Promise<{ data: Term[]; total: number }> => {
      await delay(300);
      const terms = mockTerms.filter(t => 
        t.compliance_frameworks?.includes(framework)
      );
      return { data: terms, total: terms.length };
    },
    
    getGaps: async (framework?: string): Promise<{ data: GapAnalysis[]; total: number }> => {
      await delay(300);
      let gaps = mockGaps.filter(g => !g.resolved_at);
      
      if (framework && framework !== 'All') {
        // Filter gaps for terms with this compliance framework
        const termIds = mockTerms
          .filter(t => t.compliance_frameworks?.includes(framework))
          .map(t => t.id);
        gaps = gaps.filter(g => termIds.includes(g.term_id));
      } else {
        // Filter gaps for any compliance-related terms
        const termIds = mockTerms
          .filter(t => t.compliance_frameworks && t.compliance_frameworks.length > 0)
          .map(t => t.id);
        gaps = gaps.filter(g => termIds.includes(g.term_id));
      }
      
      return { data: gaps, total: gaps.length };
    },
  },
  
  accessRequests: {
    list: async (): Promise<PaginatedResponse<AccessRequest>> => {
      await delay(300);
      return { data: mockAccessRequests, total: mockAccessRequests.length, limit: 20, offset: 0 };
    },
    
    get: async (id: string): Promise<AccessRequest> => {
      await delay(200);
      const request = mockAccessRequests.find(r => r.id === id);
      if (!request) throw new Error('Access request not found');
      return request;
    },
    
    create: async (data: { term_id: string; reason: string }): Promise<AccessRequest> => {
      await delay(400);
      const term = mockTerms.find(t => t.id === data.term_id);
      const newRequest: AccessRequest = {
        id: `ar${mockAccessRequests.length + 1}`,
        term_id: data.term_id,
        term_name: term?.term,
        requested_by: 'current-user',
        requested_by_name: 'John Doe',
        reason: data.reason,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockAccessRequests.unshift(newRequest);
      return newRequest;
    },
  },
  
  onboarding: {
    getProgress: async (): Promise<any> => {
      await delay(200);
      return mockOnboardingProgress;
    },
    
    getPath: async (params: { role: string; cluster?: string }): Promise<{ term_ids: string[] }> => {
      await delay(300);
      
      // Return different term IDs based on role
      let termIds: string[] = [];
      
      if (params.role === 'viewer') {
        // Essential terms for viewers (first 5 terms)
        termIds = mockTerms.slice(0, 5).map(t => t.id);
      } else if (params.role === 'editor') {
        // More terms for editors (first 10 terms)
        termIds = mockTerms.slice(0, 10).map(t => t.id);
      } else if (params.role === 'admin') {
        // All terms for admins (first 15 terms)
        termIds = mockTerms.slice(0, 15).map(t => t.id);
      }
      
      // Filter by cluster if provided
      if (params.cluster) {
        const clusterTerms = mockTerms.filter(t => 
          t.contexts?.some(ctx => ctx.cluster === params.cluster)
        );
        termIds = clusterTerms.slice(0, 10).map(t => t.id);
      }
      
      return { term_ids: termIds };
    },
    
    complete: async (): Promise<void> => {
      await delay(300);
      mockOnboardingProgress.onboarding_completed = true;
      mockOnboardingProgress.progress_percent = 100;
      mockOnboardingProgress.viewed_count = mockOnboardingProgress.total_count;
    },
  },
  
  notifications: {
    list: async (): Promise<Notification[]> => {
      await delay(200);
      // Filter notifications for current user (in real app, this would be server-side)
      return mockNotifications.filter(n => n.user_id === 'current-user');
    },
    
    markAsRead: async (id: string): Promise<Notification> => {
      await delay(200);
      const notification = mockNotifications.find(n => n.id === id);
      if (!notification) throw new Error('Notification not found');
      notification.read = true;
      return notification;
    },
    
    markAllAsRead: async (): Promise<void> => {
      await delay(200);
      mockNotifications.forEach(n => {
        if (n.user_id === 'current-user') {
          n.read = true;
        }
      });
    },
  },
  
  versions: {
    list: async (termId: string): Promise<TermVersion[]> => {
      await delay(300);
      return mockTermVersions.filter(v => v.term_id === termId).sort((a, b) => b.version_number - a.version_number);
    },
    
    get: async (versionId: string): Promise<TermVersion> => {
      await delay(200);
      const version = mockTermVersions.find(v => v.id === versionId);
      if (!version) throw new Error('Version not found');
      return version;
    },
    
    compare: async (version1Id: string, version2Id: string): Promise<VersionComparison> => {
      await delay(300);
      const version1 = mockTermVersions.find(v => v.id === version1Id);
      const version2 = mockTermVersions.find(v => v.id === version2Id);
      
      if (!version1 || !version2) throw new Error('Version not found');
      
      const differences: Record<string, { old: any; new: any }> = {};
      
      // Compare fields
      const fieldsToCompare = ['term', 'base_definition', 'category', 'code_name', 'tags', 'compliance_frameworks'];
      fieldsToCompare.forEach(field => {
        const val1 = version1.term_data[field];
        const val2 = version2.term_data[field];
        
        if (JSON.stringify(val1) !== JSON.stringify(val2)) {
          differences[field] = { old: val1, new: val2 };
        }
      });
      
      return {
        version1,
        version2,
        differences,
      };
    },
    
    rollback: async (termId: string, versionId: string): Promise<Term> => {
      await delay(400);
      const version = mockTermVersions.find(v => v.id === versionId && v.term_id === termId);
      if (!version) throw new Error('Version not found');
      
      // Find the term and update it
      const term = mockTerms.find(t => t.id === termId);
      if (!term) throw new Error('Term not found');
      
      // Update term with version data
      if (version.term_data.term) term.term = version.term_data.term as string;
      if (version.term_data.base_definition) term.base_definition = version.term_data.base_definition as string;
      if (version.term_data.category) term.category = version.term_data.category as string;
      if (version.term_data.code_name) term.code_name = version.term_data.code_name as string;
      if (version.term_data.tags) term.tags = version.term_data.tags as string[];
      if (version.term_data.compliance_frameworks) term.compliance_frameworks = version.term_data.compliance_frameworks as string[];
      
      // Create a new version for the rollback
      const existingVersions = mockTermVersions.filter(v => v.term_id === termId);
      const newVersionNumber = existingVersions.length > 0 
        ? Math.max(...existingVersions.map(v => v.version_number)) + 1 
        : 1;
      const rollbackVersion: TermVersion = {
        id: `v${mockTermVersions.length + 1}`,
        term_id: termId,
        version_number: newVersionNumber,
        term_data: {
          id: term.id,
          term: term.term,
          base_definition: term.base_definition,
          category: term.category,
          code_name: term.code_name,
          tags: term.tags,
          compliance_frameworks: term.compliance_frameworks,
        },
        changed_by: 'current-user',
        change_reason: `Rollback to version ${version.version_number}`,
        created_at: new Date().toISOString(),
      };
      mockTermVersions.unshift(rollbackVersion);
      
      return term;
    },
  },
};

