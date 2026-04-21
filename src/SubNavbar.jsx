import "./SubNavbar.css";
import { useProducts } from './contexts/ProductContext';

export default function SubNavbar(){
  const { currentCategory, fetchProductsByCategory } = useProducts();

  const categories = [
    { name: 'ALL', category: 'all' },
    { name: 'Electronics', category: 'electronics' },
    { name: 'Beauty', category: 'beauty' },
    { name: 'Home & Kitchen', category: 'home' },
    { name: 'Fashion', category: 'fashion' },
  ];

  return(
    <div className="subnav">
      {categories.map((cat) => (
        <span key={cat.category} 
          className={`subnav-item ${currentCategory === cat.category ? 'active' : ''}`}
          onClick={() => fetchProductsByCategory(cat.category)}
          style={{cursor: 'pointer'}}>
          {cat.name}
        </span>
      ))}
      {/* <span>todays deal</span> */}
      {/* <span>Customer Service</span> */}
      {/* <span>New Releases</span> */}
    </div>
  );
}

