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
const makeApiRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url: `https://fakestoreapi.com${url}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (data) config.data = data;
    
    const response = await axios(config);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('API Error:', error.message);
    return { 
      success: false, 
      error: error.response?.data || error.message 
    };
  }
};

// CRUD Endpoints
app.get('/api/products', async (req, res) => {
  const result = await makeApiRequest('get', '/products');
  result.success ? res.json(result.data) : res.status(500).json(result.error);
});

app.get('/api/products/:id', async (req, res) => {
  const result = await makeApiRequest('get', `/products/${req.params.id}`);
  result.success ? res.json(result.data) : res.status(404).json(result.error);
});

app.post('/api/products', async (req, res) => {
  const result = await makeApiRequest('post', '/products', req.body);
  result.success ? res.status(201).json(result.data) : res.status(400).json(result.error);
});

app.put('/api/products/:id', async (req, res) => {
  const result = await makeApiRequest('put', `/products/${req.params.id}`, req.body);
  result.success ? res.json(result.data) : res.status(400).json(result.error);
});

app.delete('/api/products/:id', async (req, res) => {
  const result = await makeApiRequest('delete', `/products/${req.params.id}`);
  result.success ? res.json(result.data) : res.status(400).json(result.error);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
