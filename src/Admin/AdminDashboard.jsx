import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";


function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Logging out...");
    navigate("/admin-login");
  };

  const handleAddProducts = () => {
    navigate("/add-product");
  }; 
  const handleManageProducts = () => {
    navigate("/manage-product");
  };
  const handleOrders=()=>{
    navigate("/manage-orders");
  };
  const handleManageUsers = () => alert("Manage Users clicked!");

  return (
    <div className="dashboard">
      <div className="admin-header">
        <h1 className="header-title">Admin Dashboard</h1>
      </div>
      <div className="main-container">
        <main className="main-content">
          <section className="content-upper">
            <div className="card" onClick={handleAddProducts}>
              <h3>Add Products</h3>
            </div>
            <div className="card" onClick={handleManageProducts}>
              <h3>Manage Products</h3>
            </div>
            <div className="card" onClick={handleOrders}>
              <h3>Manage Orders</h3>
            </div>
            <div className="card" onClick={handleManageUsers}>
              <h3>Manage Users</h3>
            </div>
            <div className="card logout-card" onClick={handleLogout}>
              <h3>Logout</h3>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;

