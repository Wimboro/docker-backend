#!/bin/bash

# Setup script for Finance Tracker Backend Docker deployment
# This script helps set up the Docker environment for the application

set -e

echo "🐳 Finance Tracker Backend - Docker Setup"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    print_step "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed ✓"
}

# Create necessary directories
create_directories() {
    print_step "Creating necessary directories..."
    mkdir -p credentials
    print_status "Directories created ✓"
}

# Setup environment file
setup_environment() {
    print_step "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        if [ -f .env.docker ]; then
            cp .env.docker .env
            print_status "Environment file created from .env.docker ✓"
        else
            print_error ".env.docker file not found. Please ensure it exists."
            exit 1
        fi
    else
        print_warning "Environment file already exists. Skipping..."
    fi
}

# Check credentials
check_credentials() {
    print_step "Checking Google Service Account credentials..."
    
    if [ ! -f credentials/credentials.json ]; then
        print_warning "Google Service Account credentials not found!"
        echo ""
        echo "Please follow these steps:"
        echo "1. Go to the Google Cloud Console"
        echo "2. Create a service account with Google Sheets API access"
        echo "3. Download the credentials JSON file"
        echo "4. Copy it to: credentials/credentials.json"
        echo ""
        echo "A template file is available at: credentials/credentials.json.template"
        echo ""
        read -p "Do you want to continue without credentials? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Setup cancelled. Please add credentials and run again."
            exit 1
        fi
    else
        print_status "Credentials file found ✓"
    fi
}

# Build and run application
build_and_run() {
    print_step "Building and running the application..."
    
    # Ask for deployment type
    echo ""
    echo "Choose deployment type:"
    echo "1. Production (default)"
    echo "2. Development (with live reloading)"
    echo ""
    read -p "Enter your choice (1-2): " -n 1 -r
    echo
    
    case $REPLY in
        2)
            print_status "Starting in development mode..."
            docker-compose -f docker-compose.dev.yml --env-file .env up --build -d
            ;;
        *)
            print_status "Starting in production mode..."
            docker-compose --env-file .env up --build -d
            ;;
    esac
}

# Show status and next steps
show_status() {
    print_step "Checking application status..."
    
    # Wait a moment for the container to start
    sleep 3
    
    # Check if container is running
    if docker ps | grep -q "finance-tracker-backend"; then
        print_status "Application is running! ✓"
        echo ""
        echo "🎉 Setup completed successfully!"
        echo ""
        echo "Access your application:"
        echo "• Health check: http://localhost:4000/api/health"
        echo "• Debug endpoint: http://localhost:4000/api/debug-sheets"
        echo ""
        echo "Useful commands:"
        echo "• View logs: docker-compose logs -f"
        echo "• Stop application: docker-compose down"
        echo "• Restart: docker-compose restart"
        echo ""
    else
        print_error "Application failed to start. Check logs with: docker-compose logs"
        exit 1
    fi
}

# Main execution
main() {
    echo ""
    check_docker
    create_directories
    setup_environment
    check_credentials
    build_and_run
    show_status
}

# Run main function
main "$@" 