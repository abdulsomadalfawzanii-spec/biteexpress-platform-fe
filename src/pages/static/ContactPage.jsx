import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Headphones,
  MapPin,
  Store,
  Truck,
} from 'lucide-react';

const contactCards = [
  { icon: Headphones, title: 'Customer Support', description: 'Need help with an order or account?', email: 'support@biteexpress.com', action: 'Contact Support', path: '#message' },
  { icon: Store, title: 'Vendor Partnerships', description: 'Want to bring your restaurant to BiteExpress?', email: 'partners@biteexpress.com', action: 'Become a Vendor', path: '/register' },
  { icon: Truck, title: 'Delivery Partners', description: 'Interested in joining our delivery network?', email: 'delivery@biteexpress.com', action: 'Join Our Network', path: '/register' },
];

const faqs = [
  ['How do I place an order?', 'Choose a restaurant, select your meals, add them to your cart, and complete checkout.'],
  ['Where can I see my order status?', 'Your order status is available from your customer dashboard and order details page.'],
  ['Can I become a BiteExpress vendor?', 'Yes. Register as a vendor and set up your restaurant profile and menu.'],
  ['How do I become a delivery partner?', 'Create a delivery account and complete the required onboarding information.'],
  ['What if there is a problem with my order?', 'Contact customer support with your order ID and details of the issue.'],
  ['How can I contact a restaurant?', 'Restaurant contact information can be displayed on the restaurant\'s profile where available.'],
];

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    topic: 'My Order',
    orderId: '',
    message: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Thank you. Our team will contact you soon.');
  };

  return (
    <div className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <span className="page-eyebrow">BiteExpress Support</span>
          <h1>Let&apos;s Talk.</h1>
          <div className="contact-hero-copy">
            <p>Questions about an order?</p>
            <p>Interested in becoming a vendor?</p>
            <p>Need help with your account?</p>
          </div>
          <p className="hero-mainline">We&apos;re here to help.</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#message">
              Send Us a Message <ArrowRight size={16} />
            </a>
            <Link className="btn btn-outline" to="/restaurants">
              Explore Restaurants
            </Link>
          </div>
        </div>
        <div className="contact-hero-card">
          <div className="contact-orbit">
            <span className="orbit-core"><Headphones size={34} /></span>
            <span className="orbit-ring orbit-ring-one" />
            <span className="orbit-ring orbit-ring-two" />
          </div>
          <div className="contact-hero-card-details">
            <div>
              <span className="detail-label">Our response window</span>
              <span className="detail-value">Usually within 30 mins</span>
            </div>
            <div>
              <span className="detail-label">Availability</span>
              <span className="detail-value">Daily, 8am - 11pm</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-card-section">
        <div className="contact-card-grid">
          {contactCards.map((card) => {
            const Icon = card.icon;
            return (
              <article className="contact-card" key={card.title}>
                <span className="contact-icon"><Icon size={36} /></span>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <a className="contact-email" href={`mailto:${card.email}`}>{card.email}</a>
                {card.path.startsWith('#') ? (
                  <a className="card-link" href={card.path}>{card.action} <ArrowRight size={16} /></a>
                ) : (
                  <Link className="card-link" to={card.path}>{card.action} <ArrowRight size={16} /></Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className="message-section" id="message">
        <div className="message-wrap">
          <div className="message-header">
            <span className="page-eyebrow dark">Send Us a Message</span>
            <h2>How can we help?</h2>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-grid-two">
              <label className="form-field">
                <span>Full Name</span>
                <input type="text" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
              </label>
              <label className="form-field">
                <span>Email Address</span>
                <input type="email" name="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
              </label>
            </div>

            <div className="form-grid-two">
              <label className="form-field">
                <span>I&apos;m contacting you about</span>
                <select name="topic" value={formData.topic} onChange={handleChange}>
                  <option>My Order</option>
                  <option>Account</option>
                  <option>Restaurant</option>
                  <option>Delivery</option>
                  <option>Payment</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="form-field">
                <span>Order ID <em>(optional)</em></span>
                <input type="text" name="orderId" placeholder="e.g. BX-10482" value={formData.orderId} onChange={handleChange} />
              </label>
            </div>

            <label className="form-field">
              <span>Message</span>
              <textarea name="message" placeholder="Tell us how we can help..." value={formData.message} onChange={handleChange} required />
            </label>

            <div className="form-submit">
              <button className="btn btn-primary" type="submit">
                Send Message <ArrowRight size={16} />
              </button>
            </div>
          </form>

          <div className="secure-note">
            <span className="secure-lock"><MapPin size={16} /></span>
            <span>Your information is handled securely and only used to respond to your request.</span>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="section-heading centered">
          <span className="page-eyebrow dark">FAQ</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-grid">
          {faqs.map(([question, answer]) => (
            <article className="faq-card" key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bottom-cta">
        <div className="bottom-cta-wrap">
          <span className="page-eyebrow light">BiteExpress</span>
          <h2>Good food is closer than you think.</h2>
          <p>Explore restaurants, discover something new, and get your next meal delivered with BiteExpress.</p>
          <Link className="btn btn-light" to="/restaurants">
            Explore Restaurants <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
