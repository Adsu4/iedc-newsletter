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
    title: 'KSUM Idea Grant 2026 (Call for Innovators)',
    provider: 'Kerala Startup Mission (KSUM)',
    category: 'KSUM Grant',
    categoryColor: 'bg-primary text-on-primary',
    grantAmount: 'Up to ₹3,00,000 Grant',
    deadline: 'Sept 30, 2026',
    eligibility: 'Student innovators / early-stage teams with novel hardware or software concepts',
    description: 'Direct grant-in-aid from Govt. of Kerala for students to convert innovative research and project ideas into validated proof-of-concepts.',
    applyUrl: 'https://startupmission.kerala.gov.in/schemes/idea-grant',
    featured: true,
  },
  {
    id: 'op-2',
    title: 'NIDHI-PRAYAS Hardware Prototype Grant 2026',
    provider: 'Dept. of Science & Technology (DST, Govt. of India)',
    category: 'Government Scheme',
    categoryColor: 'bg-tertiary text-on-tertiary',
    grantAmount: 'Up to ₹10,00,000 Grant',
    deadline: 'Oct 15, 2026',
    eligibility: 'Hardware, IoT, Robotics, and Clean-Tech engineering student teams',
    description: 'Support for fabrication, components, 3D modeling, and testing to bridge the gap between idea and market-ready physical prototype.',
    applyUrl: 'https://www.nidhi-prayas.org/',
    featured: true,
  },
  {
    id: 'op-3',
    title: 'YIP 6.0 (Young Innovators Programme 2026)',
    provider: 'K-DISC, Govt. of Kerala',
    category: 'Government Scheme',
    categoryColor: 'bg-secondary text-on-secondary',
    grantAmount: '₹50,000 to ₹5,00,000',
    deadline: 'Sept 20, 2026',
    eligibility: 'Interdisciplinary teams solving societal/rural challenges in Kerala',
    description: 'Multi-stage mentorship and funding program empowering youth to address real-world community issues with sustainable tech solutions.',
    applyUrl: 'https://yip.kerala.gov.in/',
  },
  {
    id: 'op-4',
    title: 'Smart India Hackathon (SIH 2026) — Campus Track',
    provider: 'Ministry of Education & AICTE',
    category: 'Hackathon',
    categoryColor: 'bg-primary text-on-primary',
    grantAmount: '₹1,00,000 per Problem Statement',
    deadline: 'Sept 10, 2026',
    eligibility: '6-member engineering teams (at least one female member required)',
    description: 'Nationwide initiative providing students a platform to solve pressing problems of ministries, departments, and leading industries.',
    applyUrl: 'https://sih.gov.in/',
  },
  {
    id: 'op-5',
    title: 'KSUM Scaleup Loan & Seed Fund Support',
    provider: 'Kerala Startup Mission',
    category: 'Incubation',
    categoryColor: 'bg-surface-container-high text-on-surface',
    grantAmount: 'Up to ₹15,00,000 Soft Loan',
    deadline: 'Open Year-Round 2026',
    eligibility: 'Registered DPIIT/KSUM startups with early revenue or customer traction',
    description: 'Low-interest soft loan scheme aimed at early-stage startups to accelerate product development, pilot trials, and market expansion.',
    applyUrl: 'https://startupmission.kerala.gov.in/',
  },
  {
    id: 'op-6',
    title: 'Maker Village Electronics Pre-Incubation Call',
    provider: 'Maker Village & MeitY',
    category: 'Open Call',
    categoryColor: 'bg-secondary text-on-secondary',
    grantAmount: 'Lab Access & ₹2.5L Prototype Support',
    deadline: 'Oct 05, 2026',
    eligibility: 'Innovators working on Embedded Systems, Drones, Biotech, and IoT',
    description: 'Access to India’s largest electronic hardware incubator with world-class SMT manufacturing and testing equipment.',
    applyUrl: 'https://makervillage.in/',
  },
];

