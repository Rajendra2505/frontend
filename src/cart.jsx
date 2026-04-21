import React from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from './contexts/ProductContext';
import './cart.css'; 

export default function Cart() {
  const { cartItems, dispatch } = useProducts();

  React.useEffect(() => {
    const syncBackendCart = async () => {
      try {
        const res = await fetch('https://backend-zehy.onrender.com');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const backendCart = await res.json();
        
        dispatch({ type: 'LOAD_CART_BACKEND', payload: backendCart });
      } catch (err) {
        console.error('Backend cart sync failed:', err);
      }
    };
    syncBackendCart();
  }, [dispatch]);

  
  const getPrice = (priceStr) => {
    if (typeof priceStr === 'number') return priceStr;
    if (typeof priceStr === 'string') {
      return parseInt(priceStr.replace(/,/g, '')) || 0;
    }
    return 0;
  };

  
  const totalItems = cartItems ? cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;
  const totalPrice = cartItems ? cartItems.reduce((sum, item) => {
    const price = getPrice(item.product?.price);
    return sum + price * (item.quantity || 0);
  }, 0) : 0;

  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  const removeItem = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { id: productId } });
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
            <div key={item.product?.id || item._id || Math.random()} className="cart-item">
              <img 
                src={item.product?.image?.startsWith('http') ? item.product.image : `https://backend-zehy.onrender.com${item.product?.image || '/uploads/default.jpg'}`} 
                alt={item.product?.title || item.product?.name || 'Product'} 
                className="cart-item-image" 
              />
              <div className="cart-item-details">
                <h3>{item.product?.title || item.product?.name || 'Product'}</h3>
                <p>₹{typeof item.product?.price === 'string' ? item.product.price : item.product?.price?.toLocaleString('en-IN') || '0'} x {item.quantity || 1}</p>
                <div className="quantity-controls">
                  <button 
                    onClick={() => updateQuantity(item.product?.id || item._id, (item.quantity || 1) - 1)}
                    disabled={(item.quantity || 1) <= 1}
                  >-</button>
                  <span>{item.quantity || 1}</span>
                  <button 
                    onClick={() => updateQuantity(item.product?.id || item._id, (item.quantity || 1) + 1)}
                  >+</button>
                  <button className="remove-btn" onClick={() => removeItem(item.product?.id || item._id)}>Remove</button>
                </div>
              </div>
              <div className="cart-item-total">₹{(price * (item.quantity || 1)).toLocaleString()}</div>
            </div>
          );
        })}
      </div>
      <div className="cart-total">
        <h2>Total: ₹{totalPrice.toLocaleString()}</h2>
        <Link 
          to="/checkout" 
          className="checkout-btn" 
          style={{pointerEvents: totalItems === 0 ? 'none' : 'auto', opacity: totalItems === 0 ? 0.5 : 1}}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
