# Security Guide - Credentials Management

## Important: Never Commit Credentials!

This project uses sensitive credentials that **MUST NOT** be committed to version control.

## Backend Credentials

### Firebase Service Account Key

1. **Location**: `server/src/config/serviceAccountKey.json`
2. **Status**: Already in `.gitignore` - DO NOT COMMIT THIS FILE
3. **How to setup**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `phonic-presence-417323`
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save the downloaded JSON file as `server/src/config/serviceAccountKey.json`

### Environment Variables

Create a `.env` file in the `server/` directory:

```env
PORT=3000
NODE_ENV=development
```

## Frontend Configuration

### Environment Variables

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:3000
VITE_NODE_ENV=development
```

For production:
```env
VITE_API_URL=https://your-api-domain.com
VITE_NODE_ENV=production
```

## Files in .gitignore

### Backend (`server/.gitignore`)
- `serviceAccountKey.json` (and all variations)
- `.env` files
- `node_modules/`
- Build outputs
- Log files

### Frontend (`client/.gitignore`)
- `.env` files
- `node_modules/`
- Build outputs
- Log files

## Security Checklist

- [ ] `serviceAccountKey.json` is NOT committed
- [ ] `.env` files are NOT committed
- [ ] All `.gitignore` files are up to date
- [ ] No hardcoded credentials in code
- [ ] API URLs use environment variables
- [ ] Production uses secure environment variables

## If Credentials Are Accidentally Committed

1. **IMMEDIATELY** rotate/regenerate all exposed credentials:
   - Regenerate Firebase service account key
   - Change any passwords or API keys
   
2. Remove from git history:
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch server/src/config/serviceAccountKey.json" \
     --prune-empty --tag-name-filter cat -- --all
   ```

3. Force push (coordinate with team first!)

## Best Practices

- Use environment variables for all sensitive data
- Never commit `.env` files
- Use `.env.example` files to document required variables
- Regularly audit `.gitignore` files
- Use different credentials for development and production

