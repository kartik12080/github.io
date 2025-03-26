"use strict";
// DOM Elements
const eventForm = document.getElementById('eventForm');
const eventsList = document.getElementById('eventsList');
const dateInput = document.getElementById('eventDate');
const noEventsMessage = document.getElementById('noEventsMessage');
const editModal = new bootstrap.Modal('#editEventModal');
const saveEditBtn = document.getElementById('saveEditBtn');
let events = loadEvents();
// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderEvents();
    dateInput.min = new Date().toISOString().split('T')[0];
    // Form submission
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm(eventForm)) {
            createEvent();
        }
    });
    // Save edited event
    saveEditBtn.addEventListener('click', saveEditedEvent);
});
function loadEvents() {
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : [];
}
function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
    toggleNoEventsMessage();
}
function toggleNoEventsMessage() {
    if (events.length === 0) {
        noEventsMessage.style.display = 'block';
        eventsList.style.display = 'none';
    }
    else {
        noEventsMessage.style.display = 'none';
        eventsList.style.display = 'flex';
    }
}
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.required && !input.value.trim()) {
            input.classList.add('is-invalid');
            isValid = false;
        }
        else {
            input.classList.remove('is-invalid');
        }
    });
    // Additional validation
    const nameInput = form.querySelector('#eventName');
    const descInput = form.querySelector('#eventDescription');
    if (nameInput.value.trim().length < 3 || nameInput.value.trim().length > 50) {
        nameInput.classList.add('is-invalid');
        isValid = false;
    }
    if (descInput.value.trim().length < 10 || descInput.value.trim().length > 500) {
        descInput.classList.add('is-invalid');
        isValid = false;
    }
    return isValid;
}
function createEvent() {
    const newEvent = {
        id: Date.now().toString(),
        name: document.getElementById('eventName').value.trim(),
        date: document.getElementById('eventDate').value,
        time: document.getElementById('eventTime').value,
        location: document.getElementById('eventLocation').value.trim(),
        description: document.getElementById('eventDescription').value.trim()
    };
    events.push(newEvent);
    saveEvents();
    renderEvents();
    eventForm.reset();
    showToast('Event created successfully!');
}
function renderEvents() {
    eventsList.innerHTML = events
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(event => `
            <div class="col-md-6 col-lg-4 mb-4" data-id="${event.id}">
                <div class="card h-100 shadow-sm event-card">
                    <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">
                            <i class="fas fa-calendar-day me-2"></i>${event.name}
                        </h5>
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><button class="dropdown-item edit-btn"><i class="fas fa-edit me-2"></i>Edit</button></li>
                                <li><button class="dropdown-item delete-btn text-danger"><i class="fas fa-trash me-2"></i>Delete</button></li>
                            </ul>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="event-icon">
                                <i class="fas fa-map-marker-alt text-primary"></i>
                            </div>
                            <div class="event-detail">
                                <h6 class="mb-0">Location</h6>
                                <p class="mb-0">${event.location}</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mb-3">
                            <div class="event-icon">
                                <i class="fas fa-clock text-primary"></i>
                            </div>
                            <div class="event-detail">
                                <h6 class="mb-0">Date & Time</h6>
                                <p class="mb-0">${formatDate(event.date)}<br>${formatTime(event.time)}</p>
                            </div>
                        </div>
                        <div class="d-flex align-items-start">
                            <div class="event-icon">
                                <i class="fas fa-info-circle text-primary"></i>
                            </div>
                            <div class="event-detail">
                                <h6 class="mb-0">Description</h6>
                                <p class="mb-0">${event.description}</p>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent">
                        <button class="btn btn-primary w-100">
                            <i class="fas fa-user-plus me-2"></i>Join Event
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    // Add event listeners
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.closest('.col-md-6')?.getAttribute('data-id');
            if (eventId)
                deleteEvent(eventId);
        });
    });
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const eventId = e.target.closest('.col-md-6')?.getAttribute('data-id');
            if (eventId)
                openEditModal(eventId);
        });
    });
    toggleNoEventsMessage();
}
function deleteEvent(id) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(event => event.id !== id);
        saveEvents();
        renderEvents();
        showToast('Event deleted successfully!');
    }
}
function openEditModal(id) {
    const event = events.find(e => e.id === id);
    if (!event)
        return;
    document.getElementById('editEventId').value = event.id;
    document.getElementById('editEventName').value = event.name;
    document.getElementById('editEventDate').value = event.date;
    document.getElementById('editEventTime').value = event.time;
    document.getElementById('editEventLocation').value = event.location;
    document.getElementById('editEventDescription').value = event.description;
    editModal.show();
}
function saveEditedEvent() {
    const editForm = document.getElementById('editEventForm');
    if (!validateForm(editForm))
        return;
    const id = document.getElementById('editEventId').value;
    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex !== -1) {
        events[eventIndex] = {
            id,
            name: document.getElementById('editEventName').value.trim(),
            date: document.getElementById('editEventDate').value,
            time: document.getElementById('editEventTime').value,
            location: document.getElementById('editEventLocation').value.trim(),
            description: document.getElementById('editEventDescription').value.trim()
        };
        saveEvents();
        renderEvents();
        editModal.hide();
        showToast('Event updated successfully!');
    }
}
// Helper functions
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
function formatTime(timeStr) {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    return `${hour > 12 ? hour - 12 : hour}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
}
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'position-fixed bottom-0 end-0 p-3';
    toast.innerHTML = `
        <div class="toast show" role="alert">
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Success</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${message}</div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
//# sourceMappingURL=eventsPlanning.js.map