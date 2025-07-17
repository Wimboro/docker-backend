const express = require('express');
const { deleteRow, updateRow } = require('../utils/googleSheets'); // Import updateRow

const router = express.Router();

// Delete a row from Google Sheets
router.post('/delete-transaction', async (req, res) => {
  try {
    const { sheetId, rowIndex } = req.body;
    
    if (!sheetId || rowIndex === undefined) {
      return res.status(400).json({ message: 'Sheet ID and row index are required' });
    }
    
    console.log(`Attempting to delete row ${rowIndex} from sheet ${sheetId}`);
    
    await deleteRow(sheetId, rowIndex);
    res.status(200).json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    const errorMessage = error.message || 'Unknown error';
    res.status(500).json({ 
      message: 'Failed to delete transaction', 
      error: errorMessage,
      details: error.stack
    });
  }
});

// Edit a row in Google Sheets
router.post('/edit-transaction', async (req, res) => {
  try {
    const { sheetId, rowIndex, values } = req.body; // `values` will be an array of the new cell values for the row

    if (!sheetId || rowIndex === undefined || !values) {
      return res.status(400).json({ message: 'Sheet ID, row index, and values are required' });
    }

    if (!Array.isArray(values)) {
      return res.status(400).json({ message: 'Values must be an array' });
    }
    
    console.log(`Attempting to edit row ${rowIndex} in sheet ${sheetId} with values: ${JSON.stringify(values)}`);
    
    await updateRow(sheetId, rowIndex, values);
    res.status(200).json({ message: 'Transaction updated successfully' });
  } catch (error) {
    console.error('Error updating transaction:', error);
    const errorMessage = error.message || 'Unknown error';
    res.status(500).json({ 
      message: 'Failed to update transaction', 
      error: errorMessage,
      details: error.stack 
    });
  }
});

module.exports = router;
