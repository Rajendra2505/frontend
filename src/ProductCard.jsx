import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useProducts } from "./contexts/ProductContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { dispatch } = useProducts();

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={i < (product.rating || 4) ? "star-filled" : "star-empty"}
      >
        ★
      </span>
    ));
  };

  // ✅ FIXED NAVIGATION
  const handleProductClick = () => {
    const productId = product?._id || product?.id;
    if (!productId) return alert("Product ID missing");
    navigate(`/product/${productId}`);
  };

  // ✅ FINAL FIXED ADD TO CART
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const productId = product?._id || product?.id;

    console.log("👉 Product:", product);
    console.log("👉 Product ID:", productId);

    // 🚨 VALIDATION (VERY IMPORTANT)
    if (!productId) {
      alert("Product ID is missing");
      return;
    }

    try {
      const res = await fetch(
        "https://backend-zehy.onrender.com/api/cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: productId,
            product: product,
            quantity: 1,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Backend Error:", data);
        alert(data.error || "Failed to add to cart");
        return;
      }

      console.log("✅ Saved to DB:", data);

      dispatch({
        type: "ADD_TO_CART",
        payload: product,
      });

      alert(`${product.name} added to cart`);

      navigate("/cart"); // ✅ redirect
    } catch (err) {
      console.error("❌ Cart Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="product-card" onClick={handleProductClick}>
      <div className="product-image-container">
        {product.discount && (
          <span className="discount-badge">
            {product.discount}% OFF
          </span>
        )}

        <img
          src={`https://backend-zehy.onrender.com${product.image}`}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            console.log("Image failed:", e.target.src);
            e.target.src = "/vite.svg";
          }}
        />
      </div>

      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>

        <div className="product-rating">{renderStars()}</div>

        <div className="product-price">
          <span className="current-price">₹{product.price}</span>
          {product.original && (
            <span className="original-price">₹{product.original}</span>
          )}
        </div>

        <button className="add-to-cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}