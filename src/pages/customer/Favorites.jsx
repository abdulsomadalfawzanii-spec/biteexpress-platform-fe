import { Heart, Star, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlatform } from '../../context/PlatformContext';
import { API_ORIGIN } from '../../services/api';

const FALLBACK_RESTAURANT_IMAGE = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85';

const resolveImage = (image) => {
  if (!image) return FALLBACK_RESTAURANT_IMAGE;
  return image.startsWith('/') ? `${API_ORIGIN}${image}` : image;
};

export const Favorites = () => {
  const navigate = useNavigate();
  const { restaurants, favorites, toggleFavorite } = usePlatform();
  const saved = restaurants.filter((restaurant) => favorites.includes(restaurant.id));
  return <div className="max-w-6xl mx-auto px-4 py-10 space-y-8"><div><p className="text-xs uppercase tracking-[0.18em] text-orange-500 font-bold mb-2">Saved for later</p><h1 className="text-3xl font-bold text-gray-900">Favorite kitchens</h1><p className="text-gray-500 mt-2">Your reliable answers to the question, “what should we eat?”</p></div>{saved.length === 0 ? <div className="bg-white rounded-3xl p-12 text-center border border-gray-100"><Heart className="w-10 h-10 text-orange-300 mx-auto mb-3" /><p className="font-bold text-gray-900">No favorites yet</p><button onClick={() => navigate('/restaurants')} className="mt-5 text-orange-500 font-bold">Explore kitchens <ArrowRight className="inline w-4 h-4" /></button></div> : <div className="grid md:grid-cols-2 gap-6">{saved.map((restaurant) => <article key={restaurant.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100"><img src={resolveImage(restaurant.image)} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = FALLBACK_RESTAURANT_IMAGE; }} alt={restaurant.name} className="h-48 w-full object-cover" /><div className="p-5"><div className="flex justify-between gap-4"><div><h2 className="font-bold text-xl text-gray-900">{restaurant.name}</h2><p className="text-sm text-gray-500 mt-1">{restaurant.cuisine} · {restaurant.tags.join(' · ')}</p></div><button onClick={() => toggleFavorite(restaurant.id)} className="text-orange-500" title="Remove favorite"><Heart className="w-5 h-5 fill-current" /></button></div><div className="flex items-center gap-4 text-xs text-gray-500 mt-5"><span className="flex items-center gap-1"><Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {restaurant.rating}</span><span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {restaurant.deliveryTime}</span><button onClick={() => navigate(`/restaurant/${restaurant.id}`, { state: { restaurant } })} className="ml-auto text-orange-500 font-bold">View menu <ArrowRight className="inline w-4 h-4" /></button></div></div></article>)}</div>}</div>;
};
