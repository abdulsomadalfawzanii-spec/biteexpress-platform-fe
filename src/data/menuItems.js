const images = {
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
  chicken: 'https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=400&q=80',
  fries: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
  sushi: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80',
  pizza: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80'
};

export const menuItems = [
  { id: 'm1', vendorId: 'v1', name: 'Truffle Smash Burger', description: 'Double smash patty, truffle mayo, caramelized onions, Swiss cheese.', price: 14.99, category: 'Burgers', rating: 4.9, isAvailable: true, image: images.burger },
  { id: 'm2', vendorId: 'v1', name: 'Spicy Crispy Chicken Burger', description: 'Crispy chicken, jalapeno slaw, chipotle aioli, pickles.', price: 12.99, category: 'Burgers', rating: 4.7, isAvailable: true, image: images.chicken },
  { id: 'm3', vendorId: 'v1', name: 'Garlic Parmesan Fries', description: 'Hand-cut fries with garlic, parsley, and aged parmesan.', price: 5.49, category: 'Sides', rating: 4.8, isAvailable: true, image: images.fries },
  { id: 'm4', vendorId: 'v2', name: 'Salmon Signature Roll', description: 'Fresh salmon, avocado, cucumber, and sesame.', price: 16.5, category: 'Sushi', rating: 4.9, isAvailable: true, image: images.sushi },
  { id: 'm5', vendorId: 'v2', name: 'Suki Rainbow Platter', description: 'A chef-selected assortment of twelve beautiful pieces.', price: 24, category: 'Sushi', rating: 4.9, isAvailable: true, image: images.sushi },
  { id: 'm6', vendorId: 'v3', name: 'Burrata Margherita', description: 'San Marzano tomato, burrata, basil, and olive oil.', price: 17.5, category: 'Pizza', rating: 4.8, isAvailable: true, image: images.pizza },
  { id: 'm7', vendorId: 'v3', name: 'Spicy Calabrese Pizza', description: 'Spicy sausage, mozzarella, peppers, and hot honey.', price: 19, category: 'Pizza', rating: 4.7, isAvailable: true, image: images.pizza }
];

export const getMenuForVendor = (vendorId) => menuItems.filter((item) => item.vendorId === vendorId);
