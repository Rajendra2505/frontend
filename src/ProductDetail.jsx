import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from './contexts/ProductContext';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productsState, dispatch, loading, refetchProducts } = useProducts();
  const productId = id;
  React.useEffect(() => {
    refetchProducts();
  }, []);

  const product = React.useMemo(() => {
    for (const category of Object.values(productsState)) {
      const found = category.find(p => p.id == id); 
      if (found) return found;
    }
    return null;
  }, [productsState, id]);

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <div>Product not found</div>;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<span key={i} className={i <= rating ? 'star-filled' : 'star-empty'}>&#9733;</span>);
    }
    return stars;
  };

  const handleAddToCart = () => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
    alert(`"${product.title}" added to cart!`);
    navigate('/cart');
  };

  return (
    <div className="product-detail">
      <button className="back-btn" onClick={() => navigate('/')}>← Back to Home</button>
      <div className="detail-container">
        <div className="detail-image">
<img src={product.image} alt={product.title} loading="lazy" onError={(e) => e.target.src='/vite.svg'} />
        </div>
        <div className="detail-info">
          <h1>{product.title}</h1>
          <div className="rating">{renderStars(product.rating)} ({product.rating}/5)</div>
          <div className="price">
            <span className="current-price">₹{product.price}</span>
            {product.original && <span className="original-price">₹{product.original}</span>}
            {product.discount && <span className="discount">{product.discount} off</span>}
          </div>
          <p className="description">High-quality {product.title.toLowerCase()}. Perfect for everyday use. Fast delivery available.</p>
          <button className="add-cart-detail" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
