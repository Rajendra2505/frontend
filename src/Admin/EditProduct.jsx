import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";

function EditProduct(){
    const { id } = useParams();
    const navigate = useNavigate();
    const { refetchProducts } = useProducts();
    
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Load current product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://backend-zehy.onrender.com${id}`);
                if (!response.ok) throw new Error('Product not found');
                const product = await response.json();
                setFormData({
                    name: product.name,
                    price: product.price,
                    category: product.category
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updateData = {
                ...formData,
                category: formData.category.toLowerCase()
            };
            const response = await fetch(`https://backend-zehy.onrender.com${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData)
            });
            if (!response.ok) {
                throw new Error('Update failed');
            }
            alert('Product edited successfully!');
            await refetchProducts();
            navigate('/manage-product');
        } catch (err) {
            alert('Error updating product: ' + err.message);
        }
    };

    if (loading) return <div>Loading product...</div>;
    if (error) return <div>Error: {error}</div>;

    return(
        <div style={{padding:"40px"}}>
            <h2>Edit Product ID: {id}</h2>
            <form onSubmit={handleUpdate}>
                <div>
                    <label>Product Name:</label><br/>
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Product name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    /><br/><br/>
                </div>
                <div>
                    <label>Price:</label><br/>
                    <input 
                        type="number" 
                        name="price"
                        placeholder="Price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                    /><br/><br/>
                </div>
                <div>
                    <label>Category:</label><br/>
                    <select 
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="electronics">Electronics</option>
                        <option value="fashion">Fashion</option>
                        <option value="home">Home</option>
                        <option value="beauty">Beauty</option>
                    </select><br/><br/>
                </div>
                <button type="submit">Update Product</button>
            </form>
        </div>
    );
}
export default EditProduct;
