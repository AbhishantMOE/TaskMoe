// client/src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductsList from './components/ProductsList';
import ProductDetails from './components/ProductDetails';
import ProductForm from './components/ProductForm';
import { getProducts, deleteProduct } from './api/products';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products only once when app loads
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await getProducts();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleUpdate = (updatedProduct) => {
    setProducts(prev => prev.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
  };

  const handleCreate = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProductsList 
              products={products} 
              onDelete={handleDelete} 
            />
          } 
        />
        <Route 
          path="/products/:id" 
          element={
            <ProductDetails 
              products={products} 
              onDelete={handleDelete} 
            />
          } 
        />
        <Route 
          path="/products/new" 
          element={
            <ProductForm 
              onCreate={handleCreate} 
            />
          } 
        />
        <Route 
          path="/products/:id/edit" 
          element={
            <ProductForm 
              onUpdate={handleUpdate} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;