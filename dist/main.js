// Name: Harshil Rao & Kartik Pandit
// Student ID: 123456 & 654321
// Date: 2025-01-25
// Description: Main TypeScript file for Volunteer Connect website.
import * as bootstrap from 'bootstrap'; // Import Bootstrap
// Add the updateNavbar function at the top level
function updateNavbar() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    const loginLogoutLink = document.getElementById('loginLogoutLink');
    if (loginLogoutLink) {
        if (loggedInUser) {
            loginLogoutLink.innerHTML = `
                <a class="nav-link" href="#" id="logoutLink">Welcome, ${loggedInUser} | Logout</a>
            `;
            // Add logout functionality
            const logoutLink = document.getElementById('logoutLink');
            if (logoutLink) {
                logoutLink.addEventListener('click', function () {
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('loggedInUser');
                    window.location.href = '../views/login.html';
                });
            }
        }
        else {
            loginLogoutLink.innerHTML = `<a class="nav-link" href="../views/login.html">Login</a>`;
        }
    }
}
// Fetch users from users.json
async function fetchUsers() {
    try {
        const response = await fetch('../Data/users.json');
        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}
// Fetch events from events.json
async function fetchEvents() {
    try {
        const response = await fetch('../Data/events.json');
        if (!response.ok) {
            throw new Error('Failed to fetch events');
        }
        return await response.json();
    }
    catch (error) {
        console.error('Error fetching events:', error);
        return [];
    }
}
// Populate Opportunities
function populateOpportunities() {
    const opportunities = [
        { title: "Beach Cleanup", description: "Help clean the beach.", date: "2025-02-10", time: "10:00 AM - 2:00 PM" },
        { title: "Food Drive", description: "Distribute food.", date: "2025-02-20", time: "1:00 PM - 4:00 PM" }
    ];
    const opportunitiesContainer = document.getElementById('opportunitiesContainer');
    if (opportunitiesContainer) {
        opportunities.forEach(opportunity => {
            const card = document.createElement('div');
            card.className = 'card mt-3';
            card.innerHTML = `
                <div class="card-body">
                    <h5>${opportunity.title}</h5>
                    <p>${opportunity.description}</p>
                    <p><strong>Date:</strong> ${opportunity.date} | <strong>Time:</strong> ${opportunity.time}</p>
                    <div class="form-group">
                        <label for="roleSelect">Select Role</label>
                        <select class="form-control" id="roleSelect">
                            <option value="volunteer">Volunteer</option>
                            <option value="participant">Participant</option>
                            <option value="sponsor">Sponsor</option>
                        </select>
                    </div>
                </div>
            `;
            opportunitiesContainer.appendChild(card);
        });
    }
}
// Update Welcome Message
function updateWelcomeMessage(username) {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const usernameSpan = document.getElementById('username');
    if (welcomeMessage && usernameSpan) {
        welcomeMessage.style.display = 'block';
        usernameSpan.textContent = username;
    }
}
// Feedback Form Submission
function setupFeedbackForm() {
    const feedbackForm = document.getElementById('feedbackForm');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form submission
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            // Simulate AJAX submission (replace with actual AJAX call)
            setTimeout(() => {
                // Display submitted data in the modal
                const submittedName = document.getElementById('submittedName');
                const submittedEmail = document.getElementById('submittedEmail');
                const submittedMessage = document.getElementById('submittedMessage');
                if (submittedName && submittedEmail && submittedMessage) {
                    submittedName.textContent = name;
                    submittedEmail.textContent = email;
                    submittedMessage.textContent = message;
                }
                // Show the confirmation modal
                const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
                confirmationModal.show();
                // Clear the form
                feedbackForm.reset();
            }, 1000); // Simulate a 1-second delay for AJAX
        });
    }
}
// Login Functionality
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (event) {
            event.preventDefault(); // Prevent form submission
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const users = await fetchUsers();
            const user = users.find(u => u.username === username && u.password === password);
            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('loggedInUser', username);
                updateNavbar();
                alert('Login successful! Welcome back, ' + username);
            }
            else {
                alert('Invalid username or password. Please try again.');
            }
        });
    }
}
// Search Functionality
function setupSearchForm() {
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Prevent form submission
            const searchQuery = document.getElementById('searchInput').value.toLowerCase();
            const eventCards = document.querySelectorAll('.event-card');
            eventCards.forEach(card => {
                const eventTitle = card.querySelector('h5')?.textContent?.toLowerCase();
                if (eventTitle?.includes(searchQuery)) {
                    card.style.display = 'block';
                }
                else {
                    card.style.display = 'none';
                }
            });
        });
    }
}
// Initialize functions on page load
document.addEventListener('DOMContentLoaded', () => {
    populateOpportunities();
    setupFeedbackForm();
    setupLoginForm();
    updateNavbar();
    setupSearchForm();
});
//# sourceMappingURL=main.js.map