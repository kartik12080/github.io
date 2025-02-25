// main.js
// Name: Harshil Rao & Kartik Pandit
// Student ID: 123456 & 654321
// Date: 2025-01-25
// Description: Main JavaScript file for Volunteer Connect website.

// Opportunities Data
const opportunities = [
    { title: "Beach Cleanup", description: "Help clean the beach.", date: "2025-02-10", time: "10:00 AM - 2:00 PM" },
    { title: "Food Drive", description: "Distribute food.", date: "2025-02-20", time: "1:00 PM - 4:00 PM" }
];

// Populate Opportunities
const opportunitiesContainer = $("#opportunitiesContainer");
opportunities.forEach(opportunity => {
    opportunitiesContainer.append(`
        <div class="card mt-3">
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
        </div>
    `);
});

// Feedback Form Submission
document.getElementById('feedbackForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Simulate AJAX submission (replace with actual AJAX call)
    setTimeout(() => {
        // Display submitted data in the modal
        document.getElementById('submittedName').textContent = name;
        document.getElementById('submittedEmail').textContent = email;
        document.getElementById('submittedMessage').textContent = message;

        // Show the confirmation modal
        const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        confirmationModal.show();

        // Clear the form
        document.getElementById('feedbackForm').reset();
    }, 1000); // Simulate a 1-second delay for AJAX
});

// Initialize Google Map
function initMap() {
    // Default location (e.g., city center or a specific location)
    const defaultLocation = { lat: 43.6532, lng: -79.3832 }; // Example: Toronto, Canada

    // Create a map centered at the default location
    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: defaultLocation,
    });
    document.addEventListener('DOMContentLoaded', () => {
        const apiKey = '32ce9e982b634029af4207503c84fc57';
        const newsContainer = document.getElementById('newsContainer');

        // Replace with your desired news source or query
        const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.status === 'ok') {
                    newsContainer.innerHTML = ''; // Clear existing content
                    data.articles.forEach(article => {
                        const newsItem = document.createElement('div');
                        newsItem.className = 'col-md-4 mb-4';
                        newsItem.innerHTML = `
                        <div class="card">
                            <img src="${article.urlToImage}" class="card-img-top" alt="${article.title}">
                            <div class="card-body">
                                <h5 class="card-title">${article.title}</h5>
                                <p class="card-text">${article.description}</p>
                                <a href="${article.url}" target="_blank" class="btn btn-primary">Read more</a>
                            </div>
                        </div>
                    `;
                        newsContainer.appendChild(newsItem);
                    });
                } else {
                    newsContainer.innerHTML = '<p>Unable to load news at this time.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching news:', error);
                newsContainer.innerHTML = '<p>Unable to load news at this time.</p>';
            });
    });
    // Add markers for volunteer opportunities
    const volunteerOpportunities = [
        {
            title: "Food Bank Drive",
            location: { lat: 43.6510, lng: -79.3850 }, // Example coordinates
            description: "Help distribute food to those in need.",
        },
        {
            title: "Beach Cleanup",
            location: { lat: 43.6300, lng: -79.4200 }, // Example coordinates
            description: "Join us to clean up the beach.",
        },
        {
            title: "Charity Walkathon",
            location: { lat: 43.6700, lng: -79.3900 }, // Example coordinates
            description: "Participate in a walkathon to raise funds for charity.",
        },
    ];

    // Add markers to the map
    volunteerOpportunities.forEach(opportunity => {
        const marker = new google.maps.Marker({
            position: opportunity.location,
            map: map,
            title: opportunity.title,
        });

        // Add an info window for each marker
        const infoWindow = new google.maps.InfoWindow({
            content: `<h5>${opportunity.title}</h5><p>${opportunity.description}</p>`,
        });

        // Show info window when marker is clicked
        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    });
}

// Login Functionality
document.getElementById('loginForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Simple validation (replace with actual authentication logic)
    if (email === "user@example.com" && password === "password") {
        // Store user session in localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);

        // Update the navbar
        updateNavbar();

        // Hide the login form
        document.getElementById('loginForm').style.display = 'none';

        // Show a welcome message
        alert('Login successful! Welcome back, ' + email);
    } else {
        alert('Invalid email or password. Please try again.');
    }
});

// Function to update the navbar based on login status
function updateNavbar() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const navLinks = document.querySelector('.navbar-nav');

    if (isLoggedIn) {
        // Add "Log Out" link
        navLinks.innerHTML += `
            <li class="nav-item">
                <a class="nav-link" href="#" id="logoutLink">Log Out</a>
            </li>
        `;

        // Add event listener for logout
        document.getElementById('logoutLink').addEventListener('click', function () {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userEmail');
            updateNavbar();
            alert('You have been logged out.');
            window.location.href = 'index.html'; // Redirect to homepage
        });
    } else {
        // Add "Log In" link
        navLinks.innerHTML += `
            <li class="nav-item">
                <a class="nav-link" href="login.html">Log In</a>
            </li>
        `;
    }
}

// Call updateNavbar on page load
updateNavbar();

// Fetch and Display Community News
document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '32ce9e982b634029af4207503c84fc57'; //
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`; //

    // Fetch news data from NewsAPI
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const newsContainer = document.getElementById('newsContainer');
            newsContainer.innerHTML = ''; // Clear existing content

            // Check if articles are available
            if (data.articles && data.articles.length > 0) {
                // Loop through the articles and create cards
                data.articles.forEach(article => {
                    const newsCard = document.createElement('div');
                    newsCard.className = 'col-md-4 mb-4'; // Bootstrap grid layout
                    newsCard.innerHTML = `
                            <div class="card">
                                <img src="${article.urlToImage || 'https://via.placeholder.com/300'}" class="card-img-top" alt="${article.title}">
                                <div class="card-body">
                                    <h5 class="card-title">${article.title}</h5>
                                    <p class="card-text">${article.description || 'No description available.'}</p>
                                    <p><strong>Source:</strong> ${article.source.name}</p>
                                    <p><strong>Published At:</strong> ${new Date(article.publishedAt).toLocaleDateString()}</p>
                                    <a href="${article.url}" target="_blank" class="btn btn-primary">Read More</a>
                                </div>
                            </div>
                        `;
                    newsContainer.appendChild(newsCard);
                });
            } else {
                newsContainer.innerHTML = '<p class="text-center">No news articles found.</p>';
            }
        })
        .catch(error => {
            console.error('Error loading news:', error);
            const newsContainer = document.getElementById('newsContainer');
            newsContainer.innerHTML = '<p class="text-center">Unable to load news at this time.</p>';
        });
});
// Search Functionality
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const eventCards = document.querySelectorAll('.event-card');

    eventCards.forEach(card => {
        const eventTitle = card.querySelector('h5').textContent.toLowerCase();
        if (eventTitle.includes(searchQuery)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});