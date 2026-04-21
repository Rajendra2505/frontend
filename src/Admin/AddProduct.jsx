import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";

function AddProduct(){
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    categoryRaw: '',
    category: '',
    imageFile: null
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { dispatch } = useProducts();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === 'categoryRaw' && { category: mapCategory(value) })
    }));
  };

  const mapCategory = (cat) => {
    const map = {
      'electronics': 'electronics',
      'fashion': 'fashion',
      'home': 'home',
      'Men': 'fashion',
      'women': 'fashion',
      'beauty': 'beauty'
    };
    return map[cat.toLowerCase()] || 'fashion';
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imageFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.category || !formData.imageFile) {
      alert('Please fill all fields including image');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.title);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('image', formData.imageFile);

    setLoading(true);
    try {
      const response = await fetch('https://backend-zehy.onrender.com/api/products', {
        method: 'POST',
        body: formDataToSend,
        
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }
      
      const data = await response.json();
      alert('Product added successfully!');
      
      
      dispatch({ type: 'REFETCH_PRODUCTS' });
      navigate('/admin-dashboard');
    } catch (error) {
      alert('Error adding product: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return(
    <div style={{padding:"40px", maxWidth: "600px", margin: "0 auto"}}>
      <h2 style={{textAlign: "center", marginBottom: "30px"}}>Add New Product</h2>

      <form onSubmit={handleSubmit}>
        <div style={{marginBottom: "20px"}}>
          <label style={{display: "block", marginBottom: "5px", fontWeight: "bold"}}>Product Name:</label>
          <input 
            type="text" 
            name="title"
            placeholder="Enter product name" 
            value={formData.title}
            onChange={handleChange}
            style={{width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px"}}
            required
          />
        </div>

        <div style={{marginBottom: "20px"}}>
          <label style={{display: "block", marginBottom: "5px", fontWeight: "bold"}}>Price:</label>
          <input 
            type="number" 
            name="price"
            placeholder="Enter price" 
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            style={{width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px"}}
            required
          />
        </div>

        <div style={{marginBottom: "20px"}}>
          <label style={{display: "block", marginBottom: "5px", fontWeight: "bold"}}>Category:</label>
          <select 
            name="categoryRaw"
            value={formData.categoryRaw || '' }
            onChange={handleChange}
            style={{width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px"}}
            required
          >
            <option value="">Select category</option>
            <option value="electronics">Electronics</option>
            <option value="fashion">Fashion</option>
            <option value="home">Home & Kitchen</option>
            <option value="beauty">Beauty</option>
          </select>
          {formData.category && (
            <small style={{color: "#666"}}>Mapped category: {formData.category}</small>
          )}
        </div>

        <div style={{marginBottom: "20px"}}>
          <label style={{display: "block", marginBottom: "5px", fontWeight: "bold"}}>Product Image:</label>
          <input 
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px"}}
            required
          />
          {imagePreview && (
            <div style={{marginTop: "10px"}}>
              <img 
                src={imagePreview} 
                alt="Preview" 
                style={{maxWidth: "200px", maxHeight: "200px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}
              />
            </div>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: "100%", 
            padding: "12px", 
            backgroundColor: loading ? "#ccc" : "#ff9900", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            fontSize: "16px", 
            cursor: loading ? "not-allowed" : "pointer"
          }}
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}

export default AddProduct;