export const startupSpotlights: StartupSpotlight[] = [
  {
    id: 'sp-1',
    name: 'PresentIQ',
    tagline: 'AI-Powered Campus Attendance & Analytics Platform',
    founder: 'Ananya R. & Siddharth M.',
    founderBatch: 'GECT CSE 2026',
    sector: 'EdTech / SaaS',
    stage: 'Seed Funded',
    stageColor: 'bg-secondary text-on-secondary',
    highlightMetric: '15 Colleges • ₹50L Pre-Seed',
    description: 'Born out of a final-year hostel room project at GECT, PresentIQ has revolutionized classroom management across South India with instant QR verification and automated KTU attendance synchronization.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
    articleId: '4',
  },
  {
    id: 'sp-2',
    name: 'GECT Electric Racing',
    tagline: 'High-Performance Formula Student Electric Powertrain',
    founder: 'Arjun V. & Team',
    founderBatch: 'GECT ME & EEE 2027',
    sector: 'Clean Mobility & EV',
    stage: 'Incubated',
    stageColor: 'bg-tertiary text-on-tertiary',
    highlightMetric: '0-100 km/h in 3.6s • Custom BMS',
    description: 'An engineering marvel designed in the campus workshop featuring custom lithium-ion thermal management, regenerative braking CAN-bus controllers, and aerodynamic carbon fiber aero-foils.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGMRl1dRUP3Cr1L5leksQUJB_6c_VVlTZv2dO5tLx-fYZZ6gkVzoYboO4xveDoPswMmnl3c8I5P7Zs0FOstO6anVNSlLGGkKjxmSZmMFxT2vM5j55AgK_RV3dHFlZlLa1roL2etkVICbJUdYD2VxeoOv4vXpxWS35HSK9-7X_KMcqfjIKEhG7QdX5Xw-ulKANh_szfaD9A7hlUqSc2kXDv4gkcJDrEhKUwLLjbUkk4VLMdGa4yKJ7vHA',
  },
  {
    id: 'sp-3',
    name: 'BreatheEasy Sensor Grid',
    tagline: 'Hyper-Local Campus Environmental & AQI Intelligence',
    founder: 'Gautam P. & Nivedita S.',
    founderBatch: 'GECT ECE 2026',
    sector: 'IoT & Climate Tech',
    stage: 'Prototype',
    stageColor: 'bg-primary text-on-primary',
    highlightMetric: 'National Award Winner • ESP32 Grid',
    description: 'Distributed network of real-time air quality nodes measuring PM2.5, volatile organic gases, and humidity to automate HVAC ventilation and campus climate safety alerts.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
    articleId: '8',
  },
];

export const monthMoments: MonthMoment[] = [
  {
    id: 'mm-1',
    title: 'Cloud & AI Hands-On Sprint',
    caption: 'Over 80 students deploying serverless microservices at the Central Computing Facility.',
    date: 'Aug 12, 2026',
    location: 'CCF Lab 2, GECT',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGMRl1dRUP3Cr1L5leksQUJB_6c_VVlTZv2dO5tLx-fYZZ6gkVzoYboO4xveDoPswMmnl3c8I5P7Zs0FOstO6anVNSlLGGkKjxmSZmMFxT2vM5j55AgK_RV3dHFlZlLa1roL2etkVICbJUdYD2VxeoOv4vXpxWS35HSK9-7X_KMcqfjIKEhG7QdX5Xw-ulKANh_szfaD9A7hlUqSc2kXDv4gkcJDrEhKUwLLjbUkk4VLMdGa4yKJ7vHA',
    tag: 'Workshop',
  },
  {
    id: 'mm-2',
    title: 'EV Chassis Weld & Fitment',
    caption: 'GECT Racing team verifying tubular spaceframe alignment in the fabrication bay.',
    date: 'Aug 16, 2026',
    location: 'Mechanical Workshop',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
    tag: 'R&D',
  },
  {
    id: 'mm-3',
    title: 'Idea Pitch & Critique Night',
    caption: 'Student teams pitching hardware innovations before the faculty & KSUM advisory panel.',
    date: 'Aug 20, 2026',
    location: 'Seminar Hall, Main Block',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGMRl1dRUP3Cr1L5leksQUJB_6c_VVlTZv2dO5tLx-fYZZ6gkVzoYboO4xveDoPswMmnl3c8I5P7Zs0FOstO6anVNSlLGGkKjxmSZmMFxT2vM5j55AgK_RV3dHFlZlLa1roL2etkVICbJUdYD2VxeoOv4vXpxWS35HSK9-7X_KMcqfjIKEhG7QdX5Xw-ulKANh_szfaD9A7hlUqSc2kXDv4gkcJDrEhKUwLLjbUkk4VLMdGa4yKJ7vHA',
    tag: 'Pitching',
  },
  {
    id: 'mm-4',
    title: 'Robotics & ROS2 Automation Lab',
    caption: 'Student engineers tuning autonomous robotic arm trajectories for SMD component sorting.',
    date: 'Aug 24, 2026',
    location: 'Mechatronics Lab',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
    tag: 'Lab Session',
  },
];
