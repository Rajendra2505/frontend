import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useProducts } from './contexts/ProductContext';
import './Checkout.css';

export default function Checkout() {
  const { cartItems, dispatch } = useProducts();
  const navigate = useNavigate();

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
  const [success, setSuccess] = useState(false);

  const getPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') return parseFloat(price.replace(/,/g, '')) || 0;
    return 0;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalAmount = cartItems.reduce((sum, item) => {
    return sum + getPrice(item.product?.price) * item.quantity;
  }, 0);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ FIXED PLACE ORDER
  const handlePlaceOrder = async () => {
    if (totalItems === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    const shippingAddress = {
      fullName: formData.fullName,
      phone: formData.phone,
      streetAddress: formData.streetAddress,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode
    };

    const products = cartItems.map(item => ({
      productId: item.productId,
      product: {
        name: item.product?.name || item.product?.title,
        price: Number(item.product?.price)
      },
      quantity: item.quantity
    }));

    try {
      const response = await fetch(
        "https://backend-zehy.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: "guest",
            products,
            totalPrice: totalAmount,
            shippingAddress,
            paymentMethod: formData.paymentMethod,
            email: formData.email
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Order failed");
        return;
      }

      alert("Order placed successfully ✅");

      dispatch({ type: "CLEAR_CART" });

      setSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  // 💳 ONLINE PAYMENT
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
          alert("Payment Successful");
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
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout ({totalItems} items)</h1>

      <div className="cart-items">
        {cartItems.map(item => {
          const price = getPrice(item.product?.price);
          return (
            <div key={item.productId} className="cart-item">

              <img
                src={
                  item.product?.image?.startsWith('http')
                    ? item.product.image
                    : `https://backend-zehy.onrender.com${item.product?.image}`
                }
                alt={item.product?.name}
              />

              <div>
                <h3>{item.product?.name}</h3>
                <p>₹{price} x {item.quantity}</p>
              </div>

              <div>
                ₹{price * item.quantity}
              </div>

            </div>
          );
        })}
      </div>

      <h2>Total: ₹{totalAmount}</h2>

      <form onSubmit={(e) => e.preventDefault()}>

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
          <button type="button" onClick={handlePlaceOrder} disabled={loading}>
            {loading ? "Placing..." : "Place Order"}
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