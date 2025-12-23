# Environment Setup Guide

This project supports multiple environment configurations for different deployment targets.

## Available Environments

- **pod1** - Development Pod 1
- **pod2** - Development Pod 2
- **pod3** - Development Pod 3
- **prod1** - Production Environment 1
- **prod2** - Production Environment 2
- **testProd** - Test Production Environment

## Environment Files

Each environment has its own configuration file:
- `.env.pod1`
- `.env.pod2`
- `.env.pod3`
- `.env.prod1`
- `.env.prod2`
- `.env.testProd`
- `.env.example` - Template file (safe to commit)

## Usage

### Method 1: Use NPM Scripts (Recommended)
Each environment has dedicated npm scripts for both development and production modes:

#### Development Mode (with hot reload)
```bash
npm run dev:pod1       # Development Pod 1
npm run dev:pod2       # Development Pod 2
npm run dev:pod3       # Development Pod 3
npm run dev:prod1      # Production 1 (dev mode)
npm run dev:prod2      # Production 2 (dev mode)
npm run dev:testProd   # Test Production (dev mode)
```

#### Production Mode
```bash
npm run start:pod1       # Start with Pod 1 config
npm run start:pod2       # Start with Pod 2 config
npm run start:pod3       # Start with Pod 3 config
npm run start:prod1      # Start with Production 1 config
npm run start:prod2      # Start with Production 2 config
npm run start:testProd   # Start with Test Production config
```

### Method 2: Copy the desired environment file to .env
```bash
# For pod1
Copy-Item .env.pod1 .env

# For production 1
Copy-Item .env.prod1 .env

# Then run standard commands
npm run dev    # Development mode
npm start      # Production mode
```

## Configuration Variables

### Server Configuration
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### CORS Configuration
- `CORS_ORIGIN` - Allowed CORS origins (default: *)

### API Endpoints
- `APP_GATEWAY_URL` - Main API gateway URL
- `ENRICH_LEAD_URL` - Lead enrichment API endpoint
- `ENRICH_ACCOUNT_URL` - Account enrichment API endpoint

### Optional
- `USER_AGENT` - Custom user agent string

## Security Notes

⚠️ **Important**: All `.env.*` files (except `.env.example`) are gitignored to prevent accidentally committing sensitive credentials.

## Customizing Environments

1. Copy `.env.example` to create a new environment file
2. Update the `APP_GATEWAY_URL` and other endpoints as needed
3. Add the new file to `.gitignore` if it contains sensitive data
4. Document the new environment in this file
