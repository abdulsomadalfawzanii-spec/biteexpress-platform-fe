import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import { useAuth } from './AuthContext';
import { apiRequest } from '../services/api';
import { orderService } from '../services/orderService';
import { restaurantService } from '../services/restaurantService';
import { vendorService } from '../services/vendorService';
import { deliveryService } from '../services/deliveryService';
import { adminService } from '../services/adminService';

const PlatformContext = createContext(null);

/* =========================================================
   ORDER NORMALIZER
========================================================= */

const normalizeOrder = (
  order,
  fallbackVendorName = 'Restaurant'
) => ({
  id:
    order?._id ||
    order?.id ||
    `ORD-${Date.now()}`,

  status:
    order?.orderStatus ||
    order?.status ||
    'pending',

  orderStatus:
    order?.orderStatus ||
    order?.status ||
    'pending',

  vendorId:
    order?.vendor?._id ||
    order?.vendorId ||
    order?.vendor ||
    '',

  vendorName:
    order?.vendor?.restaurantName ||
    order?.vendorName ||
    fallbackVendorName,

  customerName:
    order?.customer?.name ||
    order?.customerName ||
    'Customer',

  customer:
    order?.customer?.name ||
    order?.customerName ||
    'Customer',

  address:
    order?.deliveryAddress ||
    order?.address ||
    '',

  total: Number(
    order?.total ??
      order?.totalAmount ??
      order?.amount ??
      0
  ),

  subtotal: Number(order?.subtotal || 0),

  deliveryFee: Number(order?.deliveryFee || 0),

  tax: Number(order?.tax || 0),

  items: Array.isArray(order?.items)
    ? order.items.map((item) => ({
        id:
          item?.menuItem?._id ||
          item?.menuItem ||
          item?.id ||
          item?.name,

        name:
          item?.menuItem?.name ||
          item?.name ||
          'Item',

        quantity: Number(item?.quantity || 1),

        price: Number(
          item?.price ||
            item?.menuItem?.price ||
            0
        ),

        image:
          item?.menuItem?.image ||
          item?.image ||
          '',
      }))
    : [],

  createdAt: order?.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : 'Recently',
});

/* =========================================================
   RESTAURANT NORMALIZER
========================================================= */

const normalizeRestaurant = (restaurant) => ({
  id:
    restaurant?._id ||
    restaurant?.id,

  _id:
    restaurant?._id ||
    restaurant?.id,

  name:
    restaurant?.name ||
    restaurant?.restaurantName ||
    'Restaurant',

  restaurantName:
    restaurant?.restaurantName ||
    restaurant?.name ||
    'Restaurant',

  cuisine:
    restaurant?.cuisine ||
    restaurant?.tags?.[0] ||
    restaurant?.cuisineTypes?.[0] ||
    'Cuisine',

  tags:
    restaurant?.tags ||
    restaurant?.cuisineTypes ||
    ['Popular'],

  image:
    restaurant?.image ||
    restaurant?.coverImage ||
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',

  rating: Number(
    restaurant?.rating || 4.8
  ),

  reviewsCount: Number(
    restaurant?.reviewsCount ||
      restaurant?.reviewCount ||
      restaurant?.numRatings ||
      0
  ),

  deliveryTime:
    restaurant?.deliveryTime ||
    '20-30 min',

  deliveryFee: Number(
    restaurant?.deliveryFee || 2.99
  ),

  distance:
    restaurant?.distance ||
    '0.8 mi',

  isOpen:
    restaurant?.isOpen ?? true,

  menu: Array.isArray(restaurant?.menu)
    ? restaurant.menu.map((item) => ({
        ...item,

        id:
          item?._id ||
          item?.id,

        _id:
          item?._id ||
          item?.id,

        name:
          item?.name ||
          'Food Item',

        price: Number(
          item?.price || 0
        ),

        image:
          item?.image ||
          item?.imageUrl ||
          '',

        isAvailable:
          item?.isAvailable ??
          item?.availability ??
          true,
      }))
    : [],

  approvalStatus:
    restaurant?.approvalStatus ||
    'approved',

  isApproved:
    restaurant?.isApproved ?? true,
});

