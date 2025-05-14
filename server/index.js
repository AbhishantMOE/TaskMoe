import express from 'express';
import cors from 'cors';
import axios from 'axios';


const PORT = process.env.PORT || 5000;


// Enable CORS for your React app



const app = express();

app.use(express.json());

app.use(cors());

//endpoints

// Products endpoint
app.get('/api/products', async (req, res) => {
  try {
    console.log('Attempting to fetch products from FakeStoreAPI...');
    const response = await axios.get('https://fakestoreapi.com/products');
    console.log('Successfully fetched products');
    res.json(response.data);
  } catch (error) {
    console.error('Full error object:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : 'No response',
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error fetching products',
      internalError: error.message 
    });
  }
});
  
  // Single product endpoint
  app.get('/api/products/:id', async (req, res) => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products/${req.params.id}`);
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching product' });
    }
  });


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

export default app;
