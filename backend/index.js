const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/user');

const app = express(); 
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

app.use('/api/user', userRoutes);

const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const connectDB = require('./utils/connectDB');

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(port, () => {
  connectDB();
  console.log(`Server running at http://localhost:${port}/`);
});