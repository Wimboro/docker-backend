
const express = require('express');
const { PORT } = require('./src/config');
const setupCors = require('./src/middleware/cors');
const transactionRoutes = require('./src/routes/transactions');
const debugRoutes = require('./src/routes/debug');

const app = express();

// Parse JSON requests
app.use(express.json());

// Configure CORS middleware
app.use(setupCors());

// Register routes
app.use('/api', transactionRoutes);
app.use('/api', debugRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Using credentials from: ${require('./src/config').getCredentialsPath()}`);
  console.log('CORS configured to allow all origins');
});
