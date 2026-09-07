import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Plus, Search, X, Edit2, Trash2, UtensilsCrossed,
  Clock, Tag, ChevronDown, ImagePlus, CheckCircle,
  AlertCircle, Loader2, SlidersHorizontal, RefreshCw,
} from 'lucide-react';
import { vendorService } from '../../services/vendorService';
import { formatCurrency } from '../../utils/currency';


const CATEGORIES = ['All', 'Burgers', 'Chicken', 'Pizza', 'Sides', 'Salads', 'Beverages', 'Desserts', 'Breakfast', 'Vegan'];
const ITEM_CATEGORIES = CATEGORIES.filter((c) => c !== 'All');
const PREP_TIMES = [5, 10, 15, 20, 25, 30, 40, 45, 60];
const FALLBACK_IMG = 'https://i.pinimg.com/736x/b5/0d/22/b50d22aed638664f17fe53e43680d7c8.jpg';
const EMPTY_FORM = {
  name: '', category: 'Burgers', price: '', description: '',
  ingredients: '', prepTimeMinutes: 20, isAvailable: true, image: '',
};


const fieldCls = [
  'w-full mt-1.5 px-3.5 py-2.5 border border-[var(--line)] rounded-xl text-sm',
  'bg-[rgba(255,253,248,0.8)] text-[var(--ink)] placeholder:text-[var(--muted)]',
  'focus:outline-none focus:border-[#f19a75] focus:ring-4 focus:ring-[rgba(242,107,56,0.1)] transition',
].join(' ');

const labelCls = 'block text-[0.7rem] font-bold tracking-widest uppercase text-[var(--muted)]';


const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-[var(--line)] overflow-hidden animate-pulse">
    <div className="h-44 bg-[var(--canvas)]" />
    <div className="p-5 space-y-3">
      <div className="h-4 bg-[var(--canvas)] rounded-lg w-3/4" />
      <div className="h-3 bg-[var(--canvas)] rounded-lg w-1/3" />
      <div className="h-3 bg-[var(--canvas)] rounded-lg w-full" />
      <div className="h-3 bg-[var(--canvas)] rounded-lg w-5/6" />
    </div>
    <div className="px-5 pb-5 flex justify-between">
      <div className="h-7 w-20 bg-[var(--canvas)] rounded-xl" />
      <div className="h-7 w-16 bg-[var(--canvas)] rounded-xl" />
    </div>
  </div>
);


const AvailPill = ({ isAvailable, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.68rem] font-bold transition-all ${
      isAvailable
        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
        : 'bg-red-50 text-red-600 hover:bg-red-100'
    }`}
  >
    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isAvailable ? 'bg-emerald-500' : 'bg-red-400'}`} />
    {isAvailable ? 'In Stock' : 'Out of Stock'}
  </button>
);


const Field = ({ label: lbl, children, className = '' }) => (
  <div className={className}>
    <label className={labelCls}>{lbl}</label>
    {children}
  </div>
);


