import React, { useEffect, useState } from "react";

function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = () => {
        fetch("https://backend-zehy.onrender.com/api/orders")
        .then(res => res.json())
        .then(data => setOrders(data))
        .catch(err => console.error('Fetch orders error:', err));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const updateStatus = async (id, status) => {
        if (!confirm(`Update status to "${status}"?`)) return;

        setLoading(true);
        try {
            await fetch(`https://backend-zehy.onrender.com/api/orders${id}`, {
                method: "PATCH",
                headers: {"content-type": "application/json"},
                body: JSON.stringify({status})
            });
            fetchOrders();
        } catch (err) {
            console.error('Update status error:', err);
        } finally {
            setLoading(false);
        }
    };

    const deleteOrder = async (id) => {
        if (!confirm('Delete this order?')) return;
        await fetch(`https://backend-zehy.onrender.com/api/orders${id}`, {
           method: "DELETE" 
        });
        fetchOrders();
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: { bg: '#fff3cd', color: '#856404' },
            dispatched: { bg: '#cce5ff', color: '#004085' },
            delivered: { bg: '#d4edda', color: '#155724' },
            cancelled: { bg: '#f8d7da', color: '#721c24' }
        };
        return colors[status] || { bg: '#fff3cd', color: '#856404' };
    };

    return (
        <div style={{padding: "40px"}}>
            <h2>Manage Orders</h2>
            {loading && <p>Updating...</p>}

            <table border="1" cellPadding="10" style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead>
                    <tr style={{background: '#f8f9fa'}}>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Payment</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {orders.map((order) => {
                        const statusStyle = getStatusColor(order.status);
                        return (
                        <tr key={order._id} style={{borderBottom: '1px solid #dee2e6'}}>
                            <td style={{fontSize: '12px'}}>{order._id.slice(-8)}</td>
                            <td>{order.shippingAddress?.fullName || 'N/A'}</td>
                            <td>{order.email || 'N/A'}</td>
                            <td>{order.shippingAddress?.phone || 'N/A'}</td>
                            <td>{order.paymentMethod || 'COD'}</td>
                            <td>{order.products?.length || 0}</td>
                            <td>₹{order.totalPrice?.toLocaleString() || '0'}</td>
                            <td>
                                <span style={{
                                    padding: '6px 12px', 
                                    background: statusStyle.bg, 
                                    color: statusStyle.color, 
                                    borderRadius: '20px', 
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                }}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </td>
                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                            <td>
                                <select 
                                    onChange={(e) => updateStatus(order._id, e.target.value)}
                                    value={order.status}
                                    disabled={loading}
                                    style={{
                                        padding: '8px 12px',
                                        marginRight: '8px',
                                        borderRadius: '6px',
                                        border: '1px solid #ccc',
                                        minWidth: '130px',
                                        background: loading ? '#f8f9fa' : 'white'
                                    }}>
                                    <option value="pending">Pending</option>
                                    <option value="dispatched">Dispatched</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <button 
                                    onClick={() => deleteOrder(order._id)}
                                    disabled={loading}
                                    style={{ 
                                        padding: '8px 12px', 
                                        background: '#f5e9ea', 
                                        color: 'white', 
                                        border: 'none', 
                                        borderRadius: '6px',
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}>
                                    {/* Delete */}
                                </button>          
                            </td>
                        </tr>
                    )})}
                </tbody>
            </table>
        </div>
    );
}

export default ManageOrders;
