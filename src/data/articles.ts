export interface Article {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  categoryColor: 'primary' | 'secondary' | 'tertiary';
  date: string;
  readTime: string;
  imageUrl: string;
  featured?: boolean;
  content: {
    paragraphs: string[];
    subheadings: string[];
    blockquote?: string;
  };
  author: {
    name: string;
    role: string;
    avatarUrl: string;
  };
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'Innovating at the Edge: AI in Engineering',
    subtitle: 'Dive into our comprehensive report on how artificial intelligence is reshaping civil and mechanical engineering paradigms across the campus, featuring insights from top student projects.',
    category: 'Latest Edition',
    categoryColor: 'tertiary',
    date: 'Oct 2024',
    readTime: '8 min read',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGMRl1dRUP3Cr1L5leksQUJB_6c_VVlTZv2dO5tLx-fYZZ6gkVzoYboO4xveDoPswMmnl3c8I5P7Zs0FOstO6anVNSlLGGkKjxmSZmMFxT2vM5j55AgK_RV3dHFlZlLa1roL2etkVICbJUdYD2VxeoOv4vXpxWS35HSK9-7X_KMcqfjIKEhG7QdX5Xw-ulKANh_szfaD9A7hlUqSc2kXDv4gkcJDrEhKUwLLjbUkk4VLMdGa4yKJ7vHA',
    featured: true,
    content: {
      paragraphs: [
        'The newly inaugurated Artificial Intelligence lab at GECT is already making waves. Nestled in the corner of the IT block, this state-of-the-art facility is more than just rows of high-performance computers. It represents a paradigm shift in how students approach complex problem-solving in their respective engineering fields.',
        'Historically, civil and mechanical engineering departments operated in silos, focusing on traditional methodologies. The introduction of AI into their curricula has broken down these barriers. Now, you see students from different disciplines huddling around screens, discussing neural networks that predict material fatigue or optimize urban traffic flow.',
        'One standout project is the \'Smart Traffic Grid\', developed by a team of final-year students. By utilizing computer vision and machine learning algorithms, their system can dynamically adjust traffic light timings based on real-time vehicle density, a solution that could drastically reduce congestion in busy urban areas.',
        'As the term progresses, the IEDC plans to host a series of hackathons centered around sustainable technology. The expectation is that the tools provided by the new AI lab will empower students to push their innovative ideas from mere concepts to functional prototypes.',
      ],
      subheadings: ['Bridging the Gap', 'Looking Ahead'],
      blockquote: '"We\'re no longer just calculating load capacities; we\'re teaching machines to understand the structural integrity of our designs in real-time." — Dr. Rajesh, Head of AI Initiatives',
    },
    author: {
      name: 'Sarah Jenkins',
      role: 'Lead Tech Reporter',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
  },
  {
    id: '2',
    title: 'Hackathon Winners Revealed: Sustainable Energy Solutions',
    subtitle: 'Three teams from GECT took home top prizes at the inter-college hackathon with projects focused on renewable energy monitoring and smart grid optimization.',
    category: 'Events',
    categoryColor: 'secondary',
    date: 'Aug 2024',
    readTime: '4 min read',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
    content: {
      paragraphs: [
        'The annual inter-college hackathon saw an unprecedented level of participation from GECT students this year. Over 40 teams registered, with three making it to the finals and securing top positions.',
        'The winning team, "GreenGrid", developed a real-time solar panel efficiency monitoring system using IoT sensors and a machine learning backend that can predict maintenance needs before failures occur.',
        'The second-place team focused on developing a peer-to-peer energy trading platform for college campuses, enabling buildings with excess solar energy to share it with neighboring facilities.',
        'The hackathon was sponsored by several industry partners, who have expressed interest in supporting the winning projects through their incubation programs.',
      ],
      subheadings: ['The Winning Projects', 'Industry Interest'],
      blockquote: '"The quality of projects this year was exceptional. These students are solving real-world problems." — Hackathon Judge Panel',
    },
    author: {
      name: 'Rahul Menon',
      role: 'Events Correspondent',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
  },
  {
    id: '3',
    title: 'Alumni Spotlight: Building the Web3 Infrastructure',
    subtitle: 'GECT alumnus Arun Krishnan shares his journey from campus projects to leading a blockchain infrastructure startup that raised $2M in seed funding.',
    category: 'Alumni',
    categoryColor: 'tertiary',
    date: 'July 2024',
    readTime: '6 min read',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGMRl1dRUP3Cr1L5leksQUJB_6c_VVlTZv2dO5tLx-fYZZ6gkVzoYboO4xveDoPswMmnl3c8I5P7Zs0FOstO6anVNSlLGGkKjxmSZmMFxT2vM5j55AgK_RV3dHFlZlLa1roL2etkVICbJUdYD2VxeoOv4vXpxWS35HSK9-7X_KMcqfjIKEhG7QdX5Xw-ulKANh_szfaD9A7hlUqSc2kXDv4gkcJDrEhKUwLLjbUkk4VLMdGa4yKJ7vHA',
    content: {
      paragraphs: [
        'Arun Krishnan graduated from GECT\'s Computer Science department in 2018. Within five years, he\'s become one of the most prominent voices in the decentralized infrastructure space.',
        'His startup, ChainBridge Labs, focuses on building middleware that allows traditional web applications to interact seamlessly with blockchain networks, eliminating the steep learning curve that has been a barrier to Web3 adoption.',
        'Arun credits his time at GECT for instilling a problem-solving mindset. "The IEDC workshops were my first exposure to thinking about technology as a business," he recalls.',
        'ChainBridge Labs recently closed a $2M seed round and is looking to recruit interns from their alma mater, GECT.',
      ],
      subheadings: ['From Campus to Startup', 'Giving Back'],
      blockquote: '"The IEDC workshops were my first exposure to thinking about technology as a business. That mindset shift changed everything for me." — Arun Krishnan, CEO of ChainBridge Labs',
    },
    author: {
      name: 'Priya Nair',
      role: 'Alumni Relations',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
  },
  {
    id: '4',
    title: 'Startup Showcase: From Dorm Room to Seed Funding',
    subtitle: 'How three GECT students built a SaaS product during their final year and secured funding from a Kerala-based angel investor network.',
    category: 'Startups',
    categoryColor: 'primary',
    date: 'May 2024',
    readTime: '5 min read',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
    content: {
      paragraphs: [
        'It started as a weekend project. Ananya, Siddharth, and Fahad, all final-year CSE students, were frustrated with the lack of good attendance tracking tools at their college.',
        'What began as a simple QR-code based system evolved into a full-fledged SaaS platform called "PresentIQ" that now serves 12 colleges across Kerala.',
        'The team pitched at the IEDC\'s Demo Day and caught the attention of Malabar Angels, a Kochi-based investor network. They closed a ₹50 lakh pre-seed round in April.',
        'The founders are now working full-time on PresentIQ and plan to expand to universities across South India by the end of the year.',
      ],
      subheadings: ['The Spark', 'Scaling Up'],
      blockquote: '"We never planned to build a startup. We just wanted to solve a problem we faced every day. The IEDC gave us the platform to think bigger." — Ananya, Co-founder of PresentIQ',
    },
    author: {
      name: 'Vishnu Dev',
      role: 'Startup Beat Editor',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
  },
  {
    id: '5',
    title: 'The Future of Automation on Campus',
    subtitle: 'Exploring the new robotic arms acquired by the mechanical department and how students are programming them for micro-manufacturing and precision tasks.',
    category: 'Robotics',
    categoryColor: 'primary',
    date: 'Sept 2024',
    readTime: '7 min read',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
    content: {
      paragraphs: [
        'The Mechanical Engineering department recently acquired two industrial-grade robotic arms, marking a significant investment in hands-on automation education at GECT.',
        'Students have already begun programming the arms using ROS (Robot Operating System) to perform precision tasks like PCB soldering and micro-component assembly.',
        'Prof. Suresh, head of the department, envisions these robots being used not just for teaching but for actual micro-manufacturing projects that could generate revenue for the department.',
        'A student team is currently developing a computer vision system that would allow the arms to sort and quality-check manufactured components autonomously.',
      ],
      subheadings: ['New Hardware, New Possibilities', 'Student-Led Innovation'],
      blockquote: '"These aren\'t toys. These are the same robots used in automotive factories. Our students are getting industry-grade experience." — Prof. Suresh, Head of Mechanical Engineering',
    },
    author: {
      name: 'Deepa Thomas',
      role: 'Science & Tech Writer',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
  },
  {
    id: '6',
    title: 'New IEDC Executive Committee Takes Charge',
    subtitle: 'Meet the newly elected student leaders who will be steering the innovation and entrepreneurship initiatives for the upcoming academic year.',
    category: 'Leadership',
    categoryColor: 'secondary',
    date: 'June 2024',
    readTime: '3 min read',
    imageUrl: '',
    content: {
      paragraphs: [
        'The annual IEDC elections saw a record turnout this year, with over 200 students casting their votes for the new executive committee.',
        'The new chairperson, Meera Krishnan (CSE, 3rd Year), ran on a platform of making IEDC events more inclusive and accessible to students from all departments, not just CS and IT.',
        'The committee has already announced an ambitious calendar for the upcoming academic year, including monthly tech talks, two hackathons, and a startup boot camp in collaboration with Kerala Startup Mission.',
        'Outgoing chairperson Aditya Mohan praised the new team: "They have the energy and the vision to take IEDC GECT to the next level."',
      ],
      subheadings: ['A New Vision', 'What\'s Ahead'],
      blockquote: '"Innovation doesn\'t belong to one department. Every engineer is a potential entrepreneur, and we want to make that real at GECT." — Meera Krishnan, New IEDC Chairperson',
    },
    author: {
      name: 'Admin',
      role: 'IEDC Editorial',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
  },
  {
    id: '7',
    title: 'Workshop Recap: Introduction to Cloud Computing with AWS',
    subtitle: 'A weekend workshop organized by the IEDC introduced 80+ students to the fundamentals of cloud infrastructure using AWS Free Tier.',
    category: 'Workshops',
    categoryColor: 'primary',
    date: 'April 2024',
    readTime: '4 min read',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGMRl1dRUP3Cr1L5leksQUJB_6c_VVlTZv2dO5tLx-fYZZ6gkVzoYboO4xveDoPswMmnl3c8I5P7Zs0FOstO6anVNSlLGGkKjxmSZmMFxT2vM5j55AgK_RV3dHFlZlLa1roL2etkVICbJUdYD2VxeoOv4vXpxWS35HSK9-7X_KMcqfjIKEhG7QdX5Xw-ulKANh_szfaD9A7hlUqSc2kXDv4gkcJDrEhKUwLLjbUkk4VLMdGa4yKJ7vHA',
    content: {
      paragraphs: [
        'Over 80 students attended the two-day AWS Cloud Computing workshop, making it one of the most popular IEDC events of the semester.',
        'Participants learned to deploy EC2 instances, configure S3 buckets, and set up basic CI/CD pipelines using AWS CodePipeline.',
        'The workshop was led by Sreelakshmi P., an AWS Community Builder and GECT alumna, who volunteered her time to give back to her college.',
        'Several students have since deployed personal projects on AWS, and the IEDC is planning a follow-up advanced workshop on serverless architectures.',
      ],
      subheadings: ['Hands-On Learning', 'What Students Built'],
      blockquote: '"Cloud computing is no longer optional knowledge. Every developer needs to understand it, and this workshop was the perfect starting point." — Sreelakshmi P., Workshop Lead',
    },
    author: {
      name: 'Rahul Menon',
      role: 'Events Correspondent',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
  },
  {
    id: '8',
    title: 'GECT Students Win National IoT Challenge',
    subtitle: 'A team of four ECE students developed an air quality monitoring network that won the Smart India Hackathon regional round.',
    category: 'Achievements',
    categoryColor: 'tertiary',
    date: 'March 2024',
    readTime: '5 min read',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCO3gZzUKko1uW4sbl158JBCKDjmGxsr_Z_JjWzCDJjiZN3PfVzqCtCGUh2BtDaq2vrXLnIn1-GEHcE8Xs6KWyCkjxV7dpSzaw0MUQel4gh9xknUzFt5q1u1czsq3T5FZhazub_WOUubM6UWK1nwJky_SLUwxtJP0TgWJqGD2kEyekH7YK7DCH-T8f75uK13v44HGSg_13dEVkgdz8x7ZRMQj2AePG75JSQorXSbEJMlk53Nm5XwW54kw',
    content: {
      paragraphs: [
        'Four students from the Electronics and Communication Engineering department have won the regional round of the Smart India Hackathon with their innovative air quality monitoring solution.',
        'Their system, called "BreatheEasy", uses a network of low-cost ESP32-based sensors placed across campus that measure PM2.5, CO2, and volatile organic compounds in real-time.',
        'The data is visualized on a web dashboard that provides alerts when air quality drops below safe levels, helping the administration make informed decisions about ventilation.',
        'The team will now represent GECT at the national finals in New Delhi, competing against the top engineering colleges in the country.',
      ],
      subheadings: ['The BreatheEasy System', 'Road to Nationals'],
      blockquote: '"We wanted to solve a problem we literally breathe every day. The campus air quality data we collected was eye-opening." — Team BreatheEasy',
    },
    author: {
      name: 'Deepa Thomas',
      role: 'Science & Tech Writer',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q',
    },
  },
];

export function getArticleById(id: string): Article | undefined {
  return articles.find((a) => a.id === id);
}

export function getFeaturedArticle(): Article | undefined {
  return articles.find((a) => a.featured);
}

export function getTrendingArticles(): Article[] {
  return articles.filter((a) => !a.featured).slice(0, 3);
}

export function getArchiveArticles(): Article[] {
  return articles.filter((a) => !a.featured);
}
