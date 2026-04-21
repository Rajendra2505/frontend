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
        <span key={i} className={i <= (product.rating || 4) ? "star-filled" : "star-empty"}>
          &#9733;
        </span>
      );
    }
    return stars;
  };

  const handleProductClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e) => {
    if (!e) return;
    e.stopPropagation();
    dispatch({ type: 'ADD_TO_CART', payload: product });
    alert(`"${product.title}" added to cart!`);
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleProductClick}>
      <div className="product-image-container">
        {product.discount && <span className="discount-badge">{product.discount} off</span>}
        <img
  src={
    product.image.startsWith("http")
      ? product.image
      : `https://backend-zehy.onrender.com${product.image}`
  }
  alt={product.title}
  loading="lazy"
  onError={(e) => e.target.src = '/vite.svg'}
/>
      </div>
      
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        
        <div className="product-rating">
          {renderStars()}
        </div>
        
        <div className="product-price">
          <span className="current-price">₹{product.price}</span>
          {product.original && (
            <span className="original-price">₹{product.original}</span>
          )}
        </div>
        
        <button 
          className="add-to-cart-btn" 
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
