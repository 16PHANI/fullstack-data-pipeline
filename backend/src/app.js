'use strict';

require('dotenv').config();

const express      = require('express');
const cors         = require('cors');
const helmet       = require('helmet');
const morgan       = require('morgan');
const customerRoutes = require('./routes/customerRoutes');
const errorHandler   = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ----------------------------------------------------------------
// Global middleware
// ----------------------------------------------------------------
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// ----------------------------------------------------------------
// Routes
// ----------------------------------------------------------------
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));
app.use('/api/customers', customerRoutes);

// 404 catch
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));

// Centralised error handler
app.use(errorHandler);

// ----------------------------------------------------------------
// Start
// ----------------------------------------------------------------
if (require.main === module) {
  app.listen(PORT, () => console.log(`[Server] Running on http://localhost:${PORT}`));
}

module.exports = app;
