import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from './contexts/ProductContext';
import './cart.css';

export default function Cart() {
  const { cartItems, dispatch } = useProducts();

  React.useEffect(() => {
    const syncBackendCart = async () => {
      try {
        const res = await fetch('https://backend-zehy.onrender.com/api/cart');
        const data = await res.json();

        // IMPORTANT FIX
        dispatch({
          type: 'LOAD_CART_BACKEND',
          payload: data.products || [],
        });

      } catch (err) {
        console.error('Backend cart sync failed:', err);
      }
    };

    syncBackendCart();
  }, [dispatch]);

  const getPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseInt(price.replace(/,/g, '')) || 0;
    return 0;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + getPrice(item.product?.price) * item.quantity;
  }, 0);

  // ✅ FIXED: use productId
  const updateQuantity = async (productId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { productId, quantity },
    });

    try {
      await fetch(`https://backend-zehy.onrender.com/api/cart/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: { productId },
    });

    try {
      await fetch(`https://backend-zehy.onrender.com/api/cart/${productId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <Link to="/">← Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Shopping Cart ({totalItems} items)</h1>

      <div className="cart-items">
        {cartItems.map((item) => {
          const price = getPrice(item.product?.price);

          return (
            <div key={item.productId} className="cart-item">

              <img
                src={`https://backend-zehy.onrender.com${item.product?.image}`}
                alt={item.product?.name}
                className="cart-item-image"
                onError={(e) => (e.target.src = '/vite.svg')}
              />

              <div className="cart-item-details">
                <h3>{item.product?.name}</h3>

                <p>
                  ₹{price.toLocaleString()} × {item.quantity}
                </p>

                <div className="quantity-controls">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    +
                  </button>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-item-total">
                ₹{(price * item.quantity).toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-total">
        <h2>Total: ₹{totalPrice.toLocaleString()}</h2>

        <Link to="/checkout" className="checkout-btn">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}