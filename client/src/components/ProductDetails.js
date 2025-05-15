
import './ProductDetails.css';

// client/src/components/ProductDetails.js
import { useParams, useNavigate } from 'react-router-dom';

const ProductDetails = ({ products, onDelete }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id.toString() === id);

  const handleDelete = () => {
    onDelete(id);
    navigate('/');
  };

  if (!product) return <div>Product not found</div>;

  return (
    <div className="product-details">
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back to Products
      </button>
      
      <div className="product-content">
        <img src={product.image} alt={product.title} />
        <div className="product-info">
          <h1>{product.title}</h1>
          <p>${product.price}</p>
          <p className="category">{product.category}</p>
          <p className="description">{product.description}</p>
          <button 
            onClick={() => navigate(`/products/${id}/edit`)}
            className="edit-btn"
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            className="delete-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;