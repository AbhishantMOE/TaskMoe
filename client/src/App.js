// client/src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProductsList from './components/ProductsList';
import ProductDetails from './components/ProductDetails';
import ProductForm from './components/ProductForm';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { getProducts, deleteProduct } from './api/products';
import './App.css';

function AppContent() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
            <ProtectedRoute>
              <ProductForm onCreate={handleCreate} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products/:id/edit" 
          element={
            <ProtectedRoute>
              <ProductForm onUpdate={handleUpdate} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;