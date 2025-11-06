const express = require('express');
const cors = require("cors");
require('dotenv').config();

const connectDB = require('./config/db');
connectDB();

const app = express();

app.use(cors());

app.use(express.json());

// ✅ Your routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/game', require('./routes/gameRoutes'));

app.get('/', (req, res) => res.send('Game Dot'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
