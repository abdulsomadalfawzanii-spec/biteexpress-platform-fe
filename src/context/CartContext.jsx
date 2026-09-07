import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY =
  'biteexpress_cart';

/* =========================================================
   CART PROVIDER
========================================================= */

export const CartProvider = ({
  children,
}) => {
  const [cartItems, setCartItems] =
    useState(() => {
      try {
        const saved =
          localStorage.getItem(
            CART_STORAGE_KEY
          );

        return saved
          ? JSON.parse(saved)
          : [];
      } catch (error) {
        console.error(
          'Failed to load cart:',
          error
        );

        return [];
      }
    });

  /* =======================================================
     SAVE CART
  ======================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      );
    } catch (error) {
      console.error(
        'Failed to save cart:',
        error
      );
    }
  }, [cartItems]);

  /* =======================================================
     ADD TO CART
  ======================================================= */

  const addToCart = (
    item,
    quantity = 1
  ) => {
    if (!item) {
      throw new Error(
        'Invalid food item.'
      );
    }

    const itemId =
      item?._id ||
      item?.id;

    const vendorId =
      item?.vendorId ||
      item?.vendor?._id ||
      item?.vendor;

    if (!itemId) {
      throw new Error(
        'Food item does not have a valid ID.'
      );
    }

    if (!vendorId) {
      throw new Error(
        'Food item does not have a valid restaurant/vendor.'
      );
    }

    const normalizedItem = {
      id: String(itemId),

      menuItem: String(itemId),

      vendorId: String(vendorId),

      vendorName:
        item?.vendorName ||
        item?.vendor?.restaurantName ||
        item?.restaurantName ||
        'Restaurant',

      name:
        item?.name ||
        'Food Item',

      description:
        item?.description ||
        '',

      price: Number(
        item?.price || 0
      ),

      image:
        item?.image ||
        item?.imageUrl ||
        '',

      quantity: Math.max(
        1,
        Number(quantity) || 1
      ),
    };

    setCartItems(
      (current) => {
        /*
         * Do not allow items from different
         * restaurants in the same cart.
         */
        if (
          current.length > 0 &&
          String(
            current[0].vendorId
          ) !==
            String(
              normalizedItem.vendorId
            )
        ) {
          const shouldReplace =
            window.confirm(
              'Your cart contains items from another restaurant. Replace the current cart with this item?'
            );

          if (!shouldReplace) {
            return current;
          }

          return [
            normalizedItem,
          ];
        }

        const existing =
          current.find(
            (cartItem) =>
              String(
                cartItem.id
              ) ===
              String(
                normalizedItem.id
              )
          );

        if (existing) {
          return current.map(
            (cartItem) =>
              String(
                cartItem.id
              ) ===
              String(
                normalizedItem.id
              )
                ? {
                    ...cartItem,
                    quantity:
                      cartItem.quantity +
                      normalizedItem.quantity,
                  }
                : cartItem
          );
        }

        return [
          ...current,
          normalizedItem,
        ];
      }
    );
  };

  /* =======================================================
     REMOVE
  ======================================================= */

  const removeFromCart = (
    itemId
  ) => {
    setCartItems(
      (current) =>
        current.filter(
          (item) =>
            String(item.id) !==
            String(itemId)
        )
    );
  };

  /* =======================================================
     UPDATE QUANTITY
  ======================================================= */

  const updateQuantity = (
    itemId,
    change
  ) => {
    setCartItems(
      (current) =>
        current
          .map((item) => {
            if (
              String(item.id) !==
              String(itemId)
            ) {
              return item;
            }

            return {
              ...item,
              quantity:
                item.quantity +
                Number(change),
            };
          })
          .filter(
            (item) =>
              item.quantity > 0
          )
    );
  };

  /* =======================================================
     SET QUANTITY
  ======================================================= */

  const setQuantity = (
    itemId,
    quantity
  ) => {
    const nextQuantity =
      Number(quantity);

    if (
      !Number.isFinite(
        nextQuantity
      ) ||
      nextQuantity <= 0
    ) {
      removeFromCart(itemId);
      return;
    }

    setCartItems(
      (current) =>
        current.map((item) =>
          String(item.id) ===
          String(itemId)
            ? {
                ...item,
                quantity:
                  nextQuantity,
              }
            : item
        )
    );
  };

  /* =======================================================
     CLEAR CART
  ======================================================= */

  const clearCart = () => {
    setCartItems([]);
  };

  /* =======================================================
     CALCULATIONS
  ======================================================= */

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum +
          Number(item.price || 0) *
            Number(
              item.quantity || 0
            ),
        0
      ),
    [cartItems]
  );

  const deliveryFee =
    cartItems.length > 0
      ? 3.99
      : 0;

  const tax =
    subtotal * 0.0825;

  const total =
    subtotal +
    deliveryFee +
    tax;

  const itemCount = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) =>
          sum +
          Number(
            item.quantity || 0
          ),
        0
      ),
    [cartItems]
  );

  const value = {
    cartItems,

    addToCart,

    removeFromCart,

    updateQuantity,

    setQuantity,

    clearCart,

    subtotal,

    deliveryFee,

    tax,

    total,

    itemCount,
  };

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
};

/* =========================================================
   USE CART
========================================================= */

export const useCart = () => {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart must be used inside CartProvider'
    );
  }

  return context;
};