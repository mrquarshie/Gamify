// shared.js
// Mock Database
const mockDB = {
    users: [],
    bets: [
        {
            id: 1,
            title: "Will Trump win the 2024 Presidential Election?",
            category: "politics",
            createdBy: "@EagleEye",
            totalAmount: 85000,
            yesAmount: 38250,
            noAmount: 46750,
            participants: 1428,
            endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
            options: [
                { name: "YES", odds: 2.15 },
                { name: "NO", odds: 1.75 }
            ]
        },
        {
            id: 2,
            title: "Will Real Madrid win the Champions League?",
            category: "football",
            createdBy: "@FootballFanatic",
            totalAmount: 62400,
            yesAmount: 41200,
            noAmount: 21200,
            participants: 987,
            endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            options: [
                { name: "YES", odds: 1.95 },
                { name: "NO", odds: 2.05 }
            ]
        },
        {
            id: 3,
            title: "Will LeBron James win MVP this season?",
            category: "basketball",
            createdBy: "@HoopDreams",
            totalAmount: 37800,
            yesAmount: 11200,
            noAmount: 26600,
            participants: 732,
            endDate: new Date(Date.now() + 87 * 24 * 60 * 60 * 1000),
            options: [
                { name: "YES", odds: 3.20 },
                { name: "NO", odds: 1.40 }
            ]
        }
    ],
    userBets: []
};

// Utility Functions
function formatCurrency(amount) {
    return `$${amount.toLocaleString('en-US', {maximumFractionDigits: 0})`;
}

function formatDate(date) {
    const diffTime = date - new Date();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days left`;
}

// Notification System
function showNotification(title, message) {
    const notification = document.getElementById('notification');
    const notificationTitle = document.getElementById('notification-title');
    const notificationMessage = document.getElementById('notification-message');
    const progressFill = document.getElementById('progress-fill');
    
    if (notification && notificationTitle && notificationMessage && progressFill) {
        notificationTitle.textContent = title;
        notificationMessage.textContent = message;
        notification.classList.add('show');
        
        // Animate progress bar
        progressFill.style.width = '100%';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            progressFill.style.width = '0%';
        }, 3000);
    }
}

// Bet Card Template
function createBetCard(bet, isUserBet = false) {
    const yesPercentage = Math.round((bet.yesAmount / bet.totalAmount) * 100);
    const noPercentage = 100 - yesPercentage;
    
    return `
        <div class="bet-card">
            <div class="card-header">
                <div class="card-category">${bet.category.charAt(0).toUpperCase() + bet.category.slice(1)}</div>
                <h3 class="card-title">${bet.title}</h3>
                <div class="card-details">
                    <span>Created by: ${isUserBet ? '<strong>You</strong>' : bet.createdBy}</span>
                    <span>Total: ${formatCurrency(bet.totalAmount)}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="odds">
                    ${bet.options.map(option => `
                        <div class="odd-option" onclick="placeBet(${bet.id}, '${option.name}')">
                            <div class="option-title">${option.name}</div>
                            <div class="option-value">${option.odds.toFixed(2)}x</div>
                        </div>
                    `).join('')}
                </div>
                <div class="progress-container">
                    <div class="progress-labels">
                        <span>${bet.options[0].name}: ${formatCurrency(bet.yesAmount)}</span>
                        <span>${bet.options[1].name}: ${formatCurrency(bet.noAmount)}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill yes-fill" style="width: ${yesPercentage}%"></div>
                        <div class="progress-fill no-fill" style="width: ${noPercentage}%"></div>
                    </div>
                </div>
            </div>
            <div class="card-footer">
                <div class="participants">
                    <i class="fas fa-users"></i>
                    <span>${bet.participants.toLocaleString()} participants</span>
                </div>
                <div class="time-left">
                    <i class="fas fa-clock"></i> ${formatDate(bet.endDate)}
                </div>
            </div>
        </div>
    `;
}

// Render Bets
function renderBets(gridId, bets, isUserBet = false) {
    const grid = document.getElementById(gridId);
    if (grid) {
        grid.innerHTML = bets.map(bet => createBetCard(bet, isUserBet)).join('');
    }
}

// Current User Management
function getCurrentUser() {
    const userData = localStorage.getItem('gamify_user');
    return userData ? JSON.parse(userData) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('gamify_user', JSON.stringify(user));
}

function clearCurrentUser() {
    localStorage.removeItem('gamify_user');
}

// Bets Data Management
function getBets() {
    const betsData = localStorage.getItem('gamify_bets');
    return betsData ? JSON.parse(betsData) : mockDB.bets;
}

function setBets(bets) {
    localStorage.setItem('gamify_bets', JSON.stringify(bets));
}

function getUserBets() {
    const userBetsData = localStorage.getItem('gamify_userBets');
    return userBetsData ? JSON.parse(userBetsData) : mockDB.userBets;
}

function setUserBets(userBets) {
    localStorage.setItem('gamify_userBets', JSON.stringify(userBets));
}