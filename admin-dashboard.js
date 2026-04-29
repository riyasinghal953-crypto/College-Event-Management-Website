function checkAdminAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.type !== 'admin') {
        alert('Access denied. Please login with the admin password.');
        window.location.href = 'index.html';
        return null;
    }
    
    return currentUser;
}
function loadPendingEvents() {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const pending = events.filter(e => e.approved === false || e.status === 'pending');
    const tbody = document.getElementById('pendingEventsTable');
    tbody.innerHTML = '';

    if (pending.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:2rem;">No pending events</td></tr>';
        return;
    }

    pending.forEach(event => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${event.title}</strong></td>
            <td>${event.eventHead}</td>
            <td>${event.date}</td>
            <td><span class="event-category">${event.category}</span></td>
            <td>${event.registrationStatus || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small" style="background:#10b981;color:white;" onclick="approveEventAdmin(${event.id})">Approve</button>
                    <button class="btn-small btn-delete" onclick="deleteEventAdmin(${event.id})">Reject</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function initAdminDashboard() {
    const currentUser = checkAdminAuth();
    if (!currentUser) return;

    setupMenuListeners();
    setupFormListeners();
    setupModalHandlers();
    loadOverviewData();
    loadAllEvents();
    loadEventHeads();
    loadUsers();
    loadLoginHistory();
    loadPendingEvents();

    document.getElementById('logoutBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        }
    });

    setInterval(updateLastUpdated, 1000);
}

function setupMenuListeners() {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));

            this.classList.add('active');
            const sectionId = this.getAttribute('data-section');
            document.getElementById(sectionId).classList.add('active');

            if (sectionId === 'all-events') {
                loadAllEvents();
            } else if (sectionId === 'event-heads') {
                loadEventHeads();
            } else if (sectionId === 'users') {
                loadUsers();
            } else if (sectionId === 'login-history') {
                loadLoginHistory();
            } else if (sectionId === 'pending-events') {
                loadPendingEvents(); 
            }
        });
    });
}

function loadOverviewData() {
    const appState = {
        events: JSON.parse(localStorage.getItem('events')) || [],
        eventHeads: JSON.parse(localStorage.getItem('eventHeads')) || [],
        users: JSON.parse(localStorage.getItem('users')) || []
    };

    const activeEvents = appState.events.filter(e => e.status === 'active').length;
    const activeHeads = appState.eventHeads.filter(eh => eh.status === 'active').length;

    document.getElementById('statsTotal').textContent = appState.events.length;
    document.getElementById('statsActive').textContent = activeEvents;
    document.getElementById('statsHeads').textContent = activeHeads;
    document.getElementById('statsUsers').textContent = appState.users.length;

    updateLastUpdated();
}

function updateLastUpdated() {
    const now = new Date();
    const time = now.toLocaleTimeString();
    document.getElementById('lastUpdated').textContent = time;
}

