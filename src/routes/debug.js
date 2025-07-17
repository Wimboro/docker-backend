
const express = require('express');
const fs = require('fs');
const { setupGoogleSheets } = require('../utils/googleSheets');
const { getCredentialsPath } = require('../config');

const router = express.Router();

// Add a debug endpoint to test Google Sheets API connection
router.get('/debug-sheets', async (req, res) => {
  try {
    console.log('Testing Google Sheets API connection...');
    const sheets = setupGoogleSheets();
    
    // Optional: Provide a spreadsheet ID to test with
    const spreadsheetId = req.query.spreadsheetId || '1z_24OJndRjgGpV83iNDhUlx1WQMpHBVkcwvmAkizfjk';
    
    // Test getting spreadsheet info
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId
    });
    
    res.status(200).json({
      status: 'OK',
      message: 'Google Sheets API connection successful',
      spreadsheetTitle: spreadsheet.data.properties?.title || 'Unknown',
      sheets: spreadsheet.data.sheets?.map(sheet => ({
        title: sheet.properties?.title,
        sheetId: sheet.properties?.sheetId,
      })) || []
    });
  } catch (error) {
    console.error('Error testing Google Sheets API:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Failed to connect to Google Sheets API',
      error: error.message,
      stack: error.stack
    });
  }
});

// Add a more comprehensive health check endpoint
router.get('/health', (req, res) => {
  try {
    // Check if credentials file exists
    const credentialsPath = getCredentialsPath();
    const credentialsExist = fs.existsSync(credentialsPath);
    
    // Read credentials file content (partly redacted for security)
    let credentialsInfo = null;
    if (credentialsExist) {
      try {
        const credentialsContent = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
        credentialsInfo = {
          type: credentialsContent.type,
          project_id: credentialsContent.project_id,
          client_email: credentialsContent.client_email,
          has_private_key: !!credentialsContent.private_key
        };
      } catch (err) {
        console.error('Error reading credentials file:', err);
      }
    }
    
    // Verify we can initialize Google Sheets API
    let sheetsApiInitialized = false;
    let initError = null;
    
    try {
      setupGoogleSheets();
      sheetsApiInitialized = true;
    } catch (err) {
      initError = err.message;
    }
    
    res.status(200).json({ 
      status: sheetsApiInitialized ? 'OK' : 'ERROR', 
      message: 'Backend service is running',
      credentialsFound: credentialsExist,
      credentialsPath: credentialsPath,
      credentialsInfo: credentialsInfo,
      sheetsApiInitialized,
      initError,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 4000
      },
      cors: {
        allowedOrigins: '*'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'ERROR', 
      message: error.message || 'Unknown error occurred during health check',
      stack: error.stack
    });
  }
});

module.exports = router;
