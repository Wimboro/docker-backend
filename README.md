
# Finance Tracker Backend

This is a backend service for the Finance Tracker application that handles Google Sheets operations.

## Setup

### Option 1: Docker (Recommended)

The easiest way to run the application is using Docker:

1. **Quick Setup:**
   ```bash
   ./setup-docker.sh
   ```

2. **Manual Docker Setup:**
   ```bash
   # Create credentials directory and add your credentials.json
   mkdir -p credentials
   cp /path/to/your/credentials.json credentials/
   
   # Copy environment configuration
   cp .env.docker .env
   
   # Build and run
   docker-compose --env-file .env up --build
   ```

3. **Access the application:**
   - Health check: http://localhost:4000/api/health
   - Debug endpoint: http://localhost:4000/api/debug-sheets

For detailed Docker setup instructions, see [README.Docker.md](README.Docker.md).

### Option 2: Local Development

1. Make sure you have Node.js installed (v14 or higher recommended)
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
5. Place your `credentials.json` file in the backend directory (see Google Cloud Setup below)

## Google Cloud Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sheets API:
   - Navigate to APIs & Services > Library
   - Search for "Google Sheets API" and enable it
4. Create a Service Account:
   - Go to IAM & Admin > Service Accounts
   - Click "Create Service Account"
   - Fill in the details and grant necessary permissions
5. Generate a JSON key:
   - Click on the service account
   - Go to Keys tab
   - Add Key > Create new key > JSON
   - Save the downloaded JSON file as `credentials.json` in your backend directory
6. Share your Google Sheet with the service account email (giving it edit permissions)

## Running the Server

Development mode (with auto-restart):
```
npm run dev
```

Production mode:
```
npm start
```

## Connecting to Frontend

Make sure the `BACKEND_API_URL` in `src/utils/googleSheets.ts` points to your backend server:

```typescript
const BACKEND_API_URL = "http://localhost:4000/api"; 
```

If you deploy the backend to a server, update this URL accordingly.

## API Endpoints

### Delete Transaction
- **URL**: `/api/delete-transaction`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "sheetId": "your-sheet-id",
    "rowIndex": 5
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Transaction deleted successfully"
  }
  ```

### Health Check
- **URL**: `/api/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "status": "OK",
    "message": "Backend service is running"
  }
  ```
