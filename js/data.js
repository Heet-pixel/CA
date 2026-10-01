// All website text lives here. Edit this file to change content.
export const brand = {
  name: 'AVKAS & Co.',
  short: 'AVKAS',
  tagline: 'Chartered Accountants',
  email: '',                   // shown in the footer and on the Get in Touch page when filled
  phone: '',
  address: '',
};

export const about = {
  subtitle: 'Our team of experts combines deep technical knowledge with creative thinking.',
  heading: 'Driven by passion',
  subheading: 'Client Centric Approach',
  intro: 'We are future-ready advisors, strategic finance partners and trusted governance stewards. Combining technical rigour, legal insight and modern technology, we turn data into investor-grade forecasts and decision tools while embedding practical controls and governance that protect value and accelerate growth.',
  paragraphs: [
    'Embracing challenges and driving innovation is what we do best and our expertise lies in but is not limited to Auditing and Assurances, Taxation Advisory, Corporate Insolvency Resolution, Forensic Audits, Valuations, Company law, Intellectual Property Rights, RERA, Project Finance, Risk Management and MIS Reporting',
    'With an aim to deliver nothing but excellence to our clients, we have blended our years of technical expertise with premiere creativity and responsiveness to drive client service and fuel customer satisfaction. We are a multidisciplinary organization focused on creating long term partnerships with our clients so that we can transform our services into value-worthy experiences for our clientele.',
  ],
};

export const achievements = {
  kicker: 'Our Achievements',
  heading: 'Building the future.',
  text: 'Discover the success stories from our clients who have benefited from our cutting-edge AI solutions.',
  stories: [
    { title: 'The Midnight Mystery: An FP&A Cartoon Story', image: '/images/stories/midnight-mystery.jpg' },
    { title: 'The ₹60 Lakh Fuel Fraud: An FP&A Cartoon Story', image: '/images/stories/fuel-fraud.jpg' },
  ],
};

// role / bio / expertise are optional: they are shown in the details window only when filled.
export const partners = [
  { name: 'CA Vaibhav Shah', role: 'Managing Partner', quals: 'DISA (ICAI), Social Auditor (ISAI), LLB, B.Com', photo: '/images/team/vaibhav-shah.jpg', expertise: '', bio: '' },
  { name: 'CA Akash Patel', role: 'Partner', quals: 'B.Com, ISA (ICAI), ACA', photo: '/images/team/akash-patel.jpg', expertise: '', bio: '' },
  { name: 'CA Alnoor Bardai', role: 'Partner', quals: 'B.Com, ACA', photo: '/images/team/alnoor-bardai.jpg', expertise: '', bio: '' },
  { name: 'CA Akshat Shah', role: 'Partner', quals: 'B.Com, M.Com, Social Auditor (ISAI), ACA (ICAI) DISA', photo: '/images/team/akshat-shah.jpg', expertise: '', bio: '' },
];

export const experts = [
  { name: 'CA Devansh Shah', role: '', quals: 'FCA | DISA | M.Com | B.Com', photo: '/images/team/devansh-shah.jpg', expertise: 'Financial Planning & Analysis | Strategy & Automation Expert', bio: '' },
  { name: 'CA Jay Mehta', role: '', quals: 'CA | CS (All India Rank 3)', photo: '/images/team/jay-mehta.jpg', expertise: '', bio: '' },
  { name: 'Jitendra Mevada', role: '', quals: 'Strategic Finance | Valuation & Virtual CFO Expert (CA, CS – All India Rank 3)', photo: '/images/team/jitendra-mevada.jpg', expertise: '', bio: '' },
];

export const services = [
  ['auditing-and-assurance', 'Auditing and Assurance', 'Statutory, internal and other audit engagements that give stakeholders confidence in your numbers.'],
  ['bank-audit-government-audit', 'Bank Audit & Government Audit', 'Audits of bank branches and government bodies carried out to the required standards.'],
  ['billing-administrative-work', 'Billing & Administrative Work', 'Invoicing, record keeping and back-office support so your team can focus on the business.'],
  ['business-asset-valuation', 'Business & Asset Valuation Services', 'Independent valuations of businesses, shares and assets for deals, funding and reporting.'],
  ['corporate-law-governance', 'Corporate Law & Governance Compliance', 'Company law filings, board and shareholder compliance, and governance support.'],
  ['due-diligence', 'Due Diligence', 'Financial, tax and compliance reviews before you buy, invest or partner.'],
  ['risk-performance-intelligence', 'Enterprise Risk Management & Performance Intelligence', 'Identify risks, set controls and track performance with reports that support decisions.'],
  ['finance-transformation-ai', 'Finance Transformation & AI Integration', 'Modernise finance processes with automation and AI-based tools.'],
  ['financial-planning-analysis', 'Financial Planning & Analysis', 'Budgets, forecasts and variance analysis that guide your planning.'],
  ['forensic-audit-dispute', 'Forensic Audit & Dispute Advisory', 'Investigation of irregularities and financial support in disputes.'],
  ['government-incentives-subsidy', 'Government Incentives & Subsidy Advisory', 'Find and apply for the government schemes, incentives and subsidies your business qualifies for.'],
  ['accounting-financial-reporting', 'Integrated Business Accounting & Financial Reporting', 'Bookkeeping plus accurate, timely financial statements and MIS reports.'],
  ['project-finance-infrastructure', 'Project Finance & Infrastructure Advisory', 'Financial models, funding structures and lender documentation for projects.'],
  ['registration-certification-compliance', 'Registration, Certification & Compliance', 'Business registrations, certifications and ongoing regulatory compliance.'],
  ['startup-advisory', 'Startup Advisory', 'Structuring, compliance and financial planning for new ventures.'],
  ['strategic-tax-regulatory', 'Strategic Tax & Regulatory Advisory', 'Tax planning and regulatory guidance aligned with your business goals.'],
  ['trademark-ipr', 'Trademark & Intellectual Property Rights', 'Trademark registration and protection of your intellectual property.'],
  ['virtual-cfo', 'Virtual CFO', 'Senior finance leadership on a flexible basis: reporting, cash flow and strategy.'],
].map(([id, title, blurb]) => ({ id, title, blurb }));

// Add events here: { title: '...', date: '2026-10-15', place: '...', text: '...' }
export const events = [];

export const stats = [
  { value: '5+', label: 'Years of Excellence', icon: 'users' },
  { value: '100+', label: 'Happy Clients', icon: 'briefcase' },
  { value: '10+', label: 'Expert Professionals', icon: 'chart' },
  { value: '25+', label: 'Industries Served', icon: 'trophy' },
];

export const values = [
  { title: 'Client First', text: 'Your goals are our priority.', icon: 'target' },
  { title: 'Practical Solutions', text: 'Real-world advice that works.', icon: 'chart' },
  { title: 'Integrity', text: 'Built on trust and transparency.', icon: 'shield' },
  { title: 'Forward Thinking', text: 'Innovative solutions for a better tomorrow.', icon: 'bulb' },
];
