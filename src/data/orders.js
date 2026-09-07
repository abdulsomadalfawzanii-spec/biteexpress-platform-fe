export const orderStatuses = ['Order Placed', 'Order Confirmed', 'Preparing', 'Ready for Pickup', 'Picked Up', 'On The Way', 'Delivered'];

export const seedOrders = [
  { id: 'ORD-8921', customerId: 'u1', vendorId: 'v1', vendorName: 'Artisan Burger Co.', customerName: 'Alex Johnson', address: '742 Evergreen Terrace', total: 36.47, status: 'On The Way', createdAt: 'Today, 12:30 PM', items: [{ id: 'm1', name: 'Truffle Smash Burger', quantity: 2, price: 14.99 }, { id: 'm3', name: 'Garlic Parmesan Fries', quantity: 1, price: 5.49 }], driver: 'Marcus Vance', driverId: 'u3' },
  { id: 'ORD-8840', customerId: 'u1', vendorId: 'v1', vendorName: 'Artisan Burger Co.', customerName: 'Alex Johnson', address: '742 Evergreen Terrace', total: 19.98, status: 'Delivered', createdAt: 'Yesterday, 7:10 PM', items: [{ id: 'm2', name: 'Spicy Crispy Chicken Burger', quantity: 1, price: 12.99 }, { id: 'm3', name: 'Garlic Parmesan Fries', quantity: 1, price: 5.49 }] }
];