/* =========================================================
   USER NORMALIZER
========================================================= */

const normalizeUser = (user) => ({
  id:
    user?._id ||
    user?.id,

  name:
    user?.name ||
    'User',

  email:
    user?.email ||
    '',

  role:
    user?.role ||
    'customer',

  status:
    user?.accountStatus ||
    'active',

  accountStatus:
    user?.accountStatus ||
    'active',

  phone:
    user?.phone ||
    '',

  address:
    user?.address ||
    '',
});

/* =========================================================
   PLATFORM PROVIDER
========================================================= */

export const PlatformProvider = ({
  children,
}) => {
  const { user } = useAuth();

  const [restaurants, setRestaurants] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [menuItems, setMenuItems] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [reviews, setReviews] =
    useState([]);

  const [notifications, setNotifications] =
    useState([]);

  const [favorites, setFavorites] =
    useState([]);

  const [vendorProfile, setVendorProfile] =
    useState(null);

  const [settings] =
    useState({
      commissionRate: 0.15,
      baseDeliveryFee: 3.99,
      taxRate: 0.0825,

      // Vendor approval is NOT required.
      requireVendorApproval: false,

      requireDeliveryVerification: true,
    });

  const [delivery, setDeliveryState] =
    useState({
      online: true,
      activeOrderId: null,
      completedToday: 0,
      earningsToday: 0,
      rating: 5,
    });

  const [metrics, setMetrics] =
    useState({
      totalUsers: 0,
      totalVendors: 0,
      totalDeliveryPersonnel: 0,
      totalOrders: 0,
      totalGrossRevenue: 0,
      platformCommissionEarned: 0,
    });

  /* =======================================================
     CUSTOMER DATA
  ======================================================= */

  const fetchCustomerData = async () => {
    try {
      const [
        restaurantPayload,
        orderPayload,
        favPayload,
        notificationPayload,
      ] = await Promise.all([
        restaurantService
          .getRestaurants()
          .catch((error) => {
            console.error(
              'Failed to load restaurants:',
              error
            );
            return [];
          }),

        orderService
          .listForCustomer()
          .catch((error) => {
            console.error(
              'Failed to load customer orders:',
              error
            );
            return [];
          }),

        apiRequest('/customer/favorites')
          .catch(() => []),

        apiRequest('/customer/notifications')
          .catch(() => []),
      ]);

      const normalizedRestaurants =
        Array.isArray(restaurantPayload)
          ? restaurantPayload.map(
              normalizeRestaurant
            )
          : Array.isArray(
              restaurantPayload?.restaurants
            )
          ? restaurantPayload.restaurants.map(
              normalizeRestaurant
            )
          : Array.isArray(
              restaurantPayload?.data
            )
          ? restaurantPayload.data.map(
              normalizeRestaurant
            )
          : [];

      const normalizedOrders =
        Array.isArray(orderPayload)
          ? orderPayload.map(normalizeOrder)
          : Array.isArray(
              orderPayload?.orders
            )
          ? orderPayload.orders.map(
              normalizeOrder
            )
          : Array.isArray(
              orderPayload?.data
            )
          ? orderPayload.data.map(
              normalizeOrder
            )
          : [];

      setRestaurants(
        normalizedRestaurants
      );

      setOrders(
        normalizedOrders
      );

      const favIds =
        Array.isArray(favPayload)
          ? favPayload
              .map(
                (favorite) =>
                  String(
                    favorite?.vendor?._id ||
                      favorite?.vendor ||
                      ''
                  )
              )
              .filter(Boolean)
          : Array.isArray(
              favPayload?.favorites
            )
          ? favPayload.favorites
              .map(
                (favorite) =>
                  String(
                    favorite?.vendor?._id ||
                      favorite?.vendor ||
                      ''
                  )
              )
              .filter(Boolean)
          : [];

      setFavorites(favIds);

      const customerNotifications = Array.isArray(notificationPayload)
        ? notificationPayload
        : notificationPayload?.notifications || [];
      setNotifications(customerNotifications);
    } catch (error) {
      console.error(
        'Failed to fetch customer platform data:',
        error
      );
    }
  };

  /* =======================================================
     VENDOR DATA
  ======================================================= */

  const fetchVendorData = async () => {
    try {
      const profile =
        await vendorService
          .getProfile()
          .catch((error) => {
            console.error(
              'Failed to load vendor profile:',
              error
            );

            return null;
          });

      if (profile) {
        setVendorProfile(profile);
      }

      const [
        menuPayload,
        orderPayload,
        analyticsPayload,
        notificationPayload,
      ] = await Promise.all([
        vendorService
          .getMenu()
          .catch((error) => {
            console.error(
              'Failed to load vendor menu:',
              error
            );

            return [];
          }),

        vendorService
          .getOrders()
          .catch((error) => {
            console.error(
              'Failed to load vendor orders:',
              error
            );

            return [];
          }),

        vendorService
          .getAnalytics()
          .catch((error) => {
            console.error(
              'Failed to load vendor analytics:',
              error
            );

            return null;
          }),

        vendorService
          .getNotifications()
          .catch((error) => {
            console.error(
              'Failed to load vendor notifications:',
              error
            );

            return [];
          }),
      ]);

      const normalizedMenu =
        Array.isArray(menuPayload)
          ? menuPayload.map((item) => ({
              ...item,

              id:
                item?._id ||
                item?.id,

              _id:
                item?._id ||
                item?.id,

              price: Number(
                item?.price || 0
              ),

              isAvailable:
                item?.isAvailable ??
                item?.availability ??
                true,

              availability:
                item?.availability ??
                item?.isAvailable ??
                true,

              image:
                item?.image ||
                item?.imageUrl ||
                '',
            }))
          : Array.isArray(
              menuPayload?.menu
            )
          ? menuPayload.menu.map(
              (item) => ({
                ...item,
                id:
                  item?._id ||
                  item?.id,
                price: Number(
                  item?.price || 0
                ),
                isAvailable:
                  item?.isAvailable ??
                  item?.availability ??
                  true,
              })
            )
          : [];

      const normalizedOrders =
        Array.isArray(orderPayload)
          ? orderPayload.map(
              (order) =>
                normalizeOrder(
                  order,
                  profile?.restaurantName ||
                    'Restaurant'
                )
            )
          : Array.isArray(
              orderPayload?.orders
            )
          ? orderPayload.orders.map(
              (order) =>
                normalizeOrder(
                  order,
                  profile?.restaurantName ||
                    'Restaurant'
                )
            )
          : [];

      setMenuItems(
        normalizedMenu
      );

      setOrders(
        normalizedOrders
      );

      if (Array.isArray(
        notificationPayload
      )) {
        setNotifications(
          notificationPayload
        );
      } else if (
        Array.isArray(
          notificationPayload?.notifications
        )
      ) {
        setNotifications(
          notificationPayload.notifications
        );
      }

      if (analyticsPayload) {
        const analytics =
          analyticsPayload?.data ||
          analyticsPayload;

        setMetrics((current) => ({
          ...current,
          ...analytics,
        }));
      }
    } catch (error) {
      console.error(
        'Failed to fetch vendor platform data:',
        error
      );
    }
  };

  /* =======================================================
     DELIVERY DATA
  ======================================================= */

  const fetchDeliveryData = async () => {
    try {
      const [
        availablePayload,
        myDeliveryPayload,
        earningsPayload,
      ] = await Promise.all([
        deliveryService
          .getAvailable()
          .catch(() => []),

        deliveryService
          .getMyDeliveries()
          .catch(() => []),

        deliveryService
          .getEarnings()
          .catch(() => null),
      ]);

      const backendOrders = [
        ...(Array.isArray(
          availablePayload
        )
          ? availablePayload
          : []),

        ...(Array.isArray(
          myDeliveryPayload
        )
          ? myDeliveryPayload
          : []),
      ];

      const uniqueOrders =
        backendOrders.filter(
          (order, index, array) =>
            array.findIndex(
              (item) =>
                String(
                  item?._id ||
                    item?.id
                ) ===
                String(
                  order?._id ||
                    order?.id
                )
            ) === index
        );

      setOrders(
        uniqueOrders.map(
          (order) =>
            normalizeOrder(
              order,
              order?.vendor
                ?.restaurantName ||
                'Restaurant'
            )
        )
      );

      setDeliveryState({
        online: true,

        activeOrderId:
          uniqueOrders[0]?._id ||
          uniqueOrders[0]?.id ||
          null,

        completedToday:
          earningsPayload?.totalDeliveries ??
          uniqueOrders.filter(
            (order) =>
              (
                order?.orderStatus ||
                order?.status
              ) === 'delivered'
          ).length,

        earningsToday:
          earningsPayload?.todayEarnings ??
          0,

        rating:
          earningsPayload?.rating ??
          5,
      });
    } catch (error) {
      console.error(
        'Failed to fetch delivery platform data:',
        error
      );
    }
  };

  /* =======================================================
     ADMIN DATA
  ======================================================= */

  const fetchAdminData = async () => {
    try {
      const [
        analyticsPayload,
        userPayload,
      ] = await Promise.all([
        adminService
          .getMetrics()
          .catch(() => null),

        adminService
          .getUsers()
          .catch(() => []),
      ]);

      if (analyticsPayload) {
        setMetrics(
          analyticsPayload?.data ||
            analyticsPayload
        );
      }

      const normalizedUsers =
        Array.isArray(userPayload)
          ? userPayload.map(
              normalizeUser
            )
          : Array.isArray(
              userPayload?.users
            )
          ? userPayload.users.map(
              normalizeUser
            )
          : [];

      setUsers(
        normalizedUsers
      );
    } catch (error) {
      console.error(
        'Failed to fetch admin platform data:',
        error
      );
    }
  };

  /* =======================================================
     LOAD DATA BASED ON ROLE
  ======================================================= */

  useEffect(() => {
    if (!user?.role) {
      queueMicrotask(() => {
        setOrders([]);
        setRestaurants([]);
        setUsers([]);
        setMenuItems([]);
        setReviews([]);
        setNotifications([]);
        setVendorProfile(null);
      });
      return;
    }

    queueMicrotask(() => {
      if (user.role === 'customer') {
        fetchCustomerData();
        return;
      }

      if (user.role === 'vendor') {
        fetchVendorData();
        return;
      }

      if (user.role === 'delivery') {
        fetchDeliveryData();
        return;
      }

      if (user.role === 'admin') {
        fetchAdminData();
      }
    });
  }, [
    user?.role,
    user?.id,
  ]);

  /* =======================================================
     UPDATE ORDER STATUS
  ======================================================= */

  const updateOrderStatus = async (
    id,
    status,
    note
  ) => {
    try {
      const response =
        await orderService.updateStatus(
          id,
          status,
          note
        );

      const updatedOrder =
        response?.order ||
        response;

      const newStatus =
        updatedOrder?.orderStatus ||
        updatedOrder?.status ||
        status;

      setOrders(
        (current) =>
          current.map(
            (order) =>
              String(order.id) ===
              String(id)
                ? {
                    ...order,
                    status: newStatus,
                    orderStatus:
                      newStatus,
                  }
                : order
          )
      );

      return updatedOrder;
    } catch (error) {
      console.error(
        'Failed to update order status:',
        error
      );

      throw error;
    }
  };

  /* =======================================================
     CREATE ORDER
  ======================================================= */

  const createOrder = async (
    payload
  ) => {
    try {
      const response =
        await orderService.create(
          payload
        );

      const created =
        response?.order ||
        response;

      const normalized =
        normalizeOrder(
          created,
          payload?.vendorName ||
            'Restaurant'
        );

      setOrders(
        (current) => [
          normalized,
          ...current,
        ]
      );

      return normalized;
    } catch (error) {
      console.error(
        'Failed to create order:',
        error
      );

      throw error;
    }
  };

  /* =======================================================
     FAVORITES
  ======================================================= */

  const toggleFavorite = async (
    vendorId
  ) => {
    try {
      const result =
        await apiRequest(
          '/customer/favorites',
          {
            method: 'POST',
            body: JSON.stringify({
              vendor: vendorId,
            }),
          }
        );

      setFavorites(
        (current) => {
          const exists =
            current.includes(
              String(vendorId)
            );

          return exists
            ? current.filter(
                (id) =>
                  id !==
                  String(vendorId)
              )
            : [
                ...current,
                String(vendorId),
              ];
        }
      );

      return result;
    } catch (error) {
      console.error(
        'Failed to toggle favorite:',
        error
      );

      throw error;
    }
  };

  /* =======================================================
     REVIEWS
  ======================================================= */

  const addReview = async (
    reviewPayload
  ) => {
    try {
      const created =
        await apiRequest(
          '/customer/reviews',
          {
            method: 'POST',
            body: JSON.stringify(
              reviewPayload
            ),
          }
        );

      const entry = {
        id:
          created?._id ||
          created?.id ||
          `review-${Date.now()}`,

        customer:
          reviewPayload?.customer ||
          user?.name ||
          'Customer',

        rating: Number(
          reviewPayload?.rating ||
            5
        ),

        text:
          reviewPayload?.comment ||
          reviewPayload?.text ||
          '',

        date: 'Just now',
      };

      setReviews(
        (current) => [
          entry,
          ...current,
        ]
      );

      return entry;
    } catch (error) {
      console.error(
        'Failed to add review:',
        error
      );

      throw error;
    }
  };

  /* =======================================================
     DELIVERY STATE
  ======================================================= */

  const setDelivery = (
    nextDelivery
  ) => {
    setDeliveryState(
      (current) => ({
        ...current,
        ...nextDelivery,
      })
    );
  };

  /* =======================================================
     USERS
  ======================================================= */

  const updateUser = (
    id,
    changes
  ) => {
    setUsers(
      (current) =>
        current.map(
          (entry) =>
            String(entry.id) ===
            String(id)
              ? {
                  ...entry,
                  ...changes,
                }
              : entry
        )
    );
  };

  /* =======================================================
     GET RESTAURANT
  ======================================================= */

  const getRestaurant = (
    id
  ) => {
    return restaurants.find(
      (restaurant) =>
        String(
          restaurant.id
        ) === String(id) ||
        String(
          restaurant._id
        ) === String(id)
    );
  };

  /* =======================================================
     REFRESH
  ======================================================= */

  const refreshPlatform =
    async () => {
      if (
        user?.role ===
        'customer'
      ) {
        await fetchCustomerData();
      }

      if (
        user?.role ===
        'vendor'
      ) {
        await fetchVendorData();
      }

      if (
        user?.role ===
        'delivery'
      ) {
        await fetchDeliveryData();
      }

      if (
        user?.role ===
        'admin'
      ) {
        await fetchAdminData();
      }
    };

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value = {
      restaurants,
      orders,
      users,
      menuItems,
      reviews,
      notifications,

      settings,

      delivery,

      favorites,

      metrics,

      vendorProfile,

      getRestaurant,

      toggleFavorite,

      updateOrderStatus,

      createOrder,

      addReview,

      setDelivery,

      updateUser,

      refreshPlatform,
    };

  return (
    <PlatformContext.Provider
      value={value}
    >
      {children}
    </PlatformContext.Provider>
  );
};

/* =========================================================
   USE PLATFORM
========================================================= */

export const usePlatform = () =>
  useContext(PlatformContext);