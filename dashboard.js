// dashboard.js
// Current User State
let currentUser = null;

// DOM Elements
const profileAvatar = document.getElementById('profile-avatar');
const profileUsername = document.getElementById('profile-username');
const userPhone = document.getElementById('user-phone');
const headerActions = document.getElementById('header-actions');
const signOutBtn = document.getElementById('sign-out-btn');
const createBetBtn = document.getElementById('create-bet-btn'); // Fixed this line
const dashboardBetsGrid = document.getElementById('dashboard-bets-grid');
const userBetsGrid = document.getElementById('user-bets-grid');
const createBetSidebar = document.getElementById('create-bet-sidebar');

// Initialize dashboard
function initDashboard() {
    // Load current user
    currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = 'auth.html';
        return;
    }
    
    // Update UI with user data
    updateUserUI();
    
    // Render bets
    renderBets('dashboard-bets-grid', getBets());
    renderBets('user-bets-grid', getUserBets(), true);
    
    // Event listeners
    signOutBtn.addEventListener('click', signOut);
    
    // FIXED: Properly attach event listener to create bet button
    if (createBetBtn) {
        createBetBtn.addEventListener('click', createBet);
    } else {
        console.error("Create Bet button not found!");
    }
    
    createBetSidebar.addEventListener('click', scrollToCreateBet);
    
    // Set default end date to 7 days from now
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    document.getElementById('end-date').value = nextWeek.toISOString().split('T')[0];
}

// Update UI with user data
function updateUserUI() {
    const firstLetter = currentUser.username.charAt(0).toUpperCase();
    
    profileAvatar.textContent = firstLetter;
    profileUsername.textContent = currentUser.username;
    userPhone.textContent = currentUser.phone;
    
    headerActions.innerHTML = `
        <div class="user-info">
            <div class="wallet">
                <i class="fas fa-wallet"></i>
                <span>$1,250.00</span>
            </div>
            <div class="user-profile">
                <div class="user-avatar">${firstLetter}</div>
                <span>${currentUser.username}</span>
            </div>
        </div>
    `;
}

// Sign out function
function signOut() {
    clearCurrentUser();
    window.location.href = 'index.html';
}

// Scroll to create bet section
function scrollToCreateBet(e) {
    e.preventDefault();
    document.querySelector('.create-bet-section').scrollIntoView({ behavior: 'smooth' });
}

// Create new bet
function createBet() {
    const title = document.getElementById('bet-title').value;
    const category = document.getElementById('bet-category').value;
    const option1 = document.getElementById('option1').value;
    const option2 = document.getElementById('option2').value;
    const endDate = document.getElementById('end-date').value;
    
    if (!title) {
        showNotification('Validation Error', 'Please enter a bet question');
        return;
    }
    
    const newBet = {
        id: Date.now(), // Simple unique ID
        title,
        category,
        createdBy: currentUser.username,
        totalAmount: 0,
        yesAmount: 0,
        noAmount: 0,
        participants: 0,
        endDate: new Date(endDate),
        options: [
            { name: option1, odds: 2.0 },
            { name: option2, odds: 2.0 }
        ]
    };
    
    // Add to database
    const bets = [...getBets(), newBet];
    setBets(bets);
    
    const userBets = [...getUserBets(), newBet];
    setUserBets(userBets);
    
    // Update UI
    renderBets('dashboard-bets-grid', bets);
    renderBets('user-bets-grid', userBets, true);
    
    // Clear form
    document.getElementById('bet-title').value = '';
    document.getElementById('bet-description').value = '';
    
    showNotification('Bet Created!', `"${title}" is now active!`);
}

// Place a Bet
function placeBet(betId, option) {
    const betAmount = prompt(`How much do you want to bet on ${option.toUpperCase()}? (Min: $5)`);
    if (betAmount && parseFloat(betAmount) >= 5) {
        const amount = parseFloat(betAmount);
        
        // Find the bet
        const bets = getBets();
        const betIndex = bets.findIndex(b => b.id === betId);
        
        if (betIndex === -1) return;
        
        // Update bet amounts
        if (option === bets[betIndex].options[0].name) {
            bets[betIndex].yesAmount += amount;
        } else {
            bets[betIndex].noAmount += amount;
        }
        
        bets[betIndex].totalAmount += amount;
        bets[betIndex].participants++;
        
        // Update database
        setBets(bets);
        
        // Update UI
        renderBets('dashboard-bets-grid', bets);
        renderBets('user-bets-grid', getUserBets(), true);
        showNotification('Bet Placed!', `You've bet $${amount} on ${option.toUpperCase()}`);
    } else if (betAmount) {
        alert('Minimum bet amount is $5. Please try again.');
    }
}

// Start the dashboard
document.addEventListener('DOMContentLoaded', initDashboard);