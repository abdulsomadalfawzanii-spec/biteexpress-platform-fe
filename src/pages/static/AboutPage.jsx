import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChefHat,
  Clock3,
  CreditCard,
  MapPin,
  Search,
  ShoppingBag,
  Store,
  Truck,
  UserRound,
  UtensilsCrossed,
  Users,
} from 'lucide-react';

const featureList = [
  { icon: Search, title: 'Discover Great Food', text: 'Explore restaurants, cuisines, menus, and meals tailored to your cravings.' },
  { icon: ShoppingBag, title: 'Order Without The Hassle', text: 'Build your order in seconds and enjoy a smooth checkout experience from start to finish.' },
  { icon: MapPin, title: 'Stay In Control', text: 'Track your order as it moves from the restaurant to your doorstep.' },
  { icon: Users, title: 'Built For Everyone', text: 'BiteExpress creates value for customers, food vendors, and delivery partners.' },
];

const values = [
  { number: '01', title: 'Convenience', text: 'We remove unnecessary complexity from food ordering.' },
  { number: '02', title: 'Reliability', text: 'Every part of the experience should feel dependable.' },
  { number: '03', title: 'Community', text: 'We connect customers with restaurants and delivery partners.' },
  { number: '04', title: 'Innovation', text: 'We continuously improve the way people discover and receive food.' },
];

const userTypes = [
  { icon: UserRound, title: 'Customers', heading: 'Your cravings. Your choice.', detail: 'Discover restaurants, manage your cart, place orders, track deliveries, and share your experience.', action: 'Explore as a Customer', path: '/restaurants' },
  { icon: Store, title: 'Vendors', heading: 'Turn your kitchen into a business.', detail: 'Manage your restaurant, menu, orders, customers, and business performance from one dashboard.', action: 'Partner With Us', path: '/register' },
  { icon: Truck, title: 'Delivery Partners', heading: 'Deliver more. Manage better.', detail: 'Stay on top of assignments, update delivery progress, and manage your delivery activity.', action: 'Join Our Delivery Network', path: '/register' },
];

export const AboutPage = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-grid">
          <div className="about-hero-copy">
            <span className="page-eyebrow">BiteExpress</span>
            <h1>More Than Delivery.</h1>
            <h2>It&apos;s Your Food, Your Way.</h2>
            <p className="hero-lede">BiteExpress is a modern food delivery platform built to make discovering, ordering, and enjoying great food effortless.</p>
            <p className="hero-copy">From local favorites to new places worth discovering, BiteExpress connects customers with restaurants and delivery partners through one seamless experience.</p>

            <div className="hero-actions">
              <Link className="btn btn-primary" to="/restaurants">
                Explore Restaurants <ArrowRight size={16} />
              </Link>
              <Link className="btn btn-outline" to="/register">
                Become a Partner
              </Link>
            </div>

            <p className="hero-tagline">Discover. Order. Track. Enjoy.</p>
          </div>

          <div className="about-hero-visual">
            <div className="about-hero-panel">
              <div className="about-hero-panel-top">
                <span className="brand-icon"><UtensilsCrossed size={24} /></span>
                <span className="brand-text">BiteExpress</span>
              </div>
              <div className="hero-panel-map">
                <div className="hero-map-grid">
                  <span className="map-node node-one"><Store size={22} /></span>
                  <span className="map-node node-two"><ShoppingBag size={22} /></span>
                  <span className="map-node node-three"><Truck size={22} /></span>
                  <span className="map-line map-line-one" />
                  <span className="map-line map-line-two" />
                </div>
              </div>
              <div className="hero-panel-stats">
                <div>
                  <span className="stat-number">24k+</span>
                  <span className="stat-label">happy orders</span>
                </div>
                <div>
                  <span className="stat-number">180+</span>
                  <span className="stat-label">partner kitchens</span>
                </div>
                <div>
                  <span className="stat-number">07m</span>
                  <span className="stat-label">avg. delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-feature-section">
        <div className="section-heading centered">
          <span className="page-eyebrow dark">Everything You Need, In One Place</span>
          <h2>Food made simple, from first bite to last mile.</h2>
        </div>

        <div className="feature-grid">
          {featureList.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <article className="feature-card" key={feature.title}>
                <span className="feature-icon"><Icon size={26} /></span>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="story-section">
        <div className="story-content">
          <div className="story-copy">
            <span className="page-eyebrow dark">Our Story</span>
            <h2>We believe getting great food should be simple.</h2>
            <p>Food brings people together. But finding what you want, placing an order, making payments, and waiting for delivery shouldn&apos;t feel complicated.</p>
            <p>BiteExpress was created to bring the entire experience together in one reliable platform.</p>
            <div className="story-list">
              <div><strong>For customers</strong><span>, it&apos;s an easier way to discover and enjoy their favorite meals.</span></div>
              <div><strong>For vendors</strong><span>, it&apos;s a digital platform to showcase their food, manage orders, and grow their business.</span></div>
              <div><strong>For delivery partners</strong><span>, it&apos;s an opportunity to manage deliveries and serve customers efficiently.</span></div>
            </div>
          </div>
          <div className="story-aside">
            <div className="story-card">
              <span className="story-card-icon"><Clock3 size={32} /></span>
              <span className="story-card-title">Fresh daily</span>
              <span className="story-card-text">From kitchen to doorstep</span>
            </div>
            <div className="story-card light-card">
              <span className="story-card-icon"><ChefHat size={32} /></span>
              <span className="story-card-title">Neighborhood favorites</span>
              <span className="story-card-text">Curated by local taste</span>
            </div>
          </div>
        </div>
      </section>

      <section className="timeline-section">
        <div className="section-heading centered">
          <span className="page-eyebrow dark">How BiteExpress Works</span>
          <h2>From craving to doorstep.</h2>
        </div>
        <div className="timeline">
          <div className="timeline-step">
            <span className="timeline-number">01</span>
            <span className="timeline-icon"><Search size={22} /></span>
            <h3>Discover</h3>
            <p>Find restaurants and explore their menus.</p>
          </div>
          <div className="timeline-step">
            <span className="timeline-number">02</span>
            <span className="timeline-icon"><ShoppingBag size={22} /></span>
            <h3>Choose</h3>
            <p>Select your favorite meals and customize your order.</p>
          </div>
          <div className="timeline-step">
            <span className="timeline-number">03</span>
            <span className="timeline-icon"><CreditCard size={22} /></span>
            <h3>Order</h3>
            <p>Checkout securely and receive confirmation instantly.</p>
          </div>
          <div className="timeline-step">
            <span className="timeline-number">04</span>
            <span className="timeline-icon"><Truck size={22} /></span>
            <h3>Enjoy</h3>
            <p>Follow your order until it arrives at your door.</p>
          </div>
        </div>
      </section>

      <section className="stakeholder-section">
        <div className="section-heading centered">
          <span className="page-eyebrow dark">Built Around You</span>
          <h2>One platform for every part of the meal journey.</h2>
        </div>
        <div className="stakeholder-grid">
          {userTypes.map((item) => {
            const Icon = item.icon;
            return (
              <article className="stakeholder-card" key={item.title}>
                <span className="stakeholder-icon"><Icon size={36} /></span>
                <h3>{item.title}</h3>
                <p className="stakeholder-heading">{item.heading}</p>
                <p>{item.detail}</p>
                <Link className="card-link" to={item.path}>{item.action} <ArrowRight size={16} /></Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="values-section">
        <div className="section-heading centered">
          <span className="page-eyebrow dark">Our Values</span>
          <h2>What guides the BiteExpress experience.</h2>
        </div>
        <div className="value-grid">
          {values.map((value) => (
            <article className="value-card" key={value.title}>
              <span className="value-number">{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="promise-section">
        <div className="promise-wrap">
          <div className="promise-content">
            <span className="page-eyebrow dark">The BiteExpress Promise</span>
            <blockquote>Great food should be easy to find, simple to order, and enjoyable to receive.</blockquote>
            <p>That&apos;s the experience we&apos;re building with BiteExpress.</p>
            <Link className="btn btn-primary" to="/restaurants">
              Start Ordering <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
