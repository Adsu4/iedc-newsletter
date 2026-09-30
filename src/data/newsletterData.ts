export interface MonthlyStats {
  eventsConducted: number;
  participants: string;
  workshops: number;
  industryCollabs: number;
  newInitiatives: number;
  studentProjects: string;
  totalGrantsMobilized: string;
}

export interface UpcomingEvent {
  id: string;
  title: string;
  category: 'Workshop' | 'Hackathon' | 'Bootcamp' | 'Demo Day' | 'Competition';
  badgeColor: string;
  date: string;
  time: string;
  venue: string;
  deadline: string;
  description: string;
  eligibility: string;
  registrationUrl: string;
  qrCodeUrl: string;
  isFeatured?: boolean;
}

export interface Opportunity {
  id: string;
  title: string;
  provider: string;
  category: 'KSUM Grant' | 'Government Scheme' | 'Incubation' | 'Hackathon' | 'Open Call';
  categoryColor: string;
  grantAmount?: string;
  deadline: string;
  eligibility: string;
  description: string;
  applyUrl: string;
  featured?: boolean;
}

export interface StartupSpotlight {
  id: string;
  name: string;
  tagline: string;
  founder: string;
  founderBatch: string;
  sector: string;
  stage: 'Incubated' | 'Seed Funded' | 'Prototype' | 'Scaled';
  stageColor: string;
  highlightMetric: string;
  description: string;
  imageUrl: string;
  articleId?: string;
}

export interface MonthMoment {
  id: string;
  title: string;
  caption: string;
  date: string;
  location: string;
  imageUrl: string;
  tag: string;
}

export interface NewsletterEditionInfo {
  edition: string;
  monthYear: string;
  theme: string;
  summary: string;
}

const currentDefaultMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export const currentEditionInfo: NewsletterEditionInfo = {
  edition: 'Vol. 32',
  monthYear: currentDefaultMonthYear,
  theme: 'Autonomous Systems & Deeptech Prototyping',
  summary: 'Celebrating a record-breaking month of hands-on innovation: major events, national hackathon triumphs, and expanding the frontier of student entrepreneurship at GECT.',
};

export const monthlyStats: MonthlyStats = {
  eventsConducted: 4,
  participants: '180+',
  workshops: 3,
  industryCollabs: 3,
  newInitiatives: 5,
  studentProjects: '12+',
  totalGrantsMobilized: '₹22 Lakhs',
};

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: 'ev-1',
    title: 'HackGECT 2026: 36-Hour National Hackathon',
    category: 'Hackathon',
    badgeColor: 'bg-primary text-on-primary',
    date: 'Sept 18 - 19, 2026',
    time: '09:00 AM onwards',
    venue: 'Main Auditorium & CCF, GECT',
    deadline: 'Sept 12, 2026',
    description: 'Our flagship 36-hour national hackathon focused on Sustainable Smart Cities, AI-driven healthcare, and Clean Energy with ₹75,000 cash prizes and incubation slots.',
    eligibility: 'All Engineering & Polytechnic Students (Teams of 2 - 4)',
    registrationUrl: 'https://iedc.gect.ac.in/hackgect',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://iedc.gect.ac.in/hackgect',
    isFeatured: true,
  },
  {
    id: 'ev-2',
    title: 'AI Founders & Autonomous Agents Bootcamp',
    category: 'Bootcamp',
    badgeColor: 'bg-tertiary text-on-tertiary',
    date: 'Sept 4, 2026',
    time: '02:00 PM - 05:30 PM',
    venue: 'New AI Lab, IT Block, GECT',
    deadline: 'Aug 31, 2026',
    description: 'Hands-on masterclass on building and deploying production-ready multimodal AI agents, autonomous workflow orchestration, and pricing AI SaaS products.',
    eligibility: 'Open to 2nd, 3rd, and 4th-year GECT students',
    registrationUrl: 'https://iedc.gect.ac.in/ai-bootcamp',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://iedc.gect.ac.in/ai-bootcamp',
  },
  {
    id: 'ev-3',
    title: 'Hardware Prototyping & PCB Design Sprint',
    category: 'Workshop',
    badgeColor: 'bg-secondary text-on-secondary',
    date: 'Sept 25, 2026',
    time: '10:00 AM - 04:00 PM',
    venue: 'FabLab & Mechanical Workshop',
    deadline: 'Sept 20, 2026',
    description: 'Learn rapid SMD soldering, multi-layer KiCAD schematic design, and high-precision 3D printing enclosure prototyping for IoT hardware products.',
    eligibility: 'ECE, EEE & ME students with hardware project ideas',
    registrationUrl: 'https://iedc.gect.ac.in/pcb-sprint',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://iedc.gect.ac.in/pcb-sprint',
  },
  {
    id: 'ev-4',
    title: 'IEDC Demo Day & Venture Critique Round',
    category: 'Demo Day',
    badgeColor: 'bg-surface-container-high text-on-surface',
    date: 'Oct 10, 2026',
    time: '01:30 PM - 05:00 PM',
    venue: 'Seminar Hall, Main Block',
    deadline: 'Oct 02, 2026',
    description: 'Pitch your campus startup or final-year innovative project to a panel of alumni angel investors, KSUM mentors, and early-stage venture evaluators.',
    eligibility: 'Student innovators & pre-incubation teams with functioning prototypes',
    registrationUrl: 'https://iedc.gect.ac.in/demo-day',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://iedc.gect.ac.in/demo-day',
  },
];

