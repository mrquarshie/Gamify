const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

// Connect to MongoDB
connectDB();

const corsOptions = {
  origin: ['*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE',],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));
app.use(express.json());


app.get('/', (req, res) => {
  res.json('Are you Authorized to be here?')
});

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});