
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Get the absolute path to credentials.json based on the backend directory
const getCredentialsPath = () => {
  // Check if GOOGLE_APPLICATION_CREDENTIALS is set in .env file
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    // If it's an absolute path, use it directly
    if (path.isAbsolute(process.env.GOOGLE_APPLICATION_CREDENTIALS)) {
      return process.env.GOOGLE_APPLICATION_CREDENTIALS;
    } else {
      // If it's a relative path, resolve it from the backend directory
      return path.resolve(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS);
    }
  }
  // Default fallback path
  return path.resolve(process.cwd(), './credentials.json');
};

const PORT = process.env.PORT || 4000;

module.exports = {
  getCredentialsPath,
  PORT
};
