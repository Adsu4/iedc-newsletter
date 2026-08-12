export default function About() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-20 flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="border-b-4 border-on-surface pb-16 flex flex-col gap-8">
        <div className="flex items-center gap-3">
          <span className="bg-secondary text-on-secondary px-4 py-1.5 rounded-full text-label-bold font-label-bold uppercase text-xs">
            Govt. Engineering College Thrissur
          </span>
        </div>
        <h1 className="text-display-lg-mobile md:text-display-lg font-display-lg-mobile md:font-display-lg text-on-surface uppercase leading-none max-w-4xl">
          Fostering Innovation & Entrepreneurship Since 2010
        </h1>
        <p className="text-headline-md font-headline-md text-on-surface-variant max-w-3xl leading-relaxed">
          The Innovation and Entrepreneurship Development Centre (IEDC) at GECT is a premier student-led initiative backed by Kerala Startup Mission (KSUM) and KSCSTE.
        </p>
      </section>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { number: '40+', label: 'Student Startups Incubated' },
          { number: '₹1.5Cr+', label: 'Seed Grants & Funding Raised' },
          { number: '1200+', label: 'Active Student Members' },
          { number: '15+', label: 'Patents & IP Filed' },
        ].map((stat) => (
          <div key={stat.label} className="bg-surface-container-high p-8 rounded-2xl border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-2">
            <span className="text-display-lg-mobile font-black text-primary leading-none">{stat.number}</span>
            <span className="text-label-bold font-label-bold text-on-surface uppercase text-sm">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Core Initiatives */}
      <section className="flex flex-col gap-12">
        <h2 className="text-headline-xl font-headline-xl text-on-surface uppercase border-b-2 border-on-surface pb-4">
          What We Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'Incubation & Mentorship',
              icon: 'rocket_launch',
              desc: 'From initial napkin sketch to seed round, we provide co-working space, cloud credits, legal guidance, and 1-on-1 mentorship with industry alumni.',
            },
            {
              title: 'Hackathons & Bootcamps',
              icon: 'terminal',
              desc: 'Monthly hands-on workshops covering AI/ML, Robotics, Web3, AWS Cloud, and annual regional hackathons with cash prizes.',
            },
            {
              title: 'IP & Patent Facilitation',
              icon: 'verified',
              desc: 'Full financial and administrative support for filing patents, trademarks, and copyright registration for student hardware and software innovations.',
            },
          ].map((init) => (
            <div key={init.title} className="bg-surface p-8 rounded-2xl border-4 border-on-surface shadow-[6px_6px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-6">
              <div className="w-14 h-14 bg-tertiary text-on-tertiary rounded-2xl border-2 border-on-surface flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]">
                <span className="material-symbols-outlined text-[28px]">{init.icon}</span>
              </div>
              <h3 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight">{init.title}</h3>
              <p className="text-body-md text-on-surface-variant leading-relaxed">{init.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Committee — Nodal Officers & Student Leads */}
      <section className="flex flex-col gap-12">
        <h2 className="text-headline-xl font-headline-xl text-on-surface uppercase border-b-2 border-on-surface pb-4">
          IEDC Leadership & Officers
        </h2>

        {/* Nodal Officers */}
        <div className="flex flex-col gap-6">
          <h3 className="text-headline-md font-headline-md text-primary uppercase">Nodal Officers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { name: 'Dr. Vipinkumar K S', role: 'Nodal Officer I', dept: 'Faculty Advisor', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q' },
              { name: 'Prof. Asha J', role: 'Nodal Officer II', dept: 'Faculty Advisor', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q' },
            ].map((member) => (
              <div key={member.name} className="bg-surface p-6 rounded-2xl border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-4 border-on-surface overflow-hidden shrink-0 bg-primary shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover mix-blend-luminosity" />
                </div>
                <div>
                  <h4 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight">{member.name}</h4>
                  <p className="text-label-bold font-label-bold text-primary text-xs uppercase mt-1">{member.role}</p>
                  <p className="text-xs text-secondary mt-0.5">{member.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Leads */}
        <div className="flex flex-col gap-6 mt-4">
          <h3 className="text-headline-md font-headline-md text-secondary uppercase">Student Leads</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[
              { name: 'Nikhil Nizam C K', role: 'Student Lead', dept: 'GECT IEDC', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q' },
              { name: 'Shanum Gaddafi', role: 'Student Lead', dept: 'GECT IEDC', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q' },
            ].map((member) => (
              <div key={member.name} className="bg-surface p-6 rounded-2xl border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border-4 border-on-surface overflow-hidden shrink-0 bg-tertiary shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover mix-blend-luminosity" />
                </div>
                <div>
                  <h4 className="text-headline-md font-headline-md text-on-surface uppercase leading-tight">{member.name}</h4>
                  <p className="text-label-bold font-label-bold text-secondary text-xs uppercase mt-1">{member.role}</p>
                  <p className="text-xs text-secondary mt-0.5">{member.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location Banner */}
      <section className="bg-tertiary-container rounded-[2rem] p-12 md:p-16 border-4 border-on-surface shadow-[12px_12px_0px_0px_rgba(28,27,27,1)] flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h3 className="text-headline-xl font-headline-xl text-on-tertiary-container uppercase leading-none mb-3">Visit the IEDC Innovation Lab</h3>
          <p className="text-body-lg text-on-tertiary-container/90 max-w-xl">
            Ground Floor, IT Block, Govt. Engineering College, Ramavarmapuram, Thrissur, Kerala - 680009
          </p>
        </div>
        <a
          href="mailto:iedc@gect.ac.in"
          className="bg-on-surface text-surface px-8 py-4 rounded-full text-label-bold font-label-bold uppercase hover:bg-primary hover:text-on-primary transition-all whitespace-nowrap border-4 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)]"
        >
          Contact IEDC Team
        </a>
      </section>
    </main>
  );
}
