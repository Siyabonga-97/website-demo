# Digital Farmers - Firebase Authentication Setup

## Overview
This project has been enhanced with Firebase Authentication, supporting both email/password and Google sign-in methods.

## Files Added/Modified

### New Files:
- `firebase-config.js` - Firebase configuration using ES6 modules
- `auth.js` - Authentication module with ES6 modules
- `firebase-cdn.js` - Firebase configuration using CDN (recommended)
- `Login-cdn.html` - Login page using Firebase CDN
- `Register-cdn.html` - Registration page using Firebase CDN
- `package.json` - Project dependencies

### Modified Files:
- `index.html` - Updated with authentication state management
- `Login.html` - Enhanced with Firebase authentication
- `Register.html` - Enhanced with Firebase registration

## Quick Start (Recommended - CDN Version)

1. **Open the CDN version files directly in your browser:**
   - Main page: `index.html`
   - Login: `Login-cdn.html` 
   - Register: `Register-cdn.html`

2. **Firebase Setup:**
   - Your Firebase project is already configured with the provided credentials
   - Make sure to enable Authentication in your Firebase console
   - Enable Email/Password and Google sign-in methods

## Features

### Authentication Methods:
- ✅ Email and Password registration/login
- ✅ Google Sign-in
- ✅ Password reset functionality
- ✅ User session management
- ✅ Automatic logout functionality

### Security Features:
- Password validation (minimum 6 characters)
- Email format validation
- Terms and conditions acceptance
- Secure Firebase configuration

### User Experience:
- Real-time authentication state updates
- User welcome messages
- Error handling with user-friendly messages
- Smooth redirects after authentication
- Responsive design maintained

## Firebase Console Setup

1. **Enable Authentication:**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable "Email/Password"
   - Enable "Google" (add your domain to authorized domains)

2. **Authorized Domains:**
   - Add your domain (e.g., localhost, your-domain.com)
   - For local testing: `localhost` and `127.0.0.1`

## File Structure
```
Farmers/
├── index.html (main page with CDN Firebase)
├── Login-cdn.html (recommended login page)
├── Register-cdn.html (recommended register page)
├── firebase-cdn.js (Firebase CDN configuration)
├── Login.html (ES6 module version)
├── Register.html (ES6 module version)
├── firebase-config.js (ES6 module configuration)
├── auth.js (ES6 authentication module)
├── package.json
└── [existing files...]
```

## Usage Instructions

### For Users:
1. **Registration:** Use Register-cdn.html to create a new account
2. **Login:** Use Login-cdn.html to sign in
3. **Google Sign-in:** Click "Sign in with Google" button
4. **Forgot Password:** Enter email and click "Forgot Password?"
5. **Logout:** Click "Logout" in the navigation when signed in

### For Developers:
- Use the CDN version for immediate testing
- Use the ES6 module version if you prefer a build process
- All authentication logic is centralized in `firebase-cdn.js`

## Testing

1. Open `index.html` in your browser
2. Click "Login" → should redirect to `Login-cdn.html`
3. Try registering a new account
4. Try logging in with email/password
5. Try Google sign-in
6. Verify logout functionality

## Troubleshooting

### Common Issues:
1. **CORS Errors:** Use a local server (Live Server extension in VS Code)
2. **Google Sign-in Issues:** Check authorized domains in Firebase Console
3. **Module Import Errors:** Use CDN version instead of ES6 modules

### Browser Console:
- Check for authentication state logs
- Error messages will appear in console and on-screen

## Security Notes

- Firebase configuration is client-side visible (this is normal)
- Actual security is handled by Firebase Auth rules
- Never expose sensitive server keys in client-side code
- The provided configuration is safe for client-side use

## Next Steps

1. Test all authentication flows
2. Customize the UI styling as needed
3. Add user profile management
4. Implement role-based access control if needed
5. Add email verification (optional)

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify Firebase project settings
3. Ensure all files are in the same directory
4. Use a local server for testing (not file:// protocol)
