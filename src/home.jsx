import { useEffect } from 'react';
import SubNavbar from "./SubNavbar";
import Hero from "./Hero";
import ProductCard from "./ProductCard";
import "./Home.css";
import { useProducts } from "./contexts/ProductContext";

function ProductSection({ title, items }) {
  return (
    <div className="product-section">
      <div className="section-header">
        <h2>{title}</h2>
      </div>

      <div className="product-grid">
        {items.length > 0 ? (
          items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p style={{ padding: "10px" }}>No products available</p>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const {
    loading,
    allProducts,
    currentCategory,
    fetchProductsByCategory
  } = useProducts();

  useEffect(() => {
    fetchProductsByCategory('all');
  }, [fetchProductsByCategory]);

  if (loading) {
    return (
      <>
        <SubNavbar />
        <Hero />
        <div style={{ textAlign: "center", padding: "50px" }}>
          Loading products...
        </div>
      </>
    );
  }

  const productsToShow = allProducts;

  return (
    <>
      <SubNavbar />
      <Hero />
      {/* No duplicate buttons - use SubNavbar only */}

      {/* PRODUCTS */}
      <div className="home-content">
        <ProductSection
          title={
            currentCategory === "all"
              ? "All Products"
              : currentCategory.charAt(0).toUpperCase() +
                currentCategory.slice(1)
          }
          items={productsToShow}
        />
      </div>
    </>
  );
}

