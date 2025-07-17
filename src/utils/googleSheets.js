const { google } = require('googleapis');
const fs = require('fs');
const { getCredentialsPath } = require('../config');

// Setup Google Sheets API authentication using credentials.json file
const setupGoogleSheets = () => {
  const credentialsPath = getCredentialsPath();
  console.log(`Looking for credentials at: ${credentialsPath}`);
  
  if (!fs.existsSync(credentialsPath)) {
    console.error(`Error: Credentials file not found at ${credentialsPath}`);
    throw new Error(`Credentials file not found at ${credentialsPath}`);
  }
  
  try {
    // Use this specific file path for authentication
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error('Error setting up Google Sheets API:', error);
    throw new Error(`Failed to set up Google Sheets API: ${error.message}`);
  }
};

// Get spreadsheet and sheet information
const getSpreadsheetDetails = async (sheets, spreadsheetId) => {
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
  });
  
  if (!spreadsheet.data.sheets || spreadsheet.data.sheets.length === 0) {
    throw new Error('No sheets found in the spreadsheet');
  }
  
  // Assuming we're using the first sheet
  const sheetName = spreadsheet.data.sheets[0].properties.title;
  const sheetId = spreadsheet.data.sheets[0].properties.sheetId;
  console.log(`Using sheet: ${sheetName} with ID: ${sheetId}`);
  
  return {
    sheetName,
    sheetId,
    spreadsheet
  };
};

// Delete a row from Google Sheets
const deleteRow = async (spreadsheetId, rowIndex) => {
  const sheets = setupGoogleSheets();
  
  const { sheetId, sheetName } = await getSpreadsheetDetails(sheets, spreadsheetId); // Ensure sheetName is also retrieved
  
  // Delete the row using batchUpdate with deleteRows
  const deleteResponse = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: sheetId, // Use the numeric sheetId here
              dimension: 'ROWS',
              startIndex: rowIndex - 1, // Convert to 0-based index
              endIndex: rowIndex // Only delete one row
            }
          }
        }
      ]
    }
  });
  
  console.log('Delete response:', JSON.stringify(deleteResponse.data));
  return deleteResponse;
};

// Update a row in Google Sheets
const updateRow = async (spreadsheetId, rowIndex, values) => {
  const sheets = setupGoogleSheets();
  const { sheetName } = await getSpreadsheetDetails(sheets, spreadsheetId);

  // Construct the range string, e.g., 'Sheet1!A5' if rowIndex is 5
  // This assumes you want to update starting from column A.
  // If you need to update specific columns, the range needs to be more specific,
  // or you might need to fetch the existing row to preserve other column values.
  // For simplicity, this example updates the entire row starting from column A.
  // The number of columns updated will be determined by the length of the `values` array.
  const range = `${sheetName}!A${rowIndex}`;

  console.log(`Attempting to update row ${rowIndex} in sheet ${sheetName} of spreadsheet ${spreadsheetId} with values: ${JSON.stringify(values)} at range ${range}`);

  const updateResponse = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range, // e.g., 'Sheet1!A5'
    valueInputOption: 'USER_ENTERED', // or 'RAW'
    requestBody: {
      values: [values], // `values` should be an array of values for the row, e.g., ["New Value1", "New Value2"]
    },
  });

  console.log('Update response:', JSON.stringify(updateResponse.data));
  return updateResponse;
};

module.exports = {
  setupGoogleSheets,
  getSpreadsheetDetails,
  deleteRow,
  updateRow // Export the new function
};
