import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useProducts } from './contexts/ProductContext';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, dispatch } = useProducts();
  const navigate = useNavigate();

  const getPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      return parseFloat(price.replace(/,/g, '')) || 0;
    }
    return 0;
  };

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    streetAddress: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'COD',
    email: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const totalAmount = cartItems.reduce((sum, item) => {
    const price = getPrice(item.product?.price);
    return sum + price * (item.quantity || 0);
  }, 0);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  
  const handlePlaceOrder = async () => {
    if (totalItems === 0) return;

    setLoading(true);
    setError('');

    const shippingAddress = {
      fullName: formData.fullName,
      phone: formData.phone,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode
    };

    const products = cartItems.map(item => ({
      productId: item.productId || item._id,
      product: {
        name: item.product?.name || item.product?.title || 'Product',
        price: typeof item.product?.price === 'number'
          ? item.product.price
          : parseFloat(item.product?.price) || 0
      },
      quantity: item.quantity || 1
    }));

    try {
      const response = await fetch('https://backend-zehy.onrender.com/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest',
          products,
          totalPrice: totalAmount,
          shippingAddress,
          paymentMethod: formData.paymentMethod,
          email: formData.email
        })
      });

      if (response.ok) {
        dispatch({ type: 'CLEAR_CART' });
        setSuccess(true);
        setTimeout(() => navigate('/'), 3000);
      }

    } catch (err) {
      setError('Order failed');
    } finally {
      setLoading(false);
    }
  };

  
  const handlePayment = async () => {
    try {
      const res = await fetch("https://backend-zehy.onrender.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ amount: totalAmount })
      });

      const data = await res.json();

      const options = {
        key: "rzp_test_SdTGZVgh5DZswt", 
        amount: data.amount,
        currency: "INR",
        name: "Amazon Clone",
        description: "Order Payment",
        order_id: data.id,

        handler: async function () {
          alert("Payment Successful ");

          
          await handlePlaceOrder();
        },

        theme: {
          color: "#ff9900"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.log(error);
      alert("Payment failed");
    }
  };

  if (success) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2 style={{ color: 'green' }}>Order Placed Successfully!</h2>
        <p>Email sent. Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1 className="checkout-title">Checkout ({totalItems} items)</h1>

      {cartItems.length > 0 && (
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="cart-items">
            {cartItems.map((item) => {
              const price = getPrice(item.product?.price);
              const itemTotal = price * (item.quantity || 1);
              return (
                <div key={item.product?.id || item._id} className="cart-item">
                  <img 
                    src={item.product?.image?.startsWith('http') ? item.product.image : `https://backend-zehy.onrender.com/api/orders${item.product?.image || '/uploads/default.jpg'}`} 
                    alt={item.product?.title || item.product?.name || 'Product'} 
                    className="cart-item-image" 
                  />
                  <div className="cart-item-details">
                    <h3>{item.product?.title || item.product?.name || 'Product'}</h3>
                    <p>₹{price.toLocaleString('en-IN')} x {item.quantity || 1}</p>
                  </div>
                  <div className="cart-item-total">₹{itemTotal.toLocaleString('en-IN')}</div>
                </div>
              );
            })}
          </div>
          <div className="order-total">
            Order Total: ₹{totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
      )}

      <form className="checkout-form" onSubmit={(e) => { e.preventDefault(); }}>
        <input name="fullName" placeholder="Name" onChange={handleInputChange} required />
        <input name="phone" placeholder="Phone" onChange={handleInputChange} required />
        <input name="streetAddress" placeholder="Address" onChange={handleInputChange} required />
        <input name="city" placeholder="City" onChange={handleInputChange} required />
        <input name="state" placeholder="State" onChange={handleInputChange} required />
        <input name="pincode" placeholder="Pincode" onChange={handleInputChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleInputChange} required />

        <select name="paymentMethod" onChange={handleInputChange}>
          <option value="COD">Cash on Delivery</option>
          <option value="card">Online Payment</option>
        </select>

        
        {formData.paymentMethod === "COD" ? (
          <button type="button" onClick={handlePlaceOrder}>
            Place Order (COD)
          </button>
        ) : (
          <button type="button" onClick={handlePayment}>
            Pay Now ₹{totalAmount}
          </button>
        )}
      </form>
    </div>
  );
}