import { useState } from 'react';
import { ArrowRight, AtSign, Globe2, Mail, MapPin, MessageCircle, Phone, UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

const footerGroups = [
	{
		title: 'Discover',
		links: [['Explore restaurants', '/restaurants'], ['Popular categories', '/restaurants?category=Burgers'], ['Track an order', '/orders/track'], ['Favorites', '/favorites']]
	},
	{
		title: 'Company',
		links: [['About BiteExpress', '/'], ['Careers', '/'], ['Contact us', '/'], ['Partner with us', '/register']]
	},
	{
		title: 'For partners',
		links: [['Restaurant owners', '/register'], ['Delivery partners', '/register'], ['Vendor sign in', '/login'], ['Admin Login', '/admin/login']]
	}
];

export const Footer = () => {
	const [email, setEmail] = useState('');
	const [subscribed, setSubscribed] = useState(false);

	const handleSubmit = (event) => {
		event.preventDefault();
		if (email.trim()) setSubscribed(true);
	};

	return (
		<footer className="site-footer">
			<div className="footer-glow" aria-hidden="true" />
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
				<div className="footer-main">
					<div className="footer-brand-block">
						<Link to="/" className="footer-brand">
							<span className="footer-brand-mark"><UtensilsCrossed className="w-5 h-5" /></span>
							<span>BiteExpress</span>
						</Link>
						<p className="footer-tagline">The best of your neighborhood, brought to your table while it is still worth talking about.</p>
						<div className="footer-contact-list">
							<a href="mailto:hello@biteexpress.com"><Mail className="w-4 h-4" /> abdulsomadalfawzanii@gmail.com</a>
							<a href="tel:+234905301047"><Phone className="w-4 h-4" /> +234 905 301 047</a>
							<span><MapPin className="w-4 h-4" /> Serving your neighborhood daily</span>
						</div>
						<div className="footer-socials" aria-label="Social media">
							<a href="https://instagram.com" aria-label="Social profile"><Globe2 className="w-4 h-4" /></a>
							<a href="https://facebook.com" aria-label="Community page"><MessageCircle className="w-4 h-4" /></a>
							<a href="https://linkedin.com" aria-label="Professional network"><AtSign className="w-4 h-4" /></a>
						</div>
					</div>

					<div className="footer-links-grid">
						{footerGroups.map((group) => (
							<div key={group.title}>
								<h2>{group.title}</h2>
								<ul>{group.links.map(([label, path]) => <li key={label}><Link to={path}>{label}</Link></li>)}</ul>
							</div>
						))}
					</div>

					<div className="footer-newsletter">
						<span className="footer-newsletter-kicker">A little something good</span>
						<h2>Stay in the loop.</h2>
						<p>New kitchens, neighborhood favorites, and offers worth opening.</p>
						<form onSubmit={handleSubmit} className="footer-newsletter-form">
							<label className="sr-only" htmlFor="footer-email">Email address</label>
							<input id="footer-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" />
							<button type="submit" aria-label="Subscribe to newsletter">{subscribed ? 'Joined' : <ArrowRight className="w-5 h-5" />}</button>
						</form>
						<p className="footer-newsletter-note">No noise. Unsubscribe whenever you like.</p>
					</div>
				</div>

				<div className="footer-bottom">
					<span> {new Date().getFullYear()} BiteExpress. Made for good food.</span>
					<div><Link to="/">Privacy policy</Link><Link to="/">Terms & conditions</Link><Link to="/">Accessibility</Link></div>
				</div>
			</div>
		</footer>
	);
};