function loadAllEvents() {
    const appState = {
        events: JSON.parse(localStorage.getItem('events')) || []
    };

    const tbody = document.getElementById('allEventsTable');
    tbody.innerHTML = '';

    if (appState.events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 2rem;">No events found</td></tr>';
        return;
    }

    appState.events.forEach(event => {
        const regStatusDisplay = {
            'registrations_open': '<span class="status-badge" style="background-color: #d1fae5; color: #065f46;">Open</span>',
            'registrations_upcoming': '<span class="status-badge" style="background-color: #fef3c7; color: #92400e;">Coming</span>',
            'registrations_closed': '<span class="status-badge" style="background-color: #fee2e2; color: #7f1d1d;">Closed</span>'
        };

        const approvalStatus = event.approved === false
            ? '<span class="status-badge" style="background-color:#fef3c7;color:#92400e;">⏳ Pending</span>'
            : '<span class="status-badge" style="background-color:#d1fae5;color:#065f46;">✓ Approved</span>';

        const approveBtn = event.approved === false
            ? `<button class="btn-small" style="background:#10b981;color:white;" onclick="approveEventAdmin(${event.id})">Approve</button>`
            : `<button class="btn-small" style="background:#f59e0b;color:white;" onclick="unapproveEventAdmin(${event.id})">Revoke</button>`;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${event.title}</strong><br><small style="color:#64748b">${approvalStatus}</small></td>
            <td>${event.eventHead}</td>
            <td>${event.date}</td>
            <td><span class="event-category">${event.category}</span></td>
            <td>${event.attendees}/${event.registrationLimit || 100}</td>
            <td>${regStatusDisplay[event.registrationStatus] || '<span class="status-badge status-active">Open</span>'}</td>
            <td><span class="status-badge status-${event.status}">${event.status}</span></td>
            <td>
                <div class="action-buttons">
                    ${approveBtn}
                    <button class="btn-small btn-edit" onclick="openAdminEditEvent(${event.id})">Edit</button>
                    <button class="btn-small btn-delete" onclick="deleteEventAdmin(${event.id})">Delete</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openAdminEditEvent(eventId) {
    const appState = {
        events: JSON.parse(localStorage.getItem('events')) || []
    };

    const event = appState.events.find(e => e.id === eventId);
    if (!event) {
        showAlert('Event not found', 'error');
        return;
    }

    document.getElementById('adminEditEventId').value = event.id;
    document.getElementById('adminEditEventTitle').value = event.title;
    document.getElementById('adminEditEventCategory').value = event.category;
    document.getElementById('adminEditEventDate').value = event.date;
    document.getElementById('adminEditEventTime').value = event.time;
    document.getElementById('adminEditEventLocation').value = event.location;
    document.getElementById('adminEditEventDescription').value = event.description;
    document.getElementById('adminEditEventImage').value = event.image;
    document.getElementById('adminEditEventType').value = event.type || 'upcoming';
    document.getElementById('adminEditEventRegStatus').value = event.registrationStatus || 'registrations_open';
    document.getElementById('adminEditEventRegLink').value = event.formLink || '';
    document.getElementById('adminEditEventRegLimit').value = event.registrationLimit || 100;
    document.getElementById('adminEditEventStatus').value = event.status;

    showModal('editEventModal');
}

function deleteEventAdmin(eventId) {
    if (confirm('Are you sure you want to permanently delete this event?')) {
        const appState = {
            events: JSON.parse(localStorage.getItem('events')) || []
        };

        appState.events = appState.events.filter(e => e.id !== eventId);
        localStorage.setItem('events', JSON.stringify(appState.events));

        showAlert('Event deleted successfully', 'success');
        loadAllEvents();
        loadPendingEvents();
        loadOverviewData();
    }
}

function approveEventAdmin(eventId) {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const idx = events.findIndex(e => e.id === eventId);
    if (idx !== -1) {
        events[idx].approved = true;
        events[idx].status = 'active';
        localStorage.setItem('events', JSON.stringify(events));
        showAlert('Event approved and published!', 'success');
        loadAllEvents();
        loadPendingEvents();
        loadOverviewData();
    }
}

function unapproveEventAdmin(eventId) {
    if (confirm('Revoke approval and hide this event from the public?')) {
        const events = JSON.parse(localStorage.getItem('events')) || [];
        const idx = events.findIndex(e => e.id === eventId);
        if (idx !== -1) {
            events[idx].approved = false;
            localStorage.setItem('events', JSON.stringify(events));
            showAlert('Event approval revoked', 'success');
            loadAllEvents();
            loadOverviewData();
        }
    }
}

function loadEventHeads() {
    const appState = {
        eventHeads: JSON.parse(localStorage.getItem('eventHeads')) || [],
        events: JSON.parse(localStorage.getItem('events')) || []
    };

    const filter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    const tbody = document.getElementById('eventHeadsTable');
    tbody.innerHTML = '';

    let filteredHeads = appState.eventHeads;
    if (filter !== 'all') {
        filteredHeads = appState.eventHeads.filter(eh => eh.status === filter);
    }

    if (filteredHeads.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No event heads found</td></tr>';
        return;
    }

    filteredHeads.forEach(head => {
        const eventsCount = appState.events.filter(e => e.eventHead === head.email).length;
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><strong>${head.name}</strong></td>
            <td>${head.email}</td>
            <td>${head.department}</td>
            <td>${eventsCount}</td>
            <td><span class="status-badge status-${head.status}">${head.status}</span></td>
            <td>${new Date(head.registeredAt).toLocaleDateString()}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-small btn-edit" onclick="openEventHeadControl(${head.id}, '${head.name}', '${head.status}')">Control</button>
                    <button class="btn-small btn-ban" onclick="banEventHead(${head.id})">Ban</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    document.querySelectorAll('[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            loadEventHeads();
        });
    });
}

function openEventHeadControl(headId, headName, status) {
    const appState = {
        eventHeads: JSON.parse(localStorage.getItem('eventHeads')) || []
    };

    const head = appState.eventHeads.find(eh => eh.id === headId);
    if (!head) return;

    let actions = '';
    
    if (status === 'pending') {
        actions = `
            <button class="btn-primary" onclick="approveEventHead(${headId})">Approve</button>
            <button class="btn-secondary" onclick="rejectEventHead(${headId})">Reject</button>
        `;
    } else if (status === 'active') {
        actions = `
            <button class="btn-secondary" onclick="deactivateEventHead(${headId})">Deactivate</button>
            <button class="btn-delete" onclick="banEventHead(${headId})">Ban Permanently</button>
        `;
    } else if (status === 'banned') {
        actions = `
            <button class="btn-primary" onclick="unbanEventHead(${headId})">Unban</button>
        `;
    }

    const content = document.getElementById('eventHeadControlContent');
    content.innerHTML = `
        <div style="margin-bottom: 1.5rem;">
            <p><strong>Event Head:</strong> ${head.name}</p>
            <p><strong>Email:</strong> ${head.email}</p>
            <p><strong>Status:</strong> <span class="status-badge status-${status}">${status}</span></p>
            <p><strong>Joined:</strong> ${new Date(head.registeredAt).toLocaleDateString()}</p>
        </div>
        <div style="display: flex; gap: 1rem;">
            ${actions}
        </div>
    `;

    showModal('eventHeadControlModal');
}

function approveEventHead(headId) {
    const appState = {
        eventHeads: JSON.parse(localStorage.getItem('eventHeads')) || []
    };

    const head = appState.eventHeads.find(eh => eh.id === headId);
    if (head) {
        head.status = 'active';
        localStorage.setItem('eventHeads', JSON.stringify(appState.eventHeads));
        showAlert('Event Head approved!', 'success');
        closeModal('eventHeadControlModal');
        loadEventHeads();
        loadOverviewData();
    }
}

function rejectEventHead(headId) {
    if (confirm('Are you sure you want to reject this application?')) {
        const appState = {
            eventHeads: JSON.parse(localStorage.getItem('eventHeads')) || []
        };

        appState.eventHeads = appState.eventHeads.filter(eh => eh.id !== headId);
        localStorage.setItem('eventHeads', JSON.stringify(appState.eventHeads));
        showAlert('Application rejected', 'success');
        closeModal('eventHeadControlModal');
        loadEventHeads();
        loadOverviewData();
    }
}

function deactivateEventHead(headId) {
    if (confirm('Deactivate this event head?')) {
        const appState = {
            eventHeads: JSON.parse(localStorage.getItem('eventHeads')) || []
        };

        const head = appState.eventHeads.find(eh => eh.id === headId);
        if (head) {
            head.status = 'banned';
            localStorage.setItem('eventHeads', JSON.stringify(appState.eventHeads));
            showAlert('Event Head deactivated', 'success');
            closeModal('eventHeadControlModal');
            loadEventHeads();
        }
    }
}

function banEventHead(headId) {
    if (confirm('⚠️ This will permanently ban the event head. Continue?')) {
        const appState = {
            eventHeads: JSON.parse(localStorage.getItem('eventHeads')) || []
        };

        const head = appState.eventHeads.find(eh => eh.id === headId);
        if (head) {
            head.status = 'banned';
            localStorage.setItem('eventHeads', JSON.stringify(appState.eventHeads));
            showAlert('Event Head banned', 'success');
            closeModal('eventHeadControlModal');
            loadEventHeads();
        }
    }
}

function unbanEventHead(headId) {
    if (confirm('Unban this event head?')) {
        const appState = {
            eventHeads: JSON.parse(localStorage.getItem('eventHeads')) || []
        };

        const head = appState.eventHeads.find(eh => eh.id === headId);
        if (head) {
            head.status = 'active';
            localStorage.setItem('eventHeads', JSON.stringify(appState.eventHeads));
            showAlert('Event Head unbanned', 'success');
            closeModal('eventHeadControlModal');
            loadEventHeads();
        }
    }
}

function loadUsers() {
    const appState = {
        users: JSON.parse(localStorage.getItem('users')) || []
    };

    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = '';

    if (appState.users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">No users registered</td></tr>';
        return;
    }

    appState.users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${user.name}</strong></td>
            <td>${user.email}</td>
            <td>${user.email}</td>
            <td>${new Date(user.registeredAt).toLocaleDateString()}</td>
            <td>
                <button class="btn-small btn-delete" onclick="deleteUser(${user.id})">Remove</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function deleteUser(userId) {
    if (confirm('Remove this user?')) {
        const appState = {
            users: JSON.parse(localStorage.getItem('users')) || []
        };

        appState.users = appState.users.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(appState.users));
        showAlert('User removed', 'success');
        loadUsers();
        loadOverviewData();
    }
}

function loadLoginHistory() {
    const tbody = document.getElementById('loginHistoryTable');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Login history tracked in real-time</td></tr>';

    const mockHistory = [
        {
            name: 'Admin',
            email: 'admin@college.com',
            type: 'admin',
            time: new Date().toLocaleString(),
            status: 'success'
        }
    ];

    tbody.innerHTML = '';
    mockHistory.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${log.name}</td>
            <td>${log.email}</td>
            <td><span class="status-badge status-active">${log.type}</span></td>
            <td>${log.time}</td>
            <td><span class="status-badge status-active">${log.status}</span></td>
        `;
        tbody.appendChild(row);
    });
}

function setupFormListeners() {
    document.getElementById('editAdminEventForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const eventId = parseInt(document.getElementById('adminEditEventId').value);
        const appState = {
            events: JSON.parse(localStorage.getItem('events')) || []
        };

        const eventIndex = appState.events.findIndex(e => e.id === eventId);
        if (eventIndex === -1) {
            showAlert('Event not found', 'error');
            return;
        }

        appState.events[eventIndex] = {
            ...appState.events[eventIndex],
            title: document.getElementById('adminEditEventTitle').value,
            category: document.getElementById('adminEditEventCategory').value,
            date: document.getElementById('adminEditEventDate').value,
            time: document.getElementById('adminEditEventTime').value,
            location: document.getElementById('adminEditEventLocation').value,
            description: document.getElementById('adminEditEventDescription').value,
            image: document.getElementById('adminEditEventImage').value,
            type: document.getElementById('adminEditEventType').value,
            registrationStatus: document.getElementById('adminEditEventRegStatus').value,
            formLink: document.getElementById('adminEditEventRegLink').value,
            registrationLimit: parseInt(document.getElementById('adminEditEventRegLimit').value),
            status: document.getElementById('adminEditEventStatus').value
        };

        localStorage.setItem('events', JSON.stringify(appState.events));
        showAlert('Event updated successfully!', 'success');
        closeModal('editEventModal');
        loadAllEvents();
        loadOverviewData();
    });
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

function switchSection(sectionId) {
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.dashboard-section').forEach(s => s.classList.remove('active'));

    const btn = document.querySelector(`[data-section="${sectionId}"]`);
    if (btn) {
        btn.classList.add('active');
    }
    document.getElementById(sectionId).classList.add('active');
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

function resetAllData() {
    if (confirm('⚠️ This will permanently delete ALL events, users, and event heads data. This cannot be undone!')) {
        if (confirm('Are you absolutely sure? Type CONFIRM to proceed')) {
            localStorage.setItem('events', JSON.stringify([]));
            localStorage.setItem('users', JSON.stringify([]));
            localStorage.setItem('eventHeads', JSON.stringify([]));
            showAlert('All data has been reset', 'success');
            loadOverviewData();
            loadAllEvents();
            loadEventHeads();
            loadUsers();
        }
    }
}

document.addEventListener('DOMContentLoaded', initAdminDashboard);