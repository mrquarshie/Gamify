// auth.js
// DOM Elements
const signupTab = document.getElementById('signup-tab');
const signinTab = document.getElementById('signin-tab');
const signupForm = document.getElementById('signupForm');
const signinForm = document.getElementById('signinForm');

// Initialize auth page
function initAuthPage() {
    // Set up tab switching
    signupTab.addEventListener('click', () => switchTab('signup'));
    signinTab.addEventListener('click', () => switchTab('signin'));
    
    // Form submissions
    signupForm.addEventListener('submit', signUp);
    signinForm.addEventListener('submit', signIn);
    
    // Set default end date to 7 days from now
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    document.getElementById('end-date').value = nextWeek.toISOString().split('T')[0];
}

// Switch tabs in auth page
function switchTab(tabId) {
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    document.getElementById(`${tabId}-tab`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// Sign Up Function
function signUp(event) {
    event.preventDefault();
    
    const phone = document.getElementById('signup-phone').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('signup-password').value;
    const countryCode = document.getElementById('country-code').value;
    
    // Simple validation
    if(!phone || !username || !password) {
        showNotification('Validation Error', 'Please fill in all fields');
        return;
    }
    
    if(phone.length < 9) {
        showNotification('Validation Error', 'Please enter a valid phone number');
        return;
    }
    
    if(password.length < 6) {
        showNotification('Validation Error', 'Password must be at least 6 characters');
        return;
    }
    
    // Create user
    const newUser = {
        id: Date.now(), // Simple unique ID
        username,
        phone: `${countryCode} ${phone}`,
        joinedDate: new Date()
    };
    
    // Save user to localStorage
    setCurrentUser(newUser);
    
    // Redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Sign In Function
function signIn(event) {
    event.preventDefault();
    
    const phone = document.getElementById('signin-phone').value;
    const password = document.getElementById('signin-password').value;
    
    // Simple validation
    if(!phone || !password) {
        showNotification('Validation Error', 'Please fill in all fields');
        return;
    }
    
    // In a real app, this would verify credentials
    // For demo, just redirect to dashboard
    window.location.href = 'dashboard.html';
}

// Start the auth page
document.addEventListener('DOMContentLoaded', initAuthPage);