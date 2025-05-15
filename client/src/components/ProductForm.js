// client/src/components/ProductForm.js
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, updateProduct, getProduct } from '../api/products';
import defaultProductImage from '../assets/default-product.jpg'; // Import your default image

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

  const [imagePreview, setImagePreview] = useState(defaultProductImage);

const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);


  useEffect(() => {
    if (id && id !== 'new') {
      const fetchProduct = async () => {
        try {
          const { data } = await getProduct(id);
          setProduct(data);
          setImagePreview(data.image || defaultProductImage);
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
    if (name === 'image') {
        setImagePreview(value || defaultProductImage);
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = {
        ...product,
        price: parseFloat(product.price),
        image: product.image || defaultProductImage
      };

      if(productData.image) setImagePreview(productData.image)

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





  const handleImageError = () => {
    // Fallback to default image if the provided URL fails to load
    setImagePreview(defaultProductImage);
  };




  return (
    <div className="product-form">
      <h2>{id ? 'Edit Product' : 'Add New Product'}</h2>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>

        {/* Image Preview Section */}
        <div className="form-group image-preview-group">
          <label>Product Image</label>
          <div className="image-preview-container">
            <img 
              src={imagePreview} 
              alt="Product preview" 
              className="image-preview"
              onError={handleImageError}
            />
          </div>
          <input
            type="url"
            name="image"
            value={product.image}
            onChange={handleChange}
            placeholder="Enter image URL or leave blank for default"
          />
          <p className="image-hint">Leave empty to use default image</p>
        </div>




        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className="form-group">
          <label>Image URL</label>
          <input
            type="url"
            name="image"
            value={product.image}
            onChange={handleChange}
            required
          />
        </div> */}

        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          >
            <option value="electronics">Electronics</option>
            <option value="jewelery">Jewelery</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/')}>
            Cancel
          </button>
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;