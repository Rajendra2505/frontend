import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";
import { useProducts } from "./contexts/ProductContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { dispatch } = useProducts();

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= (product.rating || 4) ? "star-filled" : "star-empty"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const handleProductClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();

  const productId = product._id || product.id;

    try {
      console.log("👉 Product clicked:", product);   // ✅ ADDED HERE

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
        alert(data.error || "Failed to add to cart");
        return;
      }

      console.log("✅ Saved to DB:", data);

      dispatch({ type: "ADD_TO_CART", payload: product });

      alert(`${product.name} added to cart`);

      navigate("/cart");
    } catch (err) {
      console.error("❌ Cart error:", err);
      alert("Error adding to cart");
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