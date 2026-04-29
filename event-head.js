function checkEventHeadAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.type !== 'eventHead') {
        window.location.href = 'index.html';
        return null;
    }
    
    return currentUser;
}

function initEventHeadDashboard() {
    const currentUser = checkEventHeadAuth();
    if (!currentUser) return;

    setupMenuListeners();
    setupFormListeners();
    setupModalHandlers();
    loadDashboardData(currentUser);
    loadMyEvents(currentUser);
    loadProfile(currentUser);

    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    });

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit')) {
        const editingEvent = JSON.parse(localStorage.getItem('editingEvent'));
        if (editingEvent) {
            loadEditModal(editingEvent);
        }
    }
}

function setupMenuListeners() {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');
        });
    });
}

function setupFormListeners() {
    document.getElementById('createEventForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const eventData = {
            title: document.getElementById('eventTitle').value,
            category: document.getElementById('eventCategory').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            description: document.getElementById('eventDescription').value,
            image: document.getElementById('eventImage').value,
            type: document.getElementById('eventType').value,
            registrationStatus: document.getElementById('eventRegStatus').value,
            formLink: document.getElementById('eventFormLink').value,
            registrationLimit: parseInt(document.getElementById('eventRegLimit').value),
            eventHead: currentUser.email,
            attendees: 0
        };

        const selectedDate = new Date(eventData.date);
        if (selectedDate < new Date()) {
            showAlert('Event date cannot be in the past', 'error');
            return;
        }

        const appState = {
            events: JSON.parse(localStorage.getItem('events')) || []
        };

        const newEvent = {
            id: Date.now(),
            ...eventData,
            createdAt: new Date().toISOString(),
            status: 'pending', 
            approved: false  
        };

        appState.events.push(newEvent);
        localStorage.setItem('events', JSON.stringify(appState.events));

        showAlert('Event submitted for admin approval!', 'success');
        document.getElementById('createEventForm').reset();
        document.getElementById('eventImage').value = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop';

        document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));
        document.querySelector('[data-section="my-events"]').classList.add('active');
        document.getElementById('my-events').classList.add('active');

        const updatedUser = JSON.parse(localStorage.getItem('currentUser'));
        loadMyEvents(updatedUser);
        loadDashboardData(updatedUser);
    });

    document.getElementById('editEventForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const eventId = parseInt(document.getElementById('editEventId').value);
        const appState = {
            events: JSON.parse(localStorage.getItem('events')) || []
        };

        const eventIndex = appState.events.findIndex(e => e.id === eventId);
        if (eventIndex === -1) {
            showAlert('Event not found', 'error');
            return;
        }

        const eventData = {
            title: document.getElementById('editEventTitle').value,
            category: document.getElementById('editEventCategory').value,
            date: document.getElementById('editEventDate').value,
            time: document.getElementById('editEventTime').value,
            location: document.getElementById('editEventLocation').value,
            description: document.getElementById('editEventDescription').value,
            image: document.getElementById('editEventImage').value,
            type: document.getElementById('editEventType').value,
            registrationStatus: document.getElementById('editEventRegStatus').value,
            formLink: document.getElementById('editEventFormLink').value,
            registrationLimit: parseInt(document.getElementById('editEventRegLimit').value)
        };

        const selectedDate = new Date(eventData.date);
        if (selectedDate < new Date()) {
            showAlert('Event date cannot be in the past', 'error');
            return;
        }

        appState.events[eventIndex] = {
            ...appState.events[eventIndex],
            ...eventData
        };

        localStorage.setItem('events', JSON.stringify(appState.events));
        showAlert('Event updated successfully!', 'success');
        closeModal('editEventModal');

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        loadMyEvents(currentUser);
        loadDashboardData(currentUser);
    });
}

function loadDashboardData(currentUser) {
    const appState = {
        events: JSON.parse(localStorage.getItem('events')) || []
    };

    const myEvents = appState.events.filter(e => e.eventHead === currentUser.email);
    const activeEvents = myEvents.filter(e => e.status === 'active').length;
    const totalRegistrations = myEvents.reduce((sum, e) => sum + e.attendees, 0);

    document.getElementById('totalEvents').textContent = myEvents.length;
    document.getElementById('activeEvents').textContent = activeEvents;
    document.getElementById('totalRegistrations').textContent = totalRegistrations;

    if (myEvents.length > 0) {
        const latestEvent = myEvents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
        document.getElementById('recentActivity').innerHTML = `
            <p><strong>Latest Event Created:</strong> ${latestEvent.title}</p>
            <p style="font-size: 0.9rem; color: #94a3b8; margin-top: 0.5rem;">
                Created on ${new Date(latestEvent.createdAt).toLocaleDateString()}
            </p>
        `;
    }
}

function loadMyEvents(currentUser) {
    const appState = {
        events: JSON.parse(localStorage.getItem('events')) || []
    };

    const myEvents = appState.events.filter(e => e.eventHead === currentUser.email);
    const tbody = document.getElementById('myEventsTable');
    tbody.innerHTML = '';

    if (myEvents.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 2rem;">
                    <p style="color: #64748b;">You haven't created any events yet.</p>
                    <button class="btn-primary" onclick="switchSection('create-event')" style="margin-top: 1rem;">Create Your First Event</button>
                </td>
            </tr>
        `;
        return;
    }

    myEvents.forEach(event => {
        const regStatusDisplay = {
            'registrations_open': '<span class="status-badge" style="background-color: #d1fae5; color: #065f46;">Open</span>',
            'registrations_upcoming': '<span class="status-badge" style="background-color: #fef3c7; color: #92400e;">Coming Soon</span>',
            'registrations_closed': '<span class="status-badge" style="background-color: #fee2e2; color: #7f1d1d;">Closed</span>'
        };
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${event.title}</strong></td>
            <td>${event.date}</td>
            <td><span class="event-category">${event.category}</span></td>
            <td>${event.attendees}/${event.registrationLimit || 100}</td>
            <td>${regStatusDisplay[event.registrationStatus] || '<span class="status-badge status-active">Open</span>'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-edit" onclick="openEditEvent(${event.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteEventHandler(${event.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function loadProfile(currentUser) {
    document.getElementById('profileName').textContent = currentUser.name;
    document.getElementById('profileEmail').textContent = currentUser.email;
    document.getElementById('profileDept').textContent = currentUser.department || 'Not specified';
    document.getElementById('profileStatus').textContent = currentUser.status === 'active' ? 'Active' : 'Pending Approval';
    document.getElementById('profileStatus').className = `status-badge status-${currentUser.status === 'active' ? 'active' : 'pending'}`;
    
    const joinedDate = new Date(currentUser.registeredAt).toLocaleDateString();
    document.getElementById('profileJoined').textContent = joinedDate;
}

function openEditEvent(eventId) {
    const appState = {
        events: JSON.parse(localStorage.getItem('events')) || []
    };

    const event = appState.events.find(e => e.id === eventId);
    if (!event) {
        showAlert('Event not found', 'error');
        return;
    }

    loadEditModal(event);
    showModal('editEventModal');
}

function loadEditModal(event) {
    document.getElementById('editEventId').value = event.id;
    document.getElementById('editEventTitle').value = event.title;
    document.getElementById('editEventCategory').value = event.category;
    document.getElementById('editEventDate').value = event.date;
    document.getElementById('editEventTime').value = event.time;
    document.getElementById('editEventLocation').value = event.location;
    document.getElementById('editEventDescription').value = event.description;
    document.getElementById('editEventImage').value = event.image;
    document.getElementById('editEventType').value = event.type || 'upcoming';
    document.getElementById('editEventRegStatus').value = event.registrationStatus || 'registrations_open';
    document.getElementById('editEventFormLink').value = event.formLink || '';
    document.getElementById('editEventRegLimit').value = event.registrationLimit || 100;
}

function deleteEventHandler(eventId) {
    if (confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
        const appState = {
            events: JSON.parse(localStorage.getItem('events')) || []
        };

        appState.events = appState.events.filter(e => e.id !== eventId);
        localStorage.setItem('events', JSON.stringify(appState.events));

        showAlert('Event deleted successfully', 'success');

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        loadMyEvents(currentUser);
        loadDashboardData(currentUser);
    }
}

function switchSection(sectionId) {
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));

    const btn = document.querySelector(`[data-section="${sectionId}"]`);
    if (btn) {
        btn.classList.add('active');
    }
    document.getElementById(sectionId).classList.add('active');
}

function setupModalHandlers() {
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('show');
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
        }
    });
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.insertBefore(alertDiv, document.body.firstChild);
    setTimeout(() => alertDiv.remove(), 3000);
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

document.addEventListener('DOMContentLoaded', initEventHeadDashboard);