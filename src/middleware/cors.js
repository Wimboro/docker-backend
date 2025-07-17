
const cors = require('cors');

// Configure CORS middleware to allow all origins
const setupCors = () => cors({
  origin: '*',
  credentials: true
});

module.exports = setupCors;
