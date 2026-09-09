import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Briefcase,
  HeartHandshake,
  LineChart,
  MapPin,
  Smile,
} from 'lucide-react';

const jobOpenings = [
  {
    title: 'Restaurant Growth Partner',
    type: 'Part-time',
    location: 'Remote / Hybrid',
    description: 'Grow and support neighborhood restaurant partners through campaigns, onboarding, and operations.',
  },
  {
    title: 'Delivery Operations Coordinator',
    type: 'Full-time',
    location: 'Lagos',
    description: 'Coordinate delivery performance, optimization, and partner experience across dispatch operations.',
  },
  {
    title: 'Customer Experience Specialist',
    type: 'Full-time',
    location: 'Hybrid',
    description: 'Help customers resolve issues, improve support journeys, and create a smooth ordering experience.',
  },
];

export const CareersPage = () => {
  return (
    <div className="careers-page">
      <section className="careers-hero">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div>
              <span className="page-eyebrow dark">BiteExpress Careers</span>
              <h1 className="text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
                Join the team feeding your neighborhood.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                We’re building a better food experience for customers, restaurants, and delivery partners.
                Join a team that turns everyday meals into meaningful moments.
              </p>
              <div className="hero-actions mt-7">
                <Link className="btn btn-primary" to="#open-roles">
                  Explore roles <ArrowRight size={16} />
                </Link>
                <Link className="btn btn-outline" to="/register">
                  Become a Partner
                </Link>
              </div>
            </div>

            <div className="rounded-[2rem] border border-orange-100 bg-white p-8 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-orange-50 px-4 py-2 text-sm font-bold text-orange-600">
                  BiteExpress Culture
                </span>
                <span className="rounded-full bg-teal-50 px-4 py-2 text-sm font-bold text-teal-700">
                  2026
                </span>
              </div>
              <div className="mt-8 grid gap-5">
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-orange-50 p-3 text-orange-600"><Briefcase size={22} /></span>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wide text-gray-500">Work with purpose</span>
                    <span className="block text-lg font-bold text-gray-900">Food, logistics, and community</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-teal-50 p-3 text-teal-700"><LineChart size={22} /></span>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wide text-gray-500">Growth mindset</span>
                    <span className="block text-lg font-bold text-gray-900">Scale what matters</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-xl bg-emerald-50 p-3 text-emerald-700"><HeartHandshake size={22} /></span>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wide text-gray-500">Care for people</span>
                    <span className="block text-lg font-bold text-gray-900">Customer-first service</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-heading centered">
            <span className="page-eyebrow dark">Why join us</span>
            <h2 className="text-4xl font-black text-gray-900">Create impact every day.</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <article className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <Smile className="w-10 h-10 text-orange-500" />
              <h3 className="mt-5 text-xl font-bold text-gray-900">Build customer joy</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">Create the ordering, delivery, and support experience that makes people smile.</p>
            </article>
            <article className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <LineChart className="w-10 h-10 text-orange-500" />
              <h3 className="mt-5 text-xl font-bold text-gray-900">Learn and grow</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">Work with a cross-functional team solving real food and logistics challenges.</p>
            </article>
            <article className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
              <HeartHandshake className="w-10 h-10 text-orange-500" />
              <h3 className="mt-5 text-xl font-bold text-gray-900">Support neighborhoods</h3>
              <p className="mt-3 text-sm leading-7 text-gray-600">Connect hungry customers with restaurants and delivery partners in one seamless flow.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50" id="open-roles">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-heading centered">
            <span className="page-eyebrow dark">Open roles</span>
            <h2 className="text-4xl font-black text-gray-900">Current opportunities</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {jobOpenings.map((job) => (
              <article key={job.title} className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-600">{job.type}</span>
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-500"><MapPin size={14} /> {job.location}</span>
                </div>
                <h3 className="mt-6 text-xl font-black text-gray-900">{job.title}</h3>
                <p className="mt-4 text-sm leading-7 text-gray-600">{job.description}</p>
                <Link className="mt-6 inline-flex items-center gap-2 font-bold text-orange-600 hover:text-orange-700" to="/contact">
                  Apply now <ArrowRight size={14} />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
