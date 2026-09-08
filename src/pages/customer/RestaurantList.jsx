import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Heart, Star, Clock, Search, SlidersHorizontal } from 'lucide-react';
import { usePlatform } from '../../context/PlatformContext';
import { PageHeader } from '../../components/ui';
import { restaurantService } from '../../services/restaurantService';
import { API_ORIGIN } from '../../services/api';
import { formatCurrency } from '../../utils/currency';

const FALLBACK_RESTAURANT_IMAGE = 'https://i.pinimg.com/736x/c3/f8/ce/c3f8ce420f5299c173e57c79f452d51d.jpg';

const resolveImage = (image) => {
  if (!image) return FALLBACK_RESTAURANT_IMAGE;
  return image.startsWith('/') ? `${API_ORIGIN}${image}` : image;
};

const normalizeRestaurant = (restaurant) => ({
  ...restaurant,
  id: restaurant?._id || restaurant?.id,
  name: restaurant?.name || restaurant?.restaurantName || 'Restaurant',
  image: resolveImage(restaurant?.image || restaurant?.coverImage || restaurant?.user?.profileImage),
});

export const RestaurantList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState('recommended');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { favorites, toggleFavorite } = usePlatform();

  useEffect(() => {
    const loadRestaurants = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await restaurantService.getRestaurants({ search: searchTerm, category, sort });
        const records = Array.isArray(data) ? data : data?.restaurants || data || [];
        setRestaurants(records.map(normalizeRestaurant));
      } catch (err) {
        setError(err.message || 'Unable to load restaurants.');
      } finally {
        setLoading(false);
      }
    };

    loadRestaurants();
  }, [searchTerm, category, sort]);
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader eyebrow="Curated nearby" title="Find your next favorite kitchen" description="Fresh menus, trusted ratings, and delivery that fits your evening." />

        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search restaurants or cuisines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <SlidersHorizontal className="w-4 h-4 text-orange-500" />
        <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"><option>All</option><option>Burgers</option><option>Pizza</option><option>Sushi</option><option>Healthy</option></select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm"><option value="recommended">Recommended</option><option value="rating">Top rated</option><option value="fee">Lowest delivery fee</option></select>
        <span className="text-sm text-gray-400 ml-auto">{restaurants.length} kitchens</span>
      </div>

      {loading ? <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center text-gray-500">Loading kitchens...</div> : error ? <div className="bg-red-50 border border-red-200 text-red-700 rounded-3xl p-6 text-center">{error}</div> : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant.id || restaurant._id} 
              onClick={() => navigate(`/restaurant/${restaurant.id || restaurant._id}`, { state: { restaurant } })}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={FALLBACK_RESTAURANT_IMAGE}
                  alt={restaurant.name} 
                  onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_RESTAURANT_IMAGE; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <button onClick={(event) => { event.stopPropagation(); toggleFavorite(restaurant.id || restaurant._id); }} className="absolute top-3 left-3 bg-white/90 p-2 rounded-full text-orange-500" aria-label="Toggle favorite"><Heart className="w-4 h-4" fill={favorites.includes(restaurant.id || restaurant._id) ? 'currentColor' : 'none'} /></button>
                <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm font-bold text-xs px-2.5 py-1 rounded-full text-gray-800 flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  {restaurant.rating || 4.8} ({restaurant.reviewsCount || 0})
                </span>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-500 transition">{restaurant.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{restaurant.cuisine || restaurant.tags?.[0] || 'Cuisine'} · {restaurant.distance || '0.8 mi'}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-50">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{restaurant.deliveryTime || '20-30 min'}</span>
                  </span>
                  <span>{formatCurrency(restaurant.deliveryFee || 2.99)} delivery · {restaurant.deliveryTime || '20-30 min'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading && !error && restaurants.length === 0 && <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center"><Search className="w-10 h-10 text-orange-300 mx-auto mb-3" /><h2 className="font-bold text-gray-900">No kitchens match that search</h2><p className="text-sm text-gray-500 mt-2">Try another cuisine or clear the filters.</p></div>}
    </div>
  );
};