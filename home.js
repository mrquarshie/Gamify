// home.js
// Current User State
let currentUser = null;

// DOM Elements
const createBetBtn = document.getElementById('create-bet-btn');
const homeBetsGrid = document.getElementById('home-bets-grid');
const headerActions = document.getElementById('header-actions');

// Initialize the home page
function initHomePage() {
    // Load current user
    currentUser = getCurrentUser();
    updateHeader();
    
    // Render bets
    const bets = getBets();
    renderBets('home-bets-grid', bets);
    
    // Event listeners
    createBetBtn.addEventListener('click', () => {
        if (currentUser) {
            window.location.href = 'dashboard.html';
        } else {
            window.location.href = 'auth.html';
        }
    });
}

// Update header based on user state
function updateHeader() {
    if (currentUser) {
        headerActions.innerHTML = `
            <div class="user-info">
                <div class="wallet">
                    <i class="fas fa-wallet"></i>
                    <span>$1,250.00</span>
                </div>
                <div class="user-profile">
                    <div class="user-avatar">${currentUser.username.charAt(0).toUpperCase()}</div>
                    <span>${currentUser.username}</span>
                </div>
            </div>
        `;
    } else {
        headerActions.innerHTML = `
            <button class="btn" id="sign-in-btn">
                <i class="fas fa-sign-in-alt"></i> Sign In
            </button>
        `;
        document.getElementById('sign-in-btn').addEventListener('click', () => {
            window.location.href = 'auth.html';
        });
    }
}

// Place a Bet
function placeBet(betId, option) {
    if (!currentUser) {
        showNotification("Authentication Required", "You need to sign in to place a bet");
        window.location.href = 'auth.html';
        return;
    }
    
    const betAmount = prompt(`How much do you want to bet on ${option.toUpperCase()}? (Min: $5)`);
    if (betAmount && parseFloat(betAmount) >= 5) {
        const amount = parseFloat(betAmount);
        
        // Find the bet
        const bets = getBets();
        const bet = bets.find(b => b.id === betId);
        
        // Update bet amounts
        if (option === bet.options[0].name) {
            bet.yesAmount += amount;
        } else {
            bet.noAmount += amount;
        }
        
        bet.totalAmount += amount;
        bet.participants++;
        
        // Update database
        setBets(bets);
        
        // Update UI
        renderBets('home-bets-grid', bets);
        showNotification("Bet Placed!", `You've bet $${amount} on ${option.toUpperCase()}`);
    } else if (betAmount) {
        alert('Minimum bet amount is $5. Please try again.');
    }
}

// Start the home page
document.addEventListener('DOMContentLoaded', initHomePage);
function reloadBets() {
    const bets = getBets();
    renderBets('home-bets-grid', bets);
}

// Make it accessible globally for the pageshow event
window.reloadBets = reloadBets;