import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "./dashboard.css";
import Analytics from "../Analytics";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("https://backend-zehy.onrender.com/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://backend-zehy.onrender.com/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.totalPrice || 0),
    0
  );

  return (
    
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-content">
        <h1>Admin Dashboard</h1>

        <div className="cards">

          <div className="card">
            <h2>Total Products</h2>
            <p>{products.length}</p>
          </div>

          <div className="card">
            <h2>Total Orders</h2>
            <p>{orders.length}</p>
          </div>

          <div className="card">
            <h2>Total Revenue</h2>
            <p>₹{totalRevenue}</p>
          </div>

        </div>
        <Analytics/>

        <div className="recent-orders">
          <h2>Recent Orders</h2>

          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order.shippingAddress?.fullName}</td>
                  <td>₹{order.totalPrice}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}