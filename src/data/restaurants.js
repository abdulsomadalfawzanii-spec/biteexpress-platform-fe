export const restaurants = [
  { id: 'v1', name: 'Artisan Burger Co.', description: 'Small-batch burgers, crisp fries, and house-made sauces.', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScgN0ny1u6K14Zk4oWKj9xhxZVSbz6WLN00XZbDYV0I2PS1xFT6xya82Zf&s=10', rating: 4.8, reviewsCount: 320, deliveryTime: '20-30 min', deliveryFee: 2.99, distance: '0.8 mi', minOrder: 15, cuisine: 'American', tags: ['Burgers', 'Comfort food'], isOpen: true },
  { id: 'v2', name: 'Suki Roll Sushi', description: 'Bright, precise sushi made fresh to order.', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=900&q=80', rating: 4.9, reviewsCount: 450, deliveryTime: '30-45 min', deliveryFee: 1.99, distance: '1.4 mi', minOrder: 20, cuisine: 'Japanese', tags: ['Sushi', 'Healthy'], isOpen: true },
  { id: 'v3', name: 'La Bella Italia', description: 'Hand-stretched pizza, slow-simmered sauces, and Italian warmth.', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=900&q=80', rating: 4.6, reviewsCount: 210, deliveryTime: '25-40 min', deliveryFee: 0, distance: '2.1 mi', minOrder: 18, cuisine: 'Italian', tags: ['Pizza', 'Pasta'], isOpen: true }
];

export const categories = [
  { id: 'burgers', name: 'Burgers', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=240&q=85', cuisine: 'American' },
  { id: 'pizza', name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=240&q=85', cuisine: 'Italian' },
  { id: 'sushi', name: 'Sushi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=240&q=85', cuisine: 'Japanese' },
  { id: 'healthy', name: 'Healthy', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=240&q=85', cuisine: 'Healthy' },
  { id: 'desserts', name: 'Desserts', image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=240&q=85', cuisine: 'Desserts' }
];
