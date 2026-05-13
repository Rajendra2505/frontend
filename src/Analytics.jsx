import React from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

const salesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 7000 },
  { month: "May", sales: 6000 }
];

const orderData = [
  { name: "Delivered", value: 70 },
  { name: "Pending", value: 20 },
  { name: "Cancelled", value: 10 }
];

const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

export default function Analytics() {

  return (
    <div style={{ padding: "20px" }}>

      <h2>Analytics Dashboard</h2>

      <div
        style={{
          display: "flex",
          gap: "40px",
          flexWrap: "wrap"
        }}
      >

        <div
          style={{
            width: "500px",
            height: "300px",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px"
          }}
        >

          <h3>Monthly Sales</h3>

          <ResponsiveContainer width="100%" height="100%">

            <BarChart data={salesData}>

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="sales" fill="#ff9900" />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div
          style={{
            width: "400px",
            height: "300px",
            background: "#fff",
            padding: "20px",
            borderRadius: "10px"
          }}
        >

          <h3>Order Status</h3>

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={orderData}
                dataKey="value"
                outerRadius={100}
                label
              >

                {orderData.map((entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />

                ))}

              </Pie>

              <Tooltip />

            </PieChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>
  );
}