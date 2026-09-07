import { useState } from 'react';
import {
  CreditCard,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

import { orderService } from '../../services/orderService';
import { paymentService } from '../../services/paymentService';
import { formatCurrency } from '../../utils/currency';

export const Cart = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    tax,
    total,
    clearCart,
  } = useCart();

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [error, setError] =
    useState('');

  const navigate =
    useNavigate();

  const { user } =
    useAuth();

  const [deliveryAddress, setDeliveryAddress] =
    useState(user?.address || '');

  /* =======================================================
     PLACE ORDER
  ======================================================= */

  const handlePayment = async (
    event
  ) => {
    event.preventDefault();

    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      setError(
        'Your cart is empty.'
      );
      return;
    }

    const trimmedAddress = deliveryAddress.trim();
    if (!trimmedAddress) {
      setError('Please enter a delivery address.');
      return;
    }

    const vendorId =
      cartItems[0]?.vendorId;

    if (!vendorId) {
      setError(
        'The restaurant information for this cart is missing.'
      );
      return;
    }

    /*
     * Make sure every item belongs
     * to the same restaurant.
     */
    const differentVendor =
      cartItems.some(
        (item) =>
          String(item.vendorId) !==
          String(vendorId)
      );

    if (differentVendor) {
      setError(
        'Your cart contains items from different restaurants. Please clear the cart and try again.'
      );
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        vendor: vendorId,

        vendorId: vendorId,

        items: cartItems.map(
          (item) => ({
            menuItem:
              item.menuItem ||
              item.id,

            name:
              item.name,

            quantity:
              Number(
                item.quantity
              ),

            price:
              Number(
                item.price
              ),
          })
        ),

        deliveryAddress:
          trimmedAddress,

        customerNote:
          'Delivery instructions not provided',

        subtotal:
          Number(subtotal.toFixed(2)),

        deliveryFee:
          Number(
            deliveryFee.toFixed(2)
          ),

        tax:
          Number(
            tax.toFixed(2)
          ),

        total:
          Number(
            total.toFixed(2)
          ),
      };

      console.log(
        'Creating order with payload:',
        payload
      );

      const response =
        await orderService.create(
          payload
        );

      const createdOrder =
        response?.order ||
        response?.data ||
        response;

      if (
        !createdOrder ||
        !(
          createdOrder._id ||
          createdOrder.id
        )
      ) {
        throw new Error(
          'The order was not created successfully.'
        );
      }

      clearCart();

      const confirmationOrder = {
        id: createdOrder._id || createdOrder.id,
        vendorId: createdOrder.vendor?._id || createdOrder.vendorId || vendorId,
        vendorName: createdOrder.vendor?.restaurantName || cartItems[0]?.vendorName || 'Restaurant',
        total: Number(createdOrder.total ?? total),
        status: createdOrder.orderStatus || createdOrder.status || 'pending',
        items: cartItems,
      };

      try {
        const payment = await paymentService.createCheckoutSession({
          orderId: confirmationOrder.id,
        });

        if (payment?.url) {
          window.location.assign(payment.url);
          return;
        }
      } catch (paymentError) {
        if (!paymentError.message.includes('Stripe is not configured')) {
          console.warn('Stripe unavailable; continuing with automatic order:', paymentError);
        }
      }

      navigate('/order-confirmation', { state: { order: confirmationOrder } });
    } catch (err) {
      console.error(
        'Order creation failed:',
        err
      );

      setError(
        err?.message ||
          'Unable to create your order. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  /* =======================================================
     EMPTY CART
  ======================================================= */

  if (
    cartItems.length === 0
  ) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Your cart is empty
          </h2>

          <p className="text-gray-500 mb-6">
            Looks like you haven't
            added anything from the
            menu yet.
          </p>

          <button
            onClick={() =>
              navigate(
                '/restaurants'
              )
            }
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition"
          >
            Explore Restaurants
          </button>
        </div>
      </div>
    );
  }

  /* =======================================================
     CART
  ======================================================= */

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Your Cart
        </h1>

        <p className="text-gray-500 mt-1">
          Review your items and
          place your order.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* =================================================
            ITEMS
        ================================================= */}

        <div className="lg:col-span-7 space-y-4">
          {cartItems.map(
            (item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-wrap sm:flex-nowrap items-center gap-4 shadow-sm"
              >
                <img
                  src={
                    item.image ||
                    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=300&q=80'
                  }
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />

                <div className="flex-1 min-w-[180px]">
                  <h3 className="font-semibold text-gray-900">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-400">
                    {item.vendorName}
                  </p>

                  <p className="font-bold text-orange-500 mt-1">
                    {formatCurrency(item.price)}
                  </p>
                </div>

                {/* Quantity */}

                <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        -1
                      )
                    }
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <span className="font-semibold min-w-[20px] text-center">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        1
                      )
                    }
                    className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Remove */}

                <button
                  type="button"
                  onClick={() =>
                    removeFromCart(
                      item.id
                    )
                  }
                  className="text-gray-400 hover:text-red-500 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            )
          )}
        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-5">
              Order Summary
            </h2>

            <div className="mb-5 p-3 bg-orange-50 rounded-xl">
              <p className="text-sm text-orange-700">
                Restaurant
              </p>

              <p className="font-semibold text-orange-900">
                {
                  cartItems[0]
                    ?.vendorName
                }
              </p>
            </div>

            <form
              onSubmit={
                handlePayment
              }
              className="space-y-5"
            >

              <div>
                <label htmlFor="delivery-address" className="text-xs font-semibold text-gray-500 uppercase">
                  Delivery Address
                </label>

                <textarea
                  id="delivery-address"
                  required
                  value={deliveryAddress}
                  onChange={(event) => setDeliveryAddress(event.target.value)}
                  placeholder="Enter your full delivery address"
                  rows={3}
                  className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* CARDHOLDER */}

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Cardholder Name
                </label>

                <input
                  type="text"
                  required
                  defaultValue={
                    user?.name || ''
                  }
                  className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* CARD */}

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">
                  Card Information
                </label>

                <div className="mt-1 relative">
                  <input
                    type="text"
                    required
                    placeholder="4242 4242 4242 4242"
                    className="w-full p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500 pl-10"
                  />

                  <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                </div>
              </div>

              {/* EXPIRY + CVC */}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Expiry Date
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    CVC
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="CVC"
                    className="w-full mt-1 p-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* CALCULATIONS */}

              <div className="border-t border-gray-100 pt-4 space-y-3">

                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Subtotal
                  </span>

                  <span>
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Delivery Fee
                  </span>

                  <span>
                    {formatCurrency(deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Tax
                  </span>

                  <span>
                    {formatCurrency(tax)}
                  </span>
                </div>

                <div className="flex justify-between font-bold text-gray-900 text-lg pt-3 border-t border-gray-100">
                  <span>
                    Total
                  </span>

                  <span className="text-orange-500">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-xl">
                  {error}
                </div>
              )}

              {/* PLACE ORDER */}

              <button
                type="submit"
                disabled={
                  isProcessing
                }
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>
                    Placing Order...
                  </span>
                ) : (
                  <>
                    <span>
                      Place Order {formatCurrency(total)}
                    </span>

                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-green-500" />

                <span>
                  Your order is sent
                  securely to the
                  backend.
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;