const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:3001', credentials: true }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('DB connected successfully'))
  .catch(err => console.error('DB connection error:', err));

app.use('/api/auth', require('./routes/auth'));

app.listen(3000, () => console.log('Server running on port 3000'));