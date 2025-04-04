require('dotenv').config();  // loads MONGO_URI from .env

const mongoose = require('mongoose');
const app = require('./app');  // Express app

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`✅ Server is running at http://${HOST}:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ DB connection error:', err);
  });
