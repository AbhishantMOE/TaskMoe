// client/src/components/ProductForm.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct } from '../api/products';
import './ProductForm.css';

const ProductForm = ({ onCreate, onUpdate }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    title: '',
    price: '',
    description: '',
    image: '',
    category: 'electronics'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id && id !== 'new') {
      const fetchProduct = async () => {
        try {
          const { data } = await getProduct(id);
          setProduct(data);
        } catch (err) {
          setError('Failed to load product');
        }
      };
      fetchProduct();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = {
        ...product,
        price: parseFloat(product.price)
      };

      if (id && id !== 'new') {
        const { data: updatedProduct } = await updateProduct(id, productData);
        onUpdate(updatedProduct);
        navigate(`/products/${id}`);
      } else {
        const { data: newProduct } = await createProduct(productData);
        onCreate(newProduct);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <h2>{id ? 'Edit Product' : 'Add New Product'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Form fields remain the same */}
      </form>
    </div>
  );
};

export default ProductForm;