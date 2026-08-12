import { Link } from 'react-router-dom';

interface ProjectItem {
  id: string;
  title: string;
  department: string;
  status: 'Deployed' | 'Incubated' | 'In Development' | 'Funded';
  statusColor: string;
  summary: string;
  techStack: string[];
  team: string[];
  imageUrl: string;
  articleId?: string;
}

const campusProjects: ProjectItem[] = [
  {
    id: '1',
    title: 'GECT Electric Racing Car',
    department: 'Electrical & Mechanical Engg.',
    status: 'Funded',
    statusColor: 'bg-tertiary text-on-tertiary',
    summary: 'An all-electric Formula Student race car engineered from scratch in the campus workshop, featuring custom battery management system and carbon fiber chassis.',
    techStack: ['EV Powertrain', 'CAN Bus', 'Telemetry', 'ROS'],
    team: ['Arjun V.', 'Sneha Nair', 'Kiran P.'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
  },
  {
    id: '2',
    title: 'Smart Campus Traffic Grid',
    department: 'Computer Science & Civil Engg.',
    status: 'Deployed',
    statusColor: 'bg-primary text-on-primary',
    summary: 'A computer-vision powered dynamic traffic signals controller that reduces congestion at main campus gates by adjusting green timings based on real-time vehicle density.',
    techStack: ['OpenCV', 'YOLOv8', 'Python', 'Edge AI'],
    team: ['Fahad K.', 'Ritu Mohan', 'Deepak S.'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGMRl1dRUP3Cr1L5leksQUJB_6c_VVlTZv2dO5tLx-fYZZ6gkVzoYboO4xveDoPswMmnl3c8I5P7Zs0FOstO6anVNSlLGGkKjxmSZmMFxT2vM5j55AgK_RV3dHFlZlLa1roL2etkVICbJUdYD2VxeoOv4vXpxWS35HSK9-7X_KMcqfjIKEhG7QdX5Xw-ulKANh_szfaD9A7hlUqSc2kXDv4gkcJDrEhKUwLLjbUkk4VLMdGa4yKJ7vHA',
  },
  {
    id: '3',
    title: 'PresentIQ Attendance Platform',
    department: 'Computer Science',
    status: 'Incubated',
    statusColor: 'bg-secondary text-on-secondary',
    summary: 'QR-based automated attendance tracking SaaS system built by GECT students, now adopted by 12 colleges across Kerala after raising ₹50 Lakh seed funding.',
    techStack: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    team: ['Ananya R.', 'Siddharth M.', 'Fahad K.'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
    articleId: '4',
  },
  {
    id: '4',
    title: 'BreatheEasy IoT Air Quality Sensor Network',
    department: 'Electronics & Communication Engg.',
    status: 'Deployed',
    statusColor: 'bg-primary text-on-primary',
    summary: 'Low-cost distributed IoT environmental sensor network monitoring PM2.5 and CO2 across campus blocks in real-time, winning national awards.',
    techStack: ['ESP32', 'MQTT', 'Grafana', 'InfluxDB'],
    team: ['Gautam P.', 'Nivedita S.', 'Anoop T.'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGMRl1dRUP3Cr1L5leksQUJB_6c_VVlTZv2dO5tLx-fYZZ6gkVzoYboO4xveDoPswMmnl3c8I5P7Zs0FOstO6anVNSlLGGkKjxmSZmMFxT2vM5j55AgK_RV3dHFlZlLa1roL2etkVICbJUdYD2VxeoOv4vXpxWS35HSK9-7X_KMcqfjIKEhG7QdX5Xw-ulKANh_szfaD9A7hlUqSc2kXDv4gkcJDrEhKUwLLjbUkk4VLMdGa4yKJ7vHA',
    articleId: '8',
  },
  {
    id: '5',
    title: 'Micro-Manufacturing Robotic Arms',
    department: 'Mechanical Engineering',
    status: 'In Development',
    statusColor: 'bg-surface-container-high text-on-surface',
    summary: 'Industrial ROS-integrated robotic arm automation system trained for autonomous PCB soldering and component quality inspection.',
    techStack: ['ROS2', 'Computer Vision', 'SolidWorks', 'C++'],
    team: ['Rahul K.', 'Devika B.'],
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
    articleId: '5',
  },
];

export default function Projects() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-12">
      {/* Header */}
      <div className="border-b-4 border-on-surface pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <span className="bg-tertiary text-on-tertiary px-4 py-1.5 rounded-full text-label-bold font-label-bold uppercase text-xs mb-4 inline-block">
            Student Labs & R&D
          </span>
          <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface uppercase leading-none">
            Projects Showcase
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mt-4">
            Explore cutting-edge hardware prototypes, SaaS applications, and IoT systems built by student innovators at Govt. Engineering College Thrissur.
          </p>
        </div>
        <Link
          to="/"
          className="bg-primary text-on-primary px-8 py-4 rounded-full text-label-bold font-label-bold uppercase border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] transition-all shrink-0"
        >
          Submit Your Project
        </Link>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {campusProjects.map((project) => (
          <div
            key={project.id}
            className="bg-surface rounded-2xl border-4 border-on-surface shadow-[8px_8px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-2 hover:-translate-x-2 hover:shadow-[16px_16px_0px_0px_rgba(28,27,27,1)] transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="w-full aspect-[16/9] bg-primary border-b-4 border-on-surface overflow-hidden relative">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover mix-blend-luminosity opacity-90" />
                <span className={`absolute top-4 right-4 ${project.statusColor} px-4 py-1.5 rounded-full text-label-bold font-label-bold uppercase text-xs border-2 border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]`}>
                  {project.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-8 flex flex-col gap-6">
                <div>
                  <div className="text-label-bold font-label-bold uppercase text-xs text-secondary mb-2">{project.department}</div>
                  <h3 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight">{project.title}</h3>
                </div>

                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  {project.summary}
                </p>

                {/* Tech Stack Pills */}
                <div>
                  <span className="text-xs font-label-bold text-secondary uppercase block mb-2">Technologies Used</span>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-xs font-label-bold border border-on-surface/40">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-8 pt-0 border-t border-on-surface/10 mt-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-label-bold text-secondary uppercase block">Team</span>
                <span className="text-sm font-label-bold text-on-surface">{project.team.join(', ')}</span>
              </div>
              {project.articleId && (
                <Link
                  to={`/article/${project.articleId}`}
                  className="text-xs font-label-bold uppercase text-primary hover:underline flex items-center gap-1"
                >
                  Read Story <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
