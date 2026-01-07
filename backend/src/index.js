const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const AppDataSource = require('./infrastructure/database/data-source');
const specialistRoutes = require('./presentation/routes/specialist.routes');
const serviceOfferingMasterRoutes = require('./presentation/routes/serviceOfferingMaster.routes');
const errorHandler = require('./presentation/middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/specialists', specialistRoutes);
app.use('/api/service-offerings-master', serviceOfferingMasterRoutes);


// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Database connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error during Data Source initialization:', error);
    process.exit(1);
  });

module.exports = app;
