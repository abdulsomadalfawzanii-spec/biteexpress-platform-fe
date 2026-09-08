import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Star, Clock, Plus, Check } from 'lucide-react';
import { restaurantService } from '../../services/restaurantService';
import { API_ORIGIN } from '../../services/api';
import { usePlatform } from '../../context/PlatformContext';
import { formatCurrency } from '../../utils/currency';

const FALLBACK_RESTAURANT_IMAGE = 'https://i.pinimg.com/736x/c3/f8/ce/c3f8ce420f5299c173e57c79f452d51d.jpg';
const FALLBACK_MENU_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';

const resolveImage = (image, fallback) => {
  if (!image) return fallback;
  return image.startsWith('/') ? `${API_ORIGIN}${image}` : image;
};

export const RestaurantDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart, cartItems } = useCart();
  const { restaurants } = usePlatform();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRestaurant = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await restaurantService.getById(id);
        const cachedRestaurant = location.state?.restaurant || restaurants.find(
          (entry) => String(entry.id || entry._id) === String(id)
        );
        setRestaurant({
          ...cachedRestaurant,
          ...data,
          image: data?.image || data?.coverImage || cachedRestaurant?.image || '',
        });
      } catch (err) {
        setError(err.message || 'Unable to load restaurant details.');
      } finally {
        setLoading(false);
      }
    };
    loadRestaurant();
  }, [id, location.state, restaurants]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Loading restaurant menu...</div>;
  if (error) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold">Restaurant unavailable</h1><p className="text-gray-500 mt-2">{error}</p></div>;
  if (!restaurant) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><h1 className="text-2xl font-bold">Restaurant not found</h1><p className="text-gray-500 mt-2">This kitchen may have moved.</p></div>;

  const menu = Array.isArray(restaurant.menu) ? restaurant.menu : [];

  return (
    <div className="space-y-8 pb-12">
      <div className="relative h-56 sm:h-64 md:h-80 w-full overflow-hidden">
        <img src={resolveImage(restaurant.image, FALLBACK_RESTAURANT_IMAGE)} alt={restaurant.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_RESTAURANT_IMAGE; }} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-6 w-full text-white space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs sm:text-sm">
              <span className="flex items-center space-x-1 font-semibold text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{restaurant.rating || 4.8}</span>
              </span>
              <span>•</span>
              <span>{restaurant.cuisine || 'Cuisine'} · {restaurant.tags?.join(' · ') || 'Popular'}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{restaurant.deliveryTime || '20-30 min'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Menu Items</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menu.map((item) => {
            const itemId = item.id || item._id;
            const restaurantId = restaurant.id || restaurant._id;
            const inCart = cartItems.some(i => String(i.id) === String(itemId));
            return (
              <div key={itemId} className="bg-white p-3 sm:p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-3 sm:gap-4 min-w-0">
                <img src={resolveImage(item.image, FALLBACK_MENU_IMAGE)} alt={item.name} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_MENU_IMAGE; }} className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0" />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 break-words">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                    <span className="font-bold text-orange-500">{formatCurrency(item.price)}</span>
                    <button 
                      onClick={() => addToCart({
                        ...item,
                        id: itemId,
                        vendorId: item.vendorId || item.vendor?._id || item.vendor || restaurantId,
                        vendorName: item.vendorName || item.vendor?.restaurantName || restaurant.name,
                      })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1 ${
                        inCart ? 'bg-green-100 text-green-700' : 'bg-orange-500 text-white hover:bg-orange-600'
                      }`}
                    >
                      {inCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Order</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};