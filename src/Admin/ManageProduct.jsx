import React from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext"; 

function ManageProducts() {
  const navigate = useNavigate();
  const { productsState, refetchProducts } = useProducts();

  
  const allProducts = Object.values(productsState).flat();

const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (confirmDelete) {
      try {
        const response = await fetch(`https://backend-zehy.onrender.com${productId}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          refetchProducts();
          alert('Product deleted successfully from backend!');
        } else {
          throw new Error('Delete failed');
        }
      } catch (error) {
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Manage Products</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {allProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.price}</td>
              <td>{product.category}</td>
              <td>
                <button 
                  onClick={() => handleEdit(product.id)}
                  style={{ marginRight: "10px" }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(product.id)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageProducts;
