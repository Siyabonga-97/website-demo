// Firebase CDN Configuration and Authentication
// This file uses Firebase CDN instead of modules for easier setup

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA27QB_PBo3wXq055FwLWYYrPMl0YuOvoI",
  authDomain: "siyabonga07-dbbab.firebaseapp.com",
  projectId: "siyabonga07-dbbab",
  storageBucket: "siyabonga07-dbbab.firebasestorage.app",
  messagingSenderId: "353614005039",
  appId: "1:353614005039:web:51e2b55cdf19afb11bd7da",
  measurementId: "G-JBL9YC56TZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

// Configure Google provider for better UX
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  'prompt': 'select_account'
});

// Authentication functions
window.FirebaseAuth = {
  // Register with email and password
  registerWithEmail: async function(email, password) {
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log('User registered successfully:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Sign in with email and password
  signInWithEmail: async function(email, password) {
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      console.log('User signed in successfully:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('Sign in error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Sign in with Google
  signInWithGoogle: async function() {
    try {
      // Try popup first, fallback to redirect if needed
      let result;
      try {
        result = await auth.signInWithPopup(googleProvider);
      } catch (popupError) {
        console.log('Popup error, trying redirect...', popupError);
        
        // Check if it's a popup blocked error
        if (popupError.code === 'auth/popup-blocked' || 
            popupError.code === 'auth/cancelled-popup-request' ||
            popupError.message.includes('popup')) {
          console.log('Using redirect method...');
          await auth.signInWithRedirect(googleProvider);
          return { success: true, redirect: true };
        } else {
          throw popupError; // Re-throw if it's not a popup issue
        }
      }
      
      const user = result.user;
      console.log('User signed in with Google:', user.email);
      return { success: true, user };
    } catch (error) {
      console.error('Google sign in error:', error);
      
      // Handle specific error cases
      let errorMessage = error.message;
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by browser. Please allow popups and try again.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Google sign-in. Please contact support.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google sign-in is not enabled. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      }
      
      return { success: false, error: errorMessage };
    }
  },

  // Sign out
  signOutUser: async function() {
    try {
      await auth.signOut();
      console.log('User signed out successfully');
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Reset password
  resetPassword: async function(email) {
    try {
      await auth.sendPasswordResetEmail(email);
      console.log('Password reset email sent');
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error.message);
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: function() {
    return auth.currentUser;
  },

  // Check if user is authenticated
  isAuthenticated: function() {
    return auth.currentUser !== null;
  },

  // Initialize auth state listener
  initializeAuth: function() {
    return new Promise((resolve) => {
      // Check for redirect result first
      auth.getRedirectResult().then((result) => {
        if (result.user) {
          console.log('User signed in via redirect:', result.user.email);
          // Redirect to main page after successful Google sign-in
          if (window.location.pathname.includes('Login') || window.location.pathname.includes('Register')) {
            window.location.href = 'index.html';
          }
        }
      }).catch((error) => {
        console.error('Redirect result error:', error);
      });

      auth.onAuthStateChanged((user) => {
        if (user) {
          console.log('User is signed in:', user.email);
          this.updateUIForAuthenticatedUser(user);
          resolve(user);
        } else {
          console.log('User is signed out');
          this.updateUIForUnauthenticatedUser();
          resolve(null);
        }
      });
    });
  },

  // UI update functions
  updateUIForAuthenticatedUser: function(user) {
    const authLink = document.getElementById('auth-link');
    if (authLink) {
      authLink.textContent = 'Logout';
      authLink.href = '#';
      authLink.onclick = (e) => {
        e.preventDefault();
        this.handleLogout();
      };
    }

    const userInfo = document.getElementById('user-info');
    if (userInfo) {
      userInfo.textContent = `Welcome, ${user.email}!`;
      userInfo.style.display = 'block';
    }
  },

  updateUIForUnauthenticatedUser: function() {
    const authLink = document.getElementById('auth-link');
    if (authLink) {
      authLink.textContent = 'Login';
      authLink.href = 'Login.html';
      authLink.onclick = null;
    }

    const userInfo = document.getElementById('user-info');
    if (userInfo) {
      userInfo.style.display = 'none';
    }
  },

  // Handle logout
  handleLogout: async function() {
    const result = await this.signOutUser();
    if (result.success) {
      window.location.href = 'Login.html';
    } else {
      alert('Error logging out. Please try again.');
    }
  }
};
