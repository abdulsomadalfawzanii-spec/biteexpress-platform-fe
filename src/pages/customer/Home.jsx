import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, Utensils, ShieldCheck, Clock, Star } from 'lucide-react';
import { restaurantService } from '../../services/restaurantService';

const FALLBACK_RESTAURANT_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScgN0ny1u6K14Zk4oWKj9xhxZVSbz6WLN00XZbDYV0I2PS1xFT6xya82Zf&s=10';

const normalizeRestaurant = (restaurant) => ({
  ...restaurant,
  id: restaurant?._id || restaurant?.id,
  name: restaurant?.name || restaurant?.restaurantName || 'Restaurant',
  image: restaurant?.image || restaurant?.coverImage || FALLBACK_RESTAURANT_IMAGE,
});

export const Home = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const data = await restaurantService.getRestaurants({ sort: 'recommended' });
        setRestaurants((Array.isArray(data) ? data : []).map(normalizeRestaurant));
      } catch {
        setRestaurants([]);
      }
    };

    loadRestaurants();
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="hero-shell text-white py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative z-10">
          <div className="space-y-6">
            <p className="hero-kicker text-xs font-bold uppercase">Your neighborhood, on the menu</p>
            <h1 className="hero-title text-5xl md:text-7xl font-bold">
              Dinner plans,<br /><em className="text-orange-300 not-italic">delivered.</em>
            </h1>
            <p className="text-stone-300 text-base md:text-lg max-w-xl">
              Find the best local kitchens, order what feels good, and follow every mile from prep counter to front door.
            </p>

            {/* Location & Search Bar */}
            <div className="search-panel p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2 max-w-2xl">
              <div className="flex items-center space-x-2 px-3 text-gray-400 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-100 py-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                <input type="text" placeholder="Delivery address" defaultValue="742 Evergreen Terr." className="text-sm font-medium text-gray-800 w-full focus:outline-none bg-transparent" />
              </div>
              <div className="flex items-center space-x-2 px-3 text-gray-400 w-full md:w-2/3 py-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input type="text" placeholder="What are you craving?" className="text-sm font-medium text-gray-800 w-full focus:outline-none bg-transparent" />
              </div>
              <button 
                onClick={() => navigate('/restaurants')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3.5 rounded-xl w-full md:w-auto transition flex items-center justify-center space-x-2 shadow-md"
              >
                <span>Browse</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="rounded-[2rem] overflow-hidden rotate-2 shadow-2xl border-8 border-white/10">
              <img src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85" alt="Fresh bowl prepared for delivery" className="w-full aspect-[4/5] object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-8 bg-white text-gray-900 rounded-2xl p-4 shadow-xl flex items-center gap-3">
              <span className="w-9 h-9 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center"><Star className="w-5 h-5 fill-current" /></span><span className="text-sm font-bold">4.9 average<br /><span className="text-gray-400 font-normal">from hungry neighbors</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurants */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-bold mb-2">Nearby kitchens</p>
            <h2 className="text-2xl font-bold text-gray-900">Choose a restaurant</h2>
          </div>
          <button onClick={() => navigate('/restaurants')} className="text-sm font-bold text-orange-600 hidden sm:block">View all <ArrowRight className="w-4 h-4 inline ml-1" /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {restaurants.slice(0, 8).map((restaurant) => (
            <button
              key={restaurant.id}
              type="button"
              onClick={() => navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } })}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-lg group"
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_RESTAURANT_IMAGE; }}
                className="w-full h-40 object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition">{restaurant.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{restaurant.cuisine || restaurant.tags?.[0] || 'Local favorites'}</p>
                <p className="text-xs text-gray-400 mt-3">{restaurant.deliveryTime || '20-30 min'} · {restaurant.rating || 4.8} stars</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Value Propositions */}
      <section className="feature-band max-w-7xl mx-auto px-6 py-10 rounded-[2rem]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Fast Delivery</h3>
            <p className="text-sm text-gray-500">Average delivery time is under 30 minutes straight to your location.</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-green-100 text-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Quality Verified</h3>
            <p className="text-sm text-gray-500">Every restaurant on our platform passes strict health and hygiene checks.</p>
          </div>
          <div className="space-y-2">
            <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg">Live Tracking</h3>
            <p className="text-sm text-gray-500">Monitor your meal prep in real-time from kitchen to delivery partner.</p>
          </div>
        </div>
      </section>
    </div>
  );
};