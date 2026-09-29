import { useState } from 'react';
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
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('iedc@gectcr.ac.in');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoUrl = "mailto:iedc@gectcr.ac.in?subject=Project%20Submission%20-%20IEDC%20Student%20Labs&body=Hi%20IEDC%20Team%2C%0A%0AI%20would%20like%20to%20submit%20our%20project%20for%20the%20IEDC%20Newsletter%20Showcase.%0A%0AProject%20Title%3A%20%0ADepartment%3A%20%0ATeam%20Members%3A%20%0AProject%20Summary%3A%20%0ATechnologies%20Used%3A%20%0AGitHub%20%2F%20Demo%20Link%3A%20%0AContact%20Phone%3A%20%0A%0AThank%20you!";

  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-14 flex flex-col gap-8 md:gap-10">
      {/* Header */}
      <div className="border-b-2 border-on-surface pb-5 flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div>
          <span className="bg-tertiary text-on-tertiary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px] mb-2 inline-block">
            Student Labs & R&D
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl uppercase text-on-surface leading-tight">
            Projects Showcase
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant max-w-2xl mt-2 leading-relaxed">
            Explore cutting-edge hardware prototypes, SaaS applications, and IoT systems built by student innovators at Govt. Engineering College Thrissur.
          </p>
        </div>
        <a
          href={mailtoUrl}
          className="bg-primary text-on-primary px-5 py-2.5 rounded-full text-label-bold font-label-bold uppercase text-xs border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] transition-all shrink-0 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">mail</span>
          <span>Submit Your Project</span>
        </a>
      </div>

      {/* Submission Guidance Callout Banner */}
      <div className="bg-surface-container-high rounded-xl border-2 border-on-surface p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div className="flex flex-col gap-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-medium text-secondary">
            <span className="bg-secondary text-on-secondary px-2.5 py-0.5 rounded-full text-[10px] font-label-bold uppercase">Call for Submissions</span>
            <span>• Open for all departments</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold font-sans text-on-surface leading-tight">
            How to Submit Your Project
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Built an innovative hardware prototype, software application, or research model? Student projects can be submitted directly by emailing our official IEDC address at{' '}
            <strong className="text-on-surface font-semibold underline">iedc@gectcr.ac.in</strong> with your project title, team members, tech stack, and GitHub or demo links.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <a
            href={mailtoUrl}
            className="bg-on-surface text-surface px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary hover:text-on-primary transition-colors border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial"
          >
            <span className="material-symbols-outlined text-[15px]">send</span>
            <span>Send to iedc@gectcr.ac.in</span>
          </a>
          <button
            onClick={handleCopyEmail}
            className="bg-surface text-on-surface px-4 py-2 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-surface-container transition-colors border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)] flex items-center justify-center gap-1.5 whitespace-nowrap flex-1 sm:flex-initial"
          >
            <span className="material-symbols-outlined text-[15px]">{copied ? 'check' : 'content_copy'}</span>
            <span>{copied ? 'Copied!' : 'Copy Email'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {campusProjects.map((project) => (
          <div
            key={project.id}
            className="bg-surface rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] hover:-translate-y-1 hover:shadow-[5px_5px_0px_0px_rgba(28,27,27,1)] transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Image Banner */}
              <div className="w-full aspect-[16/9] bg-surface-container-high border-b-2 border-on-surface overflow-hidden relative">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover img-editorial" />
                <span className={`absolute top-3 right-3 ${project.statusColor} px-3 py-1 rounded-full text-label-bold font-label-bold uppercase text-[10px] border border-on-surface shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]`}>
                  {project.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <div className="text-xs font-medium text-secondary mb-1">{project.department}</div>
                  <h3 className="text-lg sm:text-xl font-bold font-sans text-on-surface leading-snug">{project.title}</h3>
                </div>

                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {project.summary}
                </p>

                {/* Tech Stack Pills */}
                <div>
                  <span className="text-[11px] font-medium text-secondary block mb-1.5">Technologies Used</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span key={tech} className="bg-surface-container-high text-on-surface px-2.5 py-0.5 rounded-full text-[11px] font-medium border border-on-surface/30">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="p-5 sm:p-6 pt-0 border-t border-on-surface/10 mt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-label-bold uppercase text-secondary block">Team</span>
                <span className="text-xs font-semibold text-on-surface">{project.team.join(', ')}</span>
              </div>
              {project.articleId && (
                <Link
                  to={`/article/${project.articleId}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Read story</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
