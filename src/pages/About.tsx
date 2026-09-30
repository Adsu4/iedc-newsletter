export default function About() {
  return (
    <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-14 flex flex-col gap-10 md:gap-14">
      {/* Hero Section */}
      <section className="border-b-2 border-on-surface pb-8 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="bg-secondary text-on-secondary px-3 py-0.5 rounded-full text-label-bold font-label-bold uppercase text-[11px]">
            Govt. Engineering College Thrissur
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline-xl uppercase text-on-surface leading-tight max-w-3xl">
          Fostering Innovation & Entrepreneurship Since 2010
        </h1>
        <p className="text-sm sm:text-base text-on-surface-variant max-w-3xl leading-relaxed">
          The Innovation and Entrepreneurship Development Centre (IEDC) at GECT is a premier student-led initiative backed by Kerala Startup Mission (KSUM) and KSCSTE.
        </p>
      </section>


      {/* Core Initiatives */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface border-b-2 border-on-surface pb-3">
          What We Do
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <div key={init.title} className="bg-surface p-5 sm:p-6 rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] flex flex-col gap-3">
              <div className="w-10 h-10 bg-tertiary text-on-tertiary rounded-lg border border-on-surface flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]">
                <span className="material-symbols-outlined text-[20px]">{init.icon}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold font-sans text-on-surface leading-snug">{init.title}</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{init.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Committee */}
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface border-b-2 border-on-surface pb-3">
          IEDC Leadership & Officers
        </h2>

        {/* Nodal Officers */}
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-bold font-headline-md text-primary">Nodal Officers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { name: 'Dr. Vipinkumar K S', role: 'Nodal Officer I', dept: 'Faculty Advisor', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q' },
              { name: 'Prof. Asha J', role: 'Nodal Officer II', dept: 'Faculty Advisor', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q' },
            ].map((member) => (
              <div key={member.name} className="bg-surface p-4 sm:p-5 rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-on-surface overflow-hidden shrink-0 bg-surface-container-high shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover img-editorial" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-sans text-on-surface leading-snug">{member.name}</h4>
                  <p className="text-xs font-semibold text-primary mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-secondary">{member.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Leads */}
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="text-lg font-bold font-headline-md text-secondary">Student Leads</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { name: 'Nikhil Nizam C K', role: 'Student Lead', dept: 'GECT IEDC', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q' },
              { name: 'Shanum Gaddafi', role: 'Student Lead', dept: 'GECT IEDC', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp6-LO5wbh6CTC36gJGeJayrbGtizLZWUlH9INz99YIJjIvsgYIZWEI3FCpw0i_0qiTUtAr6wPwhbUntODV_DKp16HJ_i97nWITmL3RCUSGrO0UEQgfLjdcaub8MJ1eBmE7L8UKpcRIhK6qh2roHWO8mK9WHTiHouOVak3xxVFkkI027MEgVlLW2Wt-YE2_7_p67F0NuRnWR6AOvYY3tYmko7Kd-N5jpyO_R33j4KF_IVtKvrukoEY2Q' },
            ].map((member) => (
              <div key={member.name} className="bg-surface p-4 sm:p-5 rounded-xl border-2 border-on-surface shadow-[3px_3px_0px_0px_rgba(28,27,27,1)] flex items-center gap-4">
                <div className="w-14 h-14 rounded-full border-2 border-on-surface overflow-hidden shrink-0 bg-surface-container-high shadow-[1px_1px_0px_0px_rgba(28,27,27,1)]">
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover img-editorial" />
                </div>
                <div>
                  <h4 className="text-base font-bold font-sans text-on-surface leading-snug">{member.name}</h4>
                  <p className="text-xs font-semibold text-secondary mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-secondary">{member.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location Banner */}
      <section className="bg-tertiary-container/30 rounded-2xl p-6 sm:p-8 md:p-10 border-2 border-on-surface shadow-[4px_4px_0px_0px_rgba(28,27,27,1)] flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold font-headline-md text-on-surface leading-tight mb-2">Visit the IEDC Innovation Lab</h3>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl leading-relaxed">
            Room no. 413, First Floor, Main Block, Govt. Engineering College, Ramavarmapuram, Thrissur, Kerala - 680009
          </p>
        </div>
        <a
          href="mailto:iedc@gectcr.ac.in"
          className="bg-on-surface text-surface px-6 py-3 rounded-full text-label-bold font-label-bold uppercase text-xs hover:bg-primary hover:text-on-primary transition-all whitespace-nowrap border border-on-surface shadow-[2px_2px_0px_0px_rgba(28,27,27,1)]"
        >
          Contact IEDC Team
        </a>
      </section>
    </main>
  );
}
