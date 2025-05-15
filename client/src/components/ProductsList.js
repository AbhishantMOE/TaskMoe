// client/src/components/ProductsList.js
import { useNavigate } from 'react-router-dom';
import './ProductsList.css';

const ProductsList = ({ products, onDelete }) => {
  const navigate = useNavigate();

  const handleDelete = (id, e) => {
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className="products-container">
      <div className="header">
        <h1>Products</h1>
        <button onClick={() => navigate('/products/new')}>Add Product</button>
      </div>
      
      <div className="products-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => navigate(`/products/${product.id}`)}
          >
            <img src={product.image} alt={product.title} />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <h4>{product.description.substring(0,50)}</h4>

            <div className="actions">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/products/${product.id}/edit`);
                }}
                className="edit-btn"
              >
                Edit
              </button>
              <button 
                onClick={(e) => handleDelete(product.id, e)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;