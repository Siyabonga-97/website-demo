import { auth, googleProvider } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged,
    sendPasswordResetEmail 
} from "firebase/auth";

// Authentication state management
export const initializeAuth = () => {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                console.log('User is signed in:', user.email);
                updateUIForAuthenticatedUser(user);
                resolve(user);
            } else {
                // User is signed out
                console.log('User is signed out');
                updateUIForUnauthenticatedUser();
                resolve(null);
            }
        });
    });
};

// Register with email and password
export const registerWithEmail = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User registered successfully:', user.email);
        return { success: true, user };
    } catch (error) {
        console.error('Registration error:', error.message);
        return { success: false, error: error.message };
    }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed in successfully:', user.email);
        return { success: true, user };
    } catch (error) {
        console.error('Sign in error:', error.message);
        return { success: false, error: error.message };
    }
};

// Sign in with Google
export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log('User signed in with Google:', user.email);
        return { success: true, user };
    } catch (error) {
        console.error('Google sign in error:', error.message);
        return { success: false, error: error.message };
    }
};

// Sign out
export const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log('User signed out successfully');
        return { success: true };
    } catch (error) {
        console.error('Sign out error:', error.message);
        return { success: false, error: error.message };
    }
};

// Reset password
export const resetPassword = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        console.log('Password reset email sent');
        return { success: true };
    } catch (error) {
        console.error('Password reset error:', error.message);
        return { success: false, error: error.message };
    }
};

// UI update functions
const updateUIForAuthenticatedUser = (user) => {
    // Update navigation to show user info and logout
    const navbar = document.querySelector('.navbar ul');
    if (navbar) {
        const loginLink = navbar.querySelector('a[href="Login.html"]');
        if (loginLink) {
            loginLink.textContent = 'Logout';
            loginLink.href = '#';
            loginLink.onclick = (e) => {
                e.preventDefault();
                handleLogout();
            };
        }
    }

    // Show user email in header if element exists
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.textContent = `Welcome, ${user.email}`;
        userInfo.style.display = 'block';
    }
};

const updateUIForUnauthenticatedUser = () => {
    // Reset navigation to show login link
    const navbar = document.querySelector('.navbar ul');
    if (navbar) {
        const logoutLink = navbar.querySelector('a[onclick]');
        if (logoutLink) {
            logoutLink.textContent = 'Login';
            logoutLink.href = 'Login.html';
            logoutLink.onclick = null;
        }
    }

    // Hide user info
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.style.display = 'none';
    }
};

// Handle logout
const handleLogout = async () => {
    const result = await signOutUser();
    if (result.success) {
        window.location.href = 'Login.html';
    }
};

// Get current user
export const getCurrentUser = () => {
    return auth.currentUser;
};

// Check if user is authenticated
export const isAuthenticated = () => {
    return auth.currentUser !== null;
};