export const MenuManagement = () => {
  const [menuItems, setMenuItems]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [saving, setSaving]         = useState(false);
  const [saveError, setSaveError]   = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData]       = useState(EMPTY_FORM);
  const [search, setSearch]               = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const firstFieldRef = useRef(null);

  
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return menuItems.filter((item) => {
      const matchCat = activeCategory === 'All' || item.category === activeCategory;
      const matchQ = !q || item.name?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q) || item.category?.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [menuItems, search, activeCategory]);

  const catCounts = useMemo(() => {
    const counts = { All: menuItems.length };
    menuItems.forEach((i) => { counts[i.category] = (counts[i.category] || 0) + 1; });
    return counts;
  }, [menuItems]);

  const totalItems     = menuItems.length;
  const availableCount = menuItems.filter((i) => i.isAvailable ?? i.availability ?? true).length;

  
  const loadMenu = async () => {
    try { setLoading(true); setError('');
      const res = await vendorService.getMenu();
      setMenuItems(Array.isArray(res) ? res : res?.data || []);
    } catch (err) { setError(err.message || 'Unable to load menu items.'); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    const timer = setTimeout(loadMenu, 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isModalOpen) { const t = setTimeout(() => firstFieldRef.current?.focus(), 80); return () => clearTimeout(t); }
  }, [isModalOpen]);

  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const openModal = (item = null) => {
    setSaveError('');
    if (item) {
      setEditingItem(item);
      const raw = item.ingredients;
      setFormData({
        name:            item.name || '',
        category:        item.category || 'Burgers',
        price:           String(item.price ?? ''),
        description:     item.description || '',
        ingredients:     Array.isArray(raw) ? raw.join(', ') : (raw || ''),
        prepTimeMinutes: item.prepTimeMinutes ?? item.preparationTime ?? 20,
        isAvailable:     item.isAvailable ?? item.availability ?? true,
        image:           item.image || item.imageUrl || '',
      });
    } else {
      setEditingItem(null);
      setFormData(EMPTY_FORM);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingItem(null); setSaveError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError(''); setSaving(true);
    const ingredientsArray = formData.ingredients
      ? formData.ingredients.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    const payload = {
      name:            formData.name.trim(),
      category:        formData.category,
      price:           Number(formData.price),
      description:     formData.description.trim(),
      ingredients:     ingredientsArray,
      prepTimeMinutes: Number(formData.prepTimeMinutes),
      preparationTime: Number(formData.prepTimeMinutes),
      availability:    formData.isAvailable,
      isAvailable:     formData.isAvailable,
      image:           formData.image.trim(),
    };
    try {
      if (editingItem) {
        await vendorService.updateMenuItem(editingItem._id || editingItem.id, payload);
      } else {
        await vendorService.createMenuItem(payload);
      }
      closeModal();
      await loadMenu();
    } catch (err) {
      setSaveError(err.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this item from your menu? This cannot be undone.')) return;
    try { await vendorService.deleteMenuItem(id); await loadMenu(); }
    catch (err) { setError(err.message || 'Failed to delete menu item.'); }
  };

  const toggleAvailability = async (item) => {
    const current = item.isAvailable ?? item.availability ?? true;
    try {
      await vendorService.updateMenuItem(item._id || item.id, {
        ...item,
        availability: !current,
        isAvailable: !current,
        price: Number(item.price),
      });
      await loadMenu();
    } catch (err) { setError(err.message || 'Failed to update availability.'); }
  };

  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-w-0">

      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
        <div className="min-w-0">
          <p className="eyebrow">Vendor Portal</p>
          <h1 className="page-title">Menu Editor</h1>
          <p className="page-description">Manage your dishes, set prices, and control availability in real time.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button onClick={loadMenu} title="Refresh menu" className="p-2.5 rounded-xl border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] transition">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button onClick={() => openModal()} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-3 rounded-xl shadow-sm transition">
            <Plus className="w-4 h-4" />
            Add New Dish
          </button>
        </div>
      </div>

      
      {!loading && !error && totalItems > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {[
            { label: 'Total Items', value: totalItems, color: 'bg-orange-50 text-[var(--orange-deep)]' },
            { label: 'In Stock', value: availableCount, color: 'bg-emerald-50 text-emerald-700' },
            { label: 'Out of Stock', value: totalItems - availableCount, color: 'bg-red-50 text-red-600' },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${s.color}`}>
              <span className="font-bold text-base">{s.value}</span>
              <span className="font-medium opacity-80">{s.label}</span>
            </div>
          ))}
        </div>
      )}

     
      <div className="flex flex-col gap-3 mb-6 min-w-0">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
          <input
            type="text"
            placeholder="Search dishes by name, category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 border border-[var(--line)] rounded-xl text-sm bg-white text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:border-[#f19a75] focus:ring-4 focus:ring-[rgba(242,107,56,0.1)] transition"
          />
          {search && (
            <button onClick={() => setSearch('')} aria-label="Clear search" className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--ink)] transition">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        
        <div className="flex items-center gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto pb-1 scrollbar-none">
          <SlidersHorizontal className="w-4 h-4 text-[var(--muted)] shrink-0 hidden sm:block" />
          {CATEGORIES.map((cat) => {
            const count  = catCounts[cat] ?? 0;
            const active = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap ${
                  active
                    ? 'bg-[var(--orange)] text-white border-[var(--orange)] shadow-sm'
                    : 'bg-white text-[var(--muted)] border-[var(--line)] hover:border-[#f19a75] hover:text-[var(--orange-deep)]'
                }`}
              >
                {cat}
                {count > 0 && (
                  <span className={`text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-white/25 text-white' : 'bg-[var(--canvas)] text-[var(--muted)]'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      
      {!loading && !error && (search || activeCategory !== 'All') && (
        <p className="text-xs text-[var(--muted)] mb-4 font-medium">
          {filtered.length === 0 ? 'No items match your filters.'
            : `Showing ${filtered.length} of ${totalItems} item${totalItems !== 1 ? 's' : ''}`}
        </p>
      )}

      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>

      ) : error ? (
        <div className="flex flex-col items-center justify-center gap-4 min-h-64 bg-white rounded-2xl border border-red-100 p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-[var(--ink)]">Something went wrong</p>
            <p className="text-sm text-[var(--muted)] mt-1">{error}</p>
          </div>
          <button onClick={loadMenu} className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-xl transition">Try Again</button>
        </div>

      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-5 min-h-72 bg-white rounded-2xl border border-dashed border-[var(--line)] p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-[var(--orange)] flex items-center justify-center">
            <UtensilsCrossed className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--ink)]" style={{ fontFamily: 'Fraunces, Georgia, serif' }}>
              {search || activeCategory !== 'All' ? 'No items found' : 'Your menu is empty'}
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1.5 max-w-xs mx-auto">
              {search || activeCategory !== 'All'
                ? 'Try adjusting your search or clearing the category filter.'
                : 'Start building your menu by adding your first dish.'}
            </p>
          </div>
          {!search && activeCategory === 'All' ? (
            <button onClick={() => openModal()} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition shadow-sm">
              <Plus className="w-4 h-4" /> Add First Dish
            </button>
          ) : (
            <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="text-sm font-semibold text-[var(--orange-deep)] hover:underline">
              Clear filters
            </button>
          )}
        </div>

      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => {
            const id             = item._id || item.id;
            const isAvailable    = item.isAvailable ?? item.availability ?? true;
            const prepTime       = item.prepTimeMinutes ?? item.preparationTime ?? null;
            const rawIngredients = item.ingredients;
            const ingredientsList = Array.isArray(rawIngredients)
              ? rawIngredients
              : rawIngredients
              ? String(rawIngredients).split(',').map((s) => s.trim()).filter(Boolean)
              : [];

            return (
              <article
                key={id}
                className="group bg-white rounded-2xl border border-[var(--line)] shadow-[var(--shadow-soft)] overflow-hidden flex flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_56px_rgba(62,48,30,0.13)]"
              >
               
                <div className="relative h-44 w-full bg-[var(--canvas)] overflow-hidden shrink-0">
                  <img
                    src={item.image || item.imageUrl || FALLBACK_IMG}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }}
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-black/55 text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                    <Tag className="w-2.5 h-2.5 shrink-0" />{item.category}
                  </span>
                  {prepTime != null && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 bg-black/55 text-white text-[0.65rem] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      <Clock className="w-2.5 h-2.5 shrink-0" />{prepTime} min
                    </span>
                  )}
                </div>

                
                <div className="p-4 flex flex-col flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-[var(--ink)] text-[0.95rem] leading-snug line-clamp-1 min-w-0">{item.name}</h3>
                    <span className="font-extrabold text-[var(--orange)] text-[0.95rem] shrink-0">{formatCurrency(item.price)}</span>
                  </div>

                  <p className="text-[var(--muted)] text-xs leading-relaxed line-clamp-2 mb-3 flex-1">
                    {item.description || 'No description provided.'}
                  </p>

                  {ingredientsList.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {ingredientsList.slice(0, 3).map((ing) => (
                        <span key={ing} className="text-[0.6rem] font-semibold px-2 py-0.5 bg-[var(--canvas)] text-[var(--muted)] rounded-md border border-[var(--line)] max-w-[7rem] truncate">{ing}</span>
                      ))}
                      {ingredientsList.length > 3 && (
                        <span className="text-[0.6rem] font-semibold px-2 py-0.5 bg-[var(--canvas)] text-[var(--muted)] rounded-md border border-[var(--line)]">+{ingredientsList.length - 3}</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-[var(--line)] mt-auto">
                    <AvailPill isAvailable={isAvailable} onClick={() => toggleAvailability(item)} />
                    <div className="flex items-center gap-1">
                      <button onClick={() => openModal(item)} title="Edit item" className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--orange-deep)] hover:bg-orange-50 transition">
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(id)} title="Delete item" className="p-2 rounded-lg text-[var(--muted)] hover:text-red-600 hover:bg-red-50 transition">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

     
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-5"
          onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <form
            onSubmit={handleSubmit}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[92vh]"
          >
           
            <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--line)] shrink-0">
              <div>
                <p className="text-[0.65rem] font-bold tracking-widest uppercase text-[var(--orange-deep)]">
                  {editingItem ? 'Edit Item' : 'New Item'}
                </p>
                <h2 id="modal-title" className="text-lg font-bold text-[var(--ink)] mt-0.5 truncate max-w-[18rem]">
                  {editingItem ? `Editing "${editingItem.name}"` : 'Add a New Dish'}
                </h2>
              </div>
              <button type="button" onClick={closeModal} aria-label="Close modal"
                className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--canvas)] transition shrink-0 ml-3">
                <X className="w-5 h-5" />
              </button>
            </div>

            
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 space-y-5">

              
              <div className="relative w-full h-40 sm:h-48 rounded-xl overflow-hidden bg-[var(--canvas)] border border-[var(--line)]">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = FALLBACK_IMG; }} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--muted)]">
                    <ImagePlus className="w-8 h-8 opacity-40" />
                    <span className="text-xs font-medium">Image preview will appear here</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-3.5">
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Paste an image URL…"
                    className="w-full px-3 py-2 rounded-lg text-xs bg-white/90 border border-white/20 text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--orange)]"
                  />
                </div>
              </div>

              
              <Field label="Dish Name *">
                <input ref={firstFieldRef} type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="e.g. Smoky Bacon Cheeseburger" className={fieldCls} />
              </Field>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Category *">
                  <div className="relative">
                    <select name="category" value={formData.category} onChange={handleInputChange} className={`${fieldCls} appearance-none pr-9`}>
                      {ITEM_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                  </div>
                </Field>

                <Field label="Price (NGN) *">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[var(--muted)] select-none">₦</span>
                    <input type="number" name="price" required min="0" step="0.01" value={formData.price} onChange={handleInputChange} placeholder="0.00" className={`${fieldCls} pl-7`} />
                  </div>
                </Field>
              </div>

              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Preparation Time *">
                  <div className="relative">
                    <select name="prepTimeMinutes" value={formData.prepTimeMinutes} onChange={handleInputChange} className={`${fieldCls} appearance-none pr-9`}>
                      {PREP_TIMES.map((t) => <option key={t} value={t}>{t} minutes</option>)}
                    </select>
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)] pointer-events-none" />
                  </div>
                </Field>

                <Field label="Availability">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, isAvailable: !p.isAvailable }))}
                    className={`mt-1.5 w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                      formData.isAvailable
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${formData.isAvailable ? 'bg-emerald-500' : 'bg-red-400'}`} />
                      <span className="truncate">{formData.isAvailable ? 'Available — In Stock' : 'Unavailable — Out of Stock'}</span>
                    </span>
                    <span className="text-[0.65rem] opacity-55 shrink-0 ml-2">tap to toggle</span>
                  </button>
                </Field>
              </div>

              
              <Field label="Description *">
                <textarea name="description" required rows={3} value={formData.description} onChange={handleInputChange} placeholder="Describe the dish — cooking style, flavours, what makes it special…" className={`${fieldCls} resize-none`} />
              </Field>

              
              <Field label="Ingredients">
                <input type="text" name="ingredients" value={formData.ingredients} onChange={handleInputChange} placeholder="e.g. Beef patty, Cheddar, Lettuce, Tomato, Brioche bun" className={fieldCls} />
                <p className="mt-1.5 text-[0.7rem] text-[var(--muted)]">Separate each ingredient with a comma. They appear as tags on your menu card.</p>
              </Field>

              
              {saveError && (
                <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{saveError}</span>
                </div>
              )}
            </div>

            
            <div className="px-6 py-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 border-t border-[var(--line)] shrink-0 bg-white">
              <button type="button" onClick={closeModal} disabled={saving} className="px-5 py-2.5 rounded-xl border border-[var(--line)] text-[var(--ink)] font-semibold text-sm hover:bg-[var(--canvas)] transition disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition shadow-sm disabled:opacity-70">
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Saving…</>
                ) : (
                  <><CheckCircle className="w-4 h-4" />{editingItem ? 'Save Changes' : 'Add to Menu'}</>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
