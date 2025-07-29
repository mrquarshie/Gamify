const express = require('express');
const app = express();
const PORT = 3001; // or any port you prefer

// Middleware to parse JSON requests
app.use(express.json());

// Serve static files from your frontend (if needed)
app.use(express.static('../frontend/dist')); // Adjust path to your frontend build

// Example API route
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from Node.js backend!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});