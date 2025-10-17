# Login Issues - Troubleshooting Guide

## Common Issues and Solutions

### 1. **Firebase Domain Authorization** (Most Likely Issue)
**Problem**: Firebase only allows authentication from authorized domains.
**Solution**: 
- Go to Firebase Console → Authentication → Settings → Authorized domains
- Add your testing domain (localhost, 127.0.0.1, or your actual domain)

### 2. **File Protocol Issues**
**Problem**: Opening HTML files directly (file://) doesn't work with Firebase auth.
**Solution**: Use a local web server:
```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000

# Option 3: Live Server extension in VS Code
```

### 3. **Browser Popup Blocking**
**Problem**: Google sign-in popup is blocked by browser.
**Solution**: 
- Allow popups for your domain
- The code already has fallback to redirect method

### 4. **Network/CORS Issues**
**Problem**: Browser blocking Firebase requests.
**Solution**: 
- Ensure you're using HTTPS or localhost
- Check browser console for CORS errors

## Testing Steps

1. **Open the debug file**: `login-debug.html`
2. **Check console logs** for specific error messages
3. **Test with a real email/password** (create account first if needed)
4. **Try Google sign-in** to see popup behavior

## Quick Fixes Applied

The diagnostic file will help identify the exact issue. Most likely you need to:
1. Add localhost to Firebase authorized domains
2. Use a proper web server instead of file:// protocol