export const opportunitiesList: Opportunity[] = [
  {
    id: 'op-1',
    title: 'KSUM Idea Grant Scheme',
    provider: 'Kerala Startup Mission (KSUM)',
    category: 'KSUM Grant',
    categoryColor: 'bg-primary text-on-primary',
    grantAmount: 'Up to ₹3,00,000 (₹2L for Students)',
    deadline: 'Rolling / Periodic Idea Day Calls',
    eligibility: 'Student innovators (up to ₹2L) & early-stage innovators/startups (up to ₹3L) in Kerala',
    description: 'Direct prototype funding from Govt. of Kerala to convert novel technology concepts into validated MVPs through regular Idea Day pitch cohorts.',
    applyUrl: 'https://startupmission.kerala.gov.in/schemes/idea-grant',
    featured: true,
  },
  {
    id: 'op-2',
    title: 'DST NIDHI-PRAYAS 2.0 (Hardware Prototyping Grant)',
    provider: 'Dept. of Science & Technology (DST, Govt. of India)',
    category: 'Government Scheme',
    categoryColor: 'bg-tertiary text-on-tertiary',
    grantAmount: 'Up to ₹10,00,000 Prototype Support',
    deadline: 'Announced by PRAYAS Centres / TBIs',
    eligibility: 'Hardware, IoT, Robotics, ESDM, and Clean-Tech engineering student innovators',
    description: 'Non-dilutive grant support under PRAYAS 2.0 for physical fabrication, component procurement, and lab testing through accredited PRAYAS TBIs.',
    applyUrl: 'https://www.nidhi-prayas.org/',
    featured: true,
  },
  {
    id: 'op-3',
    title: 'Young Innovators Programme (YIP 9.0)',
    provider: 'K-DISC, Govt. of Kerala',
    category: 'Government Scheme',
    categoryColor: 'bg-secondary text-on-secondary',
    grantAmount: 'District Prizes & State Incubation Support',
    deadline: 'Cohort-Based (Check YIP Portal)',
    eligibility: 'College, university, and youth innovator teams across Kerala',
    description: 'Flagship statewide challenge by K-DISC fostering design thinking, grassroots problem-solving, and pre-seed validation for real-world issues.',
    applyUrl: 'https://yip.kerala.gov.in/',
  },
  {
    id: 'op-4',
    title: 'Smart India Hackathon (SIH) — College Track',
    provider: 'Ministry of Education Innovation Cell & AICTE',
    category: 'Hackathon',
    categoryColor: 'bg-primary text-on-primary',
    grantAmount: '₹1,00,000 per Problem Statement',
    deadline: 'Internal College Hackathon Schedule',
    eligibility: '6-member multidisciplinary student teams (mandatory at least 1 female teammate)',
    description: 'Nationwide crowdsourcing challenge tackling problem statements from ministries and PSUs, with initial campus screening via internal college hackathons.',
    applyUrl: 'https://sih.gov.in/',
  },
  {
    id: 'op-5',
    title: 'KSUM Seed Support Scheme (Soft Loan Assistance)',
    provider: 'Kerala Startup Mission (KSUM)',
    category: 'Incubation',
    categoryColor: 'bg-surface-container-high text-on-surface',
    grantAmount: 'Up to ₹15,00,000 Soft Loan (6% Interest)',
    deadline: 'Rolling / Open Year-Round',
    eligibility: 'Kerala-registered startups (Pvt Ltd / LLP) with KSUM Unique ID & market traction',
    description: 'Subsidized soft loan financing at 6% interest to assist early-stage innovative enterprises in scaling operations and bridging working capital without equity dilution.',
    applyUrl: 'https://startupmission.kerala.gov.in/',
  },
  {
    id: 'op-6',
    title: 'Maker Village Hardware & ESDM Incubation',
    provider: 'Maker Village & MeitY',
    category: 'Open Call',
    categoryColor: 'bg-secondary text-on-secondary',
    grantAmount: 'In-Kind SMT Lab Access & Incubation',
    deadline: 'Rolling / Batch Admissions',
    eligibility: 'Hardware, ESDM, Robotics, Drones, IoT, and embedded system startups',
    description: 'Subsidized access to India’s largest electronics hardware incubator with world-class SMT assembly, 3D printing labs, testing chambers, and mentorship.',
    applyUrl: 'https://makervillage.in/',
  },
];

export const startupSpotlights: StartupSpotlight[] = [];


export const monthMoments: MonthMoment[] = [];

