import React, { useEffect, useState } from "react";

export default function MyOrders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {

      const res = await fetch(
        "https://backend-zehy.onrender.com/api/orders/guest"
      );

      const data = await res.json();

      setOrders(data);

    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: "30px" }}>Loading...</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>

      <h1 style={{ marginBottom: "30px" }}>
        My Orders
      </h1>

      {orders.length === 0 ? (
        <h3>No Orders Found</h3>
      ) : (

        orders.map((order) => (

          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px",
              background: "#fff"
            }}
          >

            <h3>
              Order ID: {order._id}
            </h3>

            <p>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <p>
              <strong>Payment:</strong> {order.paymentMethod}
            </p>

            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <h4 style={{ marginTop: "15px" }}>
              Products:
            </h4>

            {order.products.map((item, index) => (

              <div
                key={index}
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #eee"
                }}
              >

                <p>
                  {item.product?.name}
                </p>

                <p>
                  Quantity: {item.quantity}
                </p>

                <p>
                  Price: ₹{item.product?.price}
                </p>

              </div>
            ))}

          </div>
        ))
      )}
    </div>
  );
}