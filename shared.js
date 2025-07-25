// shared.js
// =========
// Shared utilities and data management for Gamify platform

// Data Keys
const DATA_KEYS = {
  USERS: 'gamify_users',
  BETS: 'gamify_bets',
  USER_BETS: 'gamify_userBets',
  CURRENT_USER: 'gamify_currentUser'
};

// Initialize Mock Database
function initializeDatabase() {
  // Only create mock data if it doesn't exist
  if (!localStorage.getItem(DATA_KEYS.USERS)) {
    localStorage.setItem(DATA_KEYS.USERS, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(DATA_KEYS.BETS)) {
    const mockBets = [
      {
        id: 1,
        title: "Will Trump win the 2024 Presidential Election?",
        category: "politics",
        createdBy: "@EagleEye",
        createdById: 1,
        totalAmount: 85000,
        yesAmount: 38250,
        noAmount: 46750,
        participants: 1428,
        endDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString(),
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
        createdById: 2,
        totalAmount: 62400,
        yesAmount: 41200,
        noAmount: 21200,
        participants: 987,
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
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
        createdById: 3,
        totalAmount: 37800,
        yesAmount: 11200,
        noAmount: 26600,
        participants: 732,
        endDate: new Date(Date.now() + 87 * 24 * 60 * 60 * 1000).toISOString(),
        options: [
          { name: "YES", odds: 3.20 },
          { name: "NO", odds: 1.40 }
        ]
      }
    ];
    localStorage.setItem(DATA_KEYS.BETS, JSON.stringify(mockBets));
  }
  
  if (!localStorage.getItem(DATA_KEYS.USER_BETS)) {
    localStorage.setItem(DATA_KEYS.USER_BETS, JSON.stringify([]));
  }
}

// Initialize the database when the script loads
initializeDatabase();

// Utility Functions
// =================

function formatCurrency(amount) {
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return "Closed";
  } else if (diffDays === 0) {
    return "Ends today";
  } else if (diffDays === 1) {
    return "1 day left";
  } else {
    return `${diffDays} days left`;
  }
}

// User Management
// ===============

function getCurrentUser() {
  try {
    const userData = localStorage.getItem(DATA_KEYS.CURRENT_USER);
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error("Error getting current user:", e);
    return null;
  }
}

function setCurrentUser(user) {
  try {
    localStorage.setItem(DATA_KEYS.CURRENT_USER, JSON.stringify(user));
    return true;
  } catch (e) {
    console.error("Error setting current user:", e);
    return false;
  }
}

function clearCurrentUser() {
  localStorage.removeItem(DATA_KEYS.CURRENT_USER);
}

function getAllUsers() {
  try {
    const usersData = localStorage.getItem(DATA_KEYS.USERS);
    return usersData ? JSON.parse(usersData) : [];
  } catch (e) {
    console.error("Error getting users:", e);
    return [];
  }
}

function saveUser(user) {
  try {
    const users = getAllUsers();
    
    // Check if user already exists
    const existingUserIndex = users.findIndex(u => u.id === user.id);
    
    if (existingUserIndex !== -1) {
      // Update existing user
      users[existingUserIndex] = user;
    } else {
      // Add new user
      users.push(user);
    }
    
    localStorage.setItem(DATA_KEYS.USERS, JSON.stringify(users));
    return true;
  } catch (e) {
    console.error("Error saving user:", e);
    return false;
  }
}

// Bet Management
// ==============

function getBets() {
  try {
    const betsData = localStorage.getItem(DATA_KEYS.BETS);
    return betsData ? JSON.parse(betsData) : [];
  } catch (e) {
    console.error("Error getting bets:", e);
    return [];
  }
}

function saveBets(bets) {
  try {
    localStorage.setItem(DATA_KEYS.BETS, JSON.stringify(bets));
    return true;
  } catch (e) {
    console.error("Error saving bets:", e);
    return false;
  }
}

function getUserBets() {
  try {
    const userBetsData = localStorage.getItem(DATA_KEYS.USER_BETS);
    return userBetsData ? JSON.parse(userBetsData) : [];
  } catch (e) {
    console.error("Error getting user bets:", e);
    return [];
  }
}

function saveUserBets(userBets) {
  try {
    localStorage.setItem(DATA_KEYS.USER_BETS, JSON.stringify(userBets));
    return true;
  } catch (e) {
    console.error("Error saving user bets:", e);
    return false;
  }
}

// Bet Card Rendering
// ==================

function createBetCard(bet, isUserBet = false) {
  if (!bet || !bet.options || bet.options.length < 2) {
    console.error("Invalid bet data:", bet);
    return "";
  }
  
  const totalAmount = bet.totalAmount || 0;
  const yesAmount = bet.yesAmount || 0;
  const noAmount = bet.noAmount || 0;
  
  const yesPercentage = totalAmount > 0 ? Math.round((yesAmount / totalAmount) * 100) : 50;
  const noPercentage = totalAmount > 0 ? Math.round((noAmount / totalAmount) * 100) : 50;
  
  // Ensure percentages don't exceed 100%
  const adjustedYes = Math.min(yesPercentage, 100);
  const adjustedNo = Math.min(noPercentage, 100);
  
  return `
    <div class="bet-card">
      <div class="card-header">
        <div class="card-category">${bet.category ? bet.category.charAt(0).toUpperCase() + bet.category.slice(1) : "General"}</div>
        <h3 class="card-title">${bet.title || "Untitled Bet"}</h3>
        <div class="card-details">
          <span>Created by: ${isUserBet ? '<strong>You</strong>' : (bet.createdBy || "Unknown")}</span>
          <span>Total: ${formatCurrency(totalAmount)}</span>
        </div>
      </div>
      <div class="card-body">
        <div class="odds">
          <div class="odd-option" onclick="placeBet(${bet.id}, '${bet.options[0].name}')">
            <div class="option-title">${bet.options[0].name || "Option 1"}</div>
            <div class="option-value">${(bet.options[0].odds || 1.0).toFixed(2)}x</div>
          </div>
          <div class="odd-option" onclick="placeBet(${bet.id}, '${bet.options[1].name}')">
            <div class="option-title">${bet.options[1].name || "Option 2"}</div>
            <div class="option-value">${(bet.options[1].odds || 1.0).toFixed(2)}x</div>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress-labels">
            <span>${bet.options[0].name || "Option 1"}: ${formatCurrency(yesAmount)}</span>
            <span>${bet.options[1].name || "Option 2"}: ${formatCurrency(noAmount)}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill yes-fill" style="width: ${adjustedYes}%"></div>
            <div class="progress-fill no-fill" style="width: ${adjustedNo}%"></div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <div class="participants">
          <i class="fas fa-users"></i>
          <span>${(bet.participants || 0).toLocaleString()} participants</span>
        </div>
        <div class="time-left">
          <i class="fas fa-clock"></i> ${formatDate(bet.endDate || new Date().toISOString())}
        </div>
      </div>
    </div>
  `;
}

// Notification System
// ===================

function showNotification(title, message) {
  const notification = document.getElementById('notification');
  const notificationTitle = document.getElementById('notification-title');
  const notificationMessage = document.getElementById('notification-message');
  const progressFill = document.getElementById('progress-fill');
  
  if (!notification || !notificationTitle || !notificationMessage || !progressFill) {
    console.error("Notification elements not found");
    return;
  }
  
  notificationTitle.textContent = title;
  notificationMessage.textContent = message;
  notification.classList.add('show');
  
  // Reset and animate progress bar
  progressFill.style.width = '0%';
  setTimeout(() => {
    progressFill.style.width = '100%';
  }, 10);
  
  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      progressFill.style.width = '0%';
    }, 300);
  }, 3000);
}

// Bet Rendering Functions
// =======================

function renderBets(gridId, bets, isUserBet = false) {
  if (!gridId) {
    console.error("No grid ID provided for rendering bets");
    return;
  }
  
  const grid = document.getElementById(gridId);
  if (!grid) {
    console.error(`Grid element with ID '${gridId}' not found`);
    return;
  }
  
  try {
    // Sort bets by most recent first
    const sortedBets = [...bets].sort((a, b) => {
      const dateA = new Date(a.endDate || 0);
      const dateB = new Date(b.endDate || 0);
      return dateB - dateA;
    });
    
    grid.innerHTML = sortedBets.map(bet => createBetCard(bet, isUserBet)).join('');
  } catch (e) {
    console.error("Error rendering bets:", e);
    grid.innerHTML = '<div class="error-message">Error loading bets. Please try again later.</div>';
  }
}

// Expose necessary functions to the global scope
window.placeBet = function(betId, option) {
  console.log(`Place bet function called for bet ${betId} on option ${option}`);
  // Implementation will be in page-specific files
};

// Initialize the shared environment
window.addEventListener('DOMContentLoaded', () => {
  console.log("Shared.js initialized");
});