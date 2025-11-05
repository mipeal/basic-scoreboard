# GitHub Pages Fix Summary

## What Changed

### 1. **API Connection Strategy**
   - **Development**: Uses Vite proxy at `/ctfd-api/*` to bypass CORS
   - **Production**: Makes direct API calls to your CTFd instance

### 2. **Login Behavior**
   - **No connection test**: The app now trusts your credentials immediately
   - **No upfront validation**: Credentials are saved and the dashboard loads right away
   - **Errors show later**: If credentials are wrong, you'll see errors when the dashboard tries to fetch data

### 3. **Why This Works**

#### Development (localhost)
- Vite dev server runs the proxy middleware
- All requests to `/ctfd-api/*` are proxied to your CTFd instance
- No CORS issues because the request comes from the same origin

#### Production (GitHub Pages)
- GitHub Pages serves only static files (no proxy)
- App makes direct API calls to `https://your-ctfd-instance.com/api/v1/*`
- **Your CTFd instance must have CORS enabled** to allow requests from your GitHub Pages domain

## CORS Requirements for Production

For this to work on GitHub Pages, your CTFd instance needs to send these CORS headers:

```
Access-Control-Allow-Origin: https://mipeal.github.io
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### How to Enable CORS on CTFd

If you control the CTFd instance, you can enable CORS by:

1. **Using CTFd Plugin**: Look for a CORS plugin in the CTFd plugin directory
2. **Nginx/Apache**: Add CORS headers in your reverse proxy configuration
3. **CTFd Config**: Modify CTFd's configuration to include CORS headers

Example Nginx configuration:
```nginx
location /api/ {
    add_header 'Access-Control-Allow-Origin' 'https://mipeal.github.io' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    
    if ($request_method = 'OPTIONS') {
        return 204;
    }
    
    proxy_pass http://ctfd-backend;
}
```

## If CORS Cannot Be Enabled

If you cannot enable CORS on the CTFd instance, you have two options:

1. **Use Demo Mode**: Click "Try Demo Mode" on the login page to see the interface with sample data

2. **Deploy Your Own Proxy**: Use the included proxy server (see `/proxy-server/` directory and `DEPLOYMENT.md`)

## Testing Your Changes

### Test Locally
```bash
pnpm dev
# The app will use the Vite proxy
```

### Test Production Build Locally
```bash
pnpm build
pnpm preview
# This simulates GitHub Pages (direct API calls)
```

### Deploy to GitHub Pages
```bash
git add .
git commit -m "Fix: Use direct API calls in production"
git push
```

## Troubleshooting

### Error: "Connection failed: API endpoint not found"
- **Cause**: The CTFd API endpoint doesn't exist or is not accessible
- **Solution**: Verify your CTFd instance URL is correct

### Error: "CORS policy error"
- **Cause**: CTFd instance doesn't allow requests from your GitHub Pages domain
- **Solution**: Enable CORS on the CTFd instance (see above)

### Error: "401 Unauthorized" or "403 Forbidden"
- **Cause**: Invalid API key or insufficient permissions
- **Solution**: Generate a new API key from your CTFd profile with proper permissions

### Data not loading after login
- **Cause**: API calls are failing silently
- **Solution**: Open browser DevTools (F12) and check the Console and Network tabs for errors

## Files Modified

1. `src/lib/ctfd-api.ts`: Updated to use direct API calls in production
2. `src/components/LoginForm.tsx`: Removed connection test, credentials are trusted immediately
3. Added documentation: `DEPLOYMENT.md`, `GITHUB_PAGES_FIX.md`
4. Added optional proxy server: `proxy-server/` (if you need it)

## Next Steps

1. Push your changes to GitHub
2. Wait for GitHub Actions to build and deploy
3. Test your GitHub Pages site
4. If you get CORS errors, follow the CORS setup guide above or use Demo Mode
