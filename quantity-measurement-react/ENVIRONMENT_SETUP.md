# Environment Configuration Guide

## Environment Files

This project uses Vite's environment variable system with the following priority:

1. `.env.local` - Highest priority (should be in .gitignore)
2. `.env.production` - Production environment
3. `.env.staging` - Staging environment  
4. `.env.development` - Development environment (default)
5. `.env` - Base environment file

## Available Environment Files

### Development (.env.development)
- API URL: http://localhost:5084/api
- Debug mode: enabled
- For local development

### Staging (.env.staging)
- API URL: https://staging-api.unitmaster.com/api
- Debug mode: disabled
- For testing/staging deployments

### Production (.env.production)
- API URL: https://api.unitmaster.com/api
- Debug mode: disabled
- For production deployments

### Local Override (.env.local)
- Create this file for your specific local settings
- This file should NOT be committed to version control
- Copy from .env.example and modify as needed

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | http://localhost:5084/api |
| `VITE_APP_NAME` | Application name | UnitMaster |
| `VITE_APP_VERSION` | Application version | 1.0.0 |
| `VITE_ENVIRONMENT` | Environment name | development |
| `VITE_DEBUG` | Enable debug mode | true |

## Usage

### Setup Local Development
1. Copy `.env.example` to `.env.local`
2. Update values in `.env.local` as needed
3. Restart development server

### Switch Environments
```bash
# Development (default)
npm run dev

# Production build
npm run build

# Staging build (if needed)
npm run build -- --mode staging
```

### Access Environment Variables in Code
```javascript
// In any component/file
const apiUrl = import.meta.env.VITE_API_BASE_URL;
const isDebug = import.meta.env.VITE_DEBUG === 'true';
```

## Deployment

### Production Deployment
- Uses `.env.production` automatically
- Ensure production variables are set correctly

### Staging Deployment
- Uses `.env.staging` when built with `--mode staging`
- Override with `VITE_API_BASE_URL` environment variable if needed

## Security Notes

- Never commit `.env.local` to version control
- Never commit sensitive API keys or secrets
- Use environment-specific files for different deployment targets
- All variables must be prefixed with `VITE_` to be exposed to the browser
