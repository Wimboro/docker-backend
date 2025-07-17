# Docker Setup for Finance Tracker Backend

This document provides instructions for running the Finance Tracker Backend using Docker.

## Prerequisites

- Docker Engine 20.10 or higher
- Docker Compose 2.0 or higher
- Google Service Account credentials file

## Quick Start

1. **Clone the repository and navigate to the backend directory:**
   ```bash
   cd /path/to/your/project/backend
   ```

2. **Create credentials directory and add your Google Service Account credentials:**
   ```bash
   mkdir -p credentials
   # Copy your credentials.json file to the credentials directory
   cp /path/to/your/credentials.json credentials/
   ```

3. **Configure environment variables:**
   ```bash
   # Copy the Docker environment file
   cp .env.docker .env
   
   # Edit the .env file if needed
   nano .env
   ```

4. **Build and run the application:**
   ```bash
   # Using docker-compose with the .env.docker file
   docker-compose --env-file .env.docker up --build
   
   # Or run in detached mode
   docker-compose --env-file .env.docker up -d --build
   ```

5. **Access the application:**
   - Health check: http://localhost:4000/api/health
   - Debug endpoint: http://localhost:4000/api/debug-sheets

## Configuration

### Environment Variables

The application uses the following environment variables (configured in `.env.docker`):

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Application port | `4000` |
| `NODE_ENV` | Node environment | `production` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Google credentials file | `/app/credentials/credentials.json` |
| `CONTAINER_NAME` | Docker container name | `finance-tracker-backend` |
| `HOST_PORT` | Host port mapping | `4000` |
| `CONTAINER_PORT` | Container port | `4000` |
| `CREDENTIALS_HOST_PATH` | Host path for credentials | `./credentials` |
| `CREDENTIALS_CONTAINER_PATH` | Container path for credentials | `/app/credentials` |

### Customizing Configuration

1. **Change the port:**
   ```bash
   # Edit .env.docker
   HOST_PORT=3000
   CONTAINER_PORT=3000
   PORT=3000
   ```

2. **Use different credentials path:**
   ```bash
   # Edit .env.docker
   CREDENTIALS_HOST_PATH=/path/to/your/credentials
   ```

3. **Development mode:**
   ```bash
   # Edit .env.docker
   NODE_ENV=development
   ```

## Docker Commands

### Build the image:
```bash
docker build -t finance-tracker-backend .
```

### Run the container manually:
```bash
docker run -d \
  --name finance-tracker-backend \
  -p 4000:4000 \
  -v $(pwd)/credentials:/app/credentials:ro \
  -e NODE_ENV=production \
  -e PORT=4000 \
  -e GOOGLE_APPLICATION_CREDENTIALS=/app/credentials/credentials.json \
  finance-tracker-backend
```

### View logs:
```bash
# Docker Compose
docker-compose logs -f

# Docker container
docker logs -f finance-tracker-backend
```

### Stop the application:
```bash
# Docker Compose
docker-compose down

# Docker container
docker stop finance-tracker-backend
```

### Clean up:
```bash
# Remove containers and networks
docker-compose down --volumes

# Remove images
docker rmi finance-tracker-backend
```

## Health Checks

The application includes built-in health checks:

- **Docker health check**: Automatically checks application health every 30 seconds
- **Health endpoint**: `GET /api/health` - Returns detailed application status
- **Debug endpoint**: `GET /api/debug-sheets` - Tests Google Sheets API connection

## Troubleshooting

### Common Issues

1. **Credentials not found:**
   - Ensure `credentials.json` is in the `credentials/` directory
   - Check file permissions (should be readable by Docker)
   - Verify the `CREDENTIALS_HOST_PATH` in `.env.docker`

2. **Port already in use:**
   - Change `HOST_PORT` in `.env.docker`
   - Or stop the conflicting service: `sudo lsof -ti:4000 | xargs kill -9`

3. **Google Sheets API errors:**
   - Verify credentials file format
   - Check service account permissions
   - Test with the debug endpoint: `curl http://localhost:4000/api/debug-sheets`

4. **Container won't start:**
   - Check logs: `docker-compose logs`
   - Verify environment variables in `.env.docker`
   - Ensure Docker daemon is running

### Debug Commands

```bash
# Check container status
docker ps

# Execute commands in running container
docker exec -it finance-tracker-backend /bin/sh

# Check environment variables in container
docker exec finance-tracker-backend env

# Test health endpoint
curl http://localhost:4000/api/health

# Test with specific spreadsheet ID
curl "http://localhost:4000/api/debug-sheets?spreadsheetId=YOUR_SPREADSHEET_ID"
```

## Security Considerations

- Credentials file is mounted as read-only
- Application runs as non-root user (nodejs)
- Environment variables are used for configuration
- Health checks don't expose sensitive information

## Development

For development with live reloading:

1. **Create development docker-compose file:**
   ```yaml
   # docker-compose.dev.yml
   version: '3.8'
   services:
     backend:
       build:
         context: .
         dockerfile: Dockerfile
       volumes:
         - .:/app
         - /app/node_modules
         - ./credentials:/app/credentials:ro
       environment:
         - NODE_ENV=development
       command: npm run dev
   ```

2. **Run development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

## Production Deployment

For production deployment:

1. Use environment-specific configuration
2. Implement proper logging and monitoring
3. Use Docker secrets for sensitive data
4. Set up proper backup for credentials
5. Configure reverse proxy (nginx) if needed
6. Set up SSL/TLS certificates

## Support

For issues and questions:
- Check the main README.md for application-specific information
- Review Docker and Docker Compose documentation
- Check Google Sheets API documentation for credential setup 