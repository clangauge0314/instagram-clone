const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const messageRoutes = require('./routes/message');

const app = express(); 
const port = process.env.PORT || 3000;
const connectDB = require('./utils/connectDB');

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/message', messageRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  connectDB();
  console.log(`Server running at http://localhost:${port}/`);
});