const appState = {
    currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    users: JSON.parse(localStorage.getItem('users')) || [],
    eventHeads: JSON.parse(localStorage.getItem('eventHeads')) || [],
    events: JSON.parse(localStorage.getItem('events')) || [],
    admin: { password: 'management' }, // Admin portal password
};

const sampleEvents = [
    {
        id: 1,
        title: 'Web Development Bootcamp',
        category: 'tech',
        date: '2026-12-28',
        time: '10:00 AM',
        location: 'Computer Lab - CSE Block',
        description: 'Learn modern web development with HTML, CSS, and JavaScript. Perfect for beginners! This bootcamp covers responsive design, JavaScript basics, and practical projects.',
        image: 'images/sample1.webp',
        eventHead: 'tech.head@college.com',
        attendees: 45,
        registrationLimit: 100,
        status: 'active',
        registrationStatus: 'registrations_open',
        formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc9VM9chfhJGbuvkX42v1gVo-E-w2LLP2olOySre0mdWEFz9Q/viewform?usp=publish-editor',
        type: 'upcoming',
        createdAt: new Date().toISOString()
    },
    {
        id: 2,
        title: 'Basketball Tournament',
        category: 'sports',
        date: '2026-04-30',
        time: '3:00 PM',
        location: 'Sports Ground - Main Court',
        description: 'Inter-college basketball championship. Register your team now! Teams of 5 players each. Both men and women categories available.',
        image: 'images/sample2.jpg',
        eventHead: 'sports.head@college.com',
        attendees: 120,
        registrationLimit: 200,
        status: 'active',
        registrationStatus: 'registrations_open',
        formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc5Kytrp1qQALzf--r1r9LPQ-tOvU0GHQdUxapc5JXqp8UB3w/viewform?usp=publish-editor',
        type: 'ongoing',
        createdAt: new Date().toISOString()
    },
    {
        id: 3,
        title: 'Cultural Fest 2026',
        category: 'cultural',
        date: '2026-05-05',
        time: '5:00 PM',
        location: 'Amphitheater',
        description: 'Experience diverse cultures through music, dance, and food. Everyone welcome! Featuring performances from 15+ countries and cuisines.',
        image: 'images/sample3.webp',
        eventHead: 'cultural.head@college.com',
        attendees: 200,
        registrationLimit: 500,
        status: 'active',
        registrationStatus: 'registrations_open',
        formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSfjsarhXbKHA4JnnRu66hDEoNIRCHWCEseM1v14AosAacOieQ/viewform?usp=header',
        type: 'ongoing',
        createdAt: new Date().toISOString()
    },
    {
        id: 4,
        title: 'Math Olympiad',
        category: 'academic',
        date: '2026-06-20',
        time: '2:00 PM',
        location: 'Lecture Hall 1',
        description: 'Challenge yourself with advanced mathematical problems. Test your skills against the best minds! Prizes worth ₹50,000.',
        image: 'images/sample4.jpg',
        eventHead: 'academic.head@college.com',
        attendees: 78,
        registrationLimit: 150,
        status: 'active',
        registrationStatus: 'registrations_upcoming',
        formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSfT_UlnqE3yTz0nm8HUwt1kbUfCiHCROM0Tn_NiBSwbG63uFA/viewform?usp=publish-editor',
        type: 'upcoming',
        createdAt: new Date().toISOString()
    },
    {
        id: 5,
        title: 'AI & Machine Learning Workshop',
        category: 'tech',
        date: '2026-06-08',
        time: '11:00 AM',
        location: 'Lecture Hall-1',
        description: 'Introduction to Artificial Intelligence and Machine Learning basics. Learn from industry experts. Hands-on coding sessions included.',
        image: 'images/sample5.jpg',
        eventHead: 'tech.head@college.com',
        attendees: 89,
        registrationLimit: 120,
        status: 'active',
        registrationStatus: 'registrations_open',
        formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSerwKBLmNIcL619VHkJUf6aaQ24Nv0B2AEb8Wjhox2zNShiXA/viewform?usp=publish-editor',
        type: 'upcoming',
        createdAt: new Date().toISOString()
    },
    {
        id: 6,
        title: 'Football League Finals',
        category: 'sports',
        date: '2026-06-22',
        time: '4:00 PM',
        location: 'Sports Field - Main Ground',
        description: 'Exciting football matches between college teams. Support your house! Grand finale with trophy ceremony and awards.',
        image: 'images/sample6.jpg',
        eventHead: 'sports.head@college.com',
        attendees: 150,
        registrationLimit: 300,
        status: 'active',
        registrationStatus: 'registrations_closed',
        formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSdFHK8RQK92x7rxh8Ll0pcz3FCvR2bUF1td5ytaHTX0m7-fsg/viewform?usp=publish-editor',
        type: 'upcoming',
        createdAt: new Date().toISOString()
    },
    {
        id: 7,
        title: 'Photography Exhibition',
        category: 'cultural',
        date: '2026-07-23',
        time: '9:00 AM',
        location: 'Art Gallery - Ground Floor',
        description: 'Showcase of student photography exploring themes of nature, culture, and society. Open for submissions until 20th Dec.',
        image: 'images/sample7.jpg',
        eventHead: 'cultural.head@college.com',
        attendees: 45,
        registrationLimit: 80,
        status: 'active',
        registrationStatus: 'registrations_upcoming',
        formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc5jFBjjKqvNfSHHZyBvM3TTExXEJbV14lClgnDPluw18hnZQ/viewform?usp=publish-editor',
        type: 'upcoming',
        createdAt: new Date().toISOString()
    },
    {
        id: 8,
        title: 'Science Symposium 2026',
        category: 'academic',
        date: '2026-04-26',
        time: '10:00 AM',
        location: 'PCM Building - Lecture Hall - 1',
        description: 'Present your research and innovations in science. Network with professors and fellow students. Poster presentations and talks.',
        image: 'images/sample8.jpg',
        eventHead: 'academic.head@college.com',
        attendees: 95,
        registrationLimit: 150,
        status: 'active',
        registrationStatus: 'registrations_open',
        formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSfEBE7uTMF5M0fw3MMhx6cJ53emFPPMMltek3gQsfBaJXRAVA/viewform?usp=publish-editor',
        type: 'ongoing',
        createdAt: new Date().toISOString()
    },
    {
        id: 9,
        title: 'App Development Challenge',
        category: 'tech',
        date: '2026-06-05',
        time: '1:00 PM',
        location: 'Lecture Hall-1',
        description: 'Build amazing mobile and web applications in 24 hours. Teams of 2-4. Prizes for best innovations and best UI/UX.',
        image: 'images/sample9.jpg',
        eventHead: 'tech.head@college.com',
        attendees: 120,
        registrationLimit: 200,
        status: 'active',
        registrationStatus: 'registrations_open',
        formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSctFAIbWJ1zARB2DqOfyFRxwey0jOo0d6OrJ1XWtGq6B_c49A/viewform?usp=publish-editor',
        type: 'upcoming',
        createdAt: new Date().toISOString()
    },
    {
        id: 10,
        title: 'Cricket Championship',
        category: 'sports',
        date: '2026-04-25',
        time: '2:00 PM',
        location: 'Cricket Ground',
        description: 'T20 Cricket tournament featuring all college teams. Inter-departmental championship with trophy and medals for winners.',
        image: 'images/sample10.webp',
        eventHead: 'sports.head@college.com',
        attendees: 180,
        registrationLimit: 400,
        status: 'active',
        registrationStatus: 'registrations_open',
        formLink: 'https://docs.google.com/forms/d/e/1FAIpQLSfnI8rnl6EVydhldBNP5_0n4lPRRg0WL2-NoKV-Cr3puK0O1Q/viewform?usp=publish-editor',
        type: 'ongoing',
        createdAt: new Date().toISOString()
    }
];
const storedEvents = JSON.parse(localStorage.getItem('events'));

if (!storedEvents || storedEvents.length === 0) {
    localStorage.setItem('events', JSON.stringify(sampleEvents));
    appState.events = sampleEvents;
} else {
    appState.events = storedEvents;
}

function saveToLocalStorage() {
    localStorage.setItem('users', JSON.stringify(appState.users));
    localStorage.setItem('eventHeads', JSON.stringify(appState.eventHeads));
    localStorage.setItem('events', JSON.stringify(appState.events));
    if (appState.currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));
    }
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    document.body.insertBefore(alertDiv, document.body.firstChild);
    setTimeout(() => alertDiv.remove(), 3000);
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function logout() {
    localStorage.removeItem('currentUser');
    appState.currentUser = null;
    location.reload();
}

function renderEvents(filter = 'all') {
    const eventsGrid = document.getElementById('eventsGrid');
    eventsGrid.innerHTML = '';

    let filteredEvents = appState.events;
    if (filter !== 'all') {
        filteredEvents = appState.events.filter(event => event.category === filter);
    }

    filteredEvents.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        let registrationBadge = '';
        if (event.registrationStatus === 'registrations_open') {
            registrationBadge = '<span style="background-color: #10b981; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Registrations Open</span>';
        } else if (event.registrationStatus === 'registrations_upcoming') {
            registrationBadge = '<span style="background-color: #f59e0b; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Coming Soon</span>';
        } else if (event.registrationStatus === 'registrations_closed') {
            registrationBadge = '<span style="background-color: #ef4444; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">Closed</span>';
        }
        
        const typeBadge = event.type === 'upcoming' 
            ? '<span style="background-color: #6366f1; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem; font-weight: 600;">Upcoming</span>'
            : '<span style="background-color: #8b5cf6; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; margin-left: 0.5rem; font-weight: 600;">Ongoing</span>';
        
        eventCard.innerHTML = `
            <div class="event-image" style="background-image: url('${event.image}'); background-size: cover; background-position: center; height: 200px; position: relative;">
                <div style="position: absolute; top: 10px; left: 10px;">
                    <span class="event-category">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                </div>
            </div>
            <div class="event-content">
                <h3 class="event-title">${event.title}</h3>
                <div style="margin-bottom: 0.8rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${registrationBadge}
                    ${typeBadge}
                </div>
                <p class="event-date">📅 ${event.date} at ${event.time}</p>
                <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 0.5rem;">📍 ${event.location}</p>
                <p class="event-description">${event.description}</p>
                <div class="event-footer">
                    <span class="event-attendees">👥 ${event.attendees}/${event.registrationLimit} registered</span>
                </div>
            </div>
        `;
        eventCard.addEventListener('click', () => showEventDetails(event));
        eventsGrid.appendChild(eventCard);
    });
}
function openForm(link) {
    if (!link) {
        alert("Registration link not available");
        return;
    }
    window.open(link, '_blank'); // opens Google Form
}

function showEventDetails(event) {
    const currentUser = getCurrentUser();
    const modal = document.getElementById('eventDetailsModal');
    const content = document.getElementById('eventDetailsContent');

    let actionButtons = '';
    let registrationStatusText = '';
    
    if (event.registrationStatus === 'registrations_open') {
        registrationStatusText = '<span class="status-badge" style="background-color: #d1fae5; color: #065f46;">✓ Registrations Open</span>';
        
        if (currentUser && currentUser.type === 'eventHead' && currentUser.email === event.eventHead) {
            actionButtons = `
                <button class="btn-primary" onclick="editEvent(${event.id})">Edit Event</button>
                <button class="btn-secondary" onclick="deleteEvent(${event.id})">Delete Event</button>
            `;
        } else {
            actionButtons = `
               <button class="btn-primary" onclick="openForm('${event.formLink}')">Register for Event</button>
            `;
        }
    } else if (event.registrationStatus === 'registrations_upcoming') {
        registrationStatusText = '<span class="status-badge" style="background-color: #fef3c7; color: #92400e;">⏰ Registrations Coming Soon</span>';
        actionButtons = '<p style="color: #64748b; font-style: italic;">Registrations will open soon. Check back later!</p>';
    } else if (event.registrationStatus === 'registrations_closed') {
        registrationStatusText = '<span class="status-badge" style="background-color: #fee2e2; color: #7f1d1d;">✕ Registrations Closed</span>';
        actionButtons = '<p style="color: #64748b; font-style: italic;">Registration for this event has been closed.</p>';
    }

    const eventTypeDisplay = event.type === 'upcoming' 
        ? '<span class="status-badge" style="background-color: #dbeafe; color: #1e40af;">Upcoming Event</span>'
        : '<span class="status-badge" style="background-color: #e9d5ff; color: #6b21a8;">Ongoing Event</span>';

    content.innerHTML = `
        <div style="text-align: center;">
            <img src="${event.image}" alt="${event.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 12px; margin-bottom: 1.5rem;">
            <h2>${event.title}</h2>
            <div style="margin-bottom: 1rem; display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">
                <span class="event-category">${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</span>
                ${eventTypeDisplay}
                ${registrationStatusText}
            </div>
        </div>
        
        <div style="margin-top: 2rem;">
            <h3>Event Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; background-color: var(--bg-color); padding: 1.5rem; border-radius: 8px;">
                <div>
                    <p><strong>📅 Date:</strong> ${event.date}</p>
                    <p><strong>⏰ Time:</strong> ${event.time}</p>
                    <p><strong>📍 Location:</strong> ${event.location}</p>
                </div>
                <div>
                    <p><strong>👥 Registrations:</strong> ${event.attendees}/${event.registrationLimit}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${event.status}">${event.status}</span></p>
                    <p><strong>Organized by:</strong> ${event.eventHead}</p>
                </div>
            </div>

            <h4>About This Event</h4>
            <p style="color: #64748b; line-height: 1.8; margin-bottom: 2rem;">${event.description}</p>

            <div style="background-color: var(--bg-color); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem;">
                <h4 style="margin-top: 0;">Registration Status</h4>
                <p style="color: #64748b; margin: 0;">
                    ${event.registrationStatus === 'registrations_open' 
                        ? '✓ Registrations are currently open. Hurry up and secure your spot!' 
                        : event.registrationStatus === 'registrations_upcoming'
                        ? '⏰ Registrations will open soon. Keep an eye on this page!' 
                        : '✕ Registrations are closed for this event.'}
                </p>
                <p style="color: #64748b; font-size: 0.9rem; margin-top: 0.8rem;">
                    <strong>Progress:</strong>
                    <div style="background-color: white; border-radius: 8px; height: 10px; margin-top: 0.5rem; overflow: hidden;">
                        <div style="background-color: var(--primary-color); height: 100%; width: ${(event.attendees / event.registrationLimit) * 100}%; transition: width 0.3s ease;"></div>
                    </div>
                    ${event.attendees}/${event.registrationLimit} spots filled
                </p>
            </div>

            ${actionButtons ? `<div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">${actionButtons}</div>` : ''}
        </div>
    `;

    showModal('eventDetailsModal');
}

function registerEvent(eventId) {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        closeAllModals();
        showModal('registrationModal');
        showAlert('Please register or login to complete event registration', 'info');
        return;
    }

    showAlert('Successfully registered for the event!', 'success');
}

function setupAuthListeners() {
    document.getElementById('userLoginBtn').addEventListener('click', () => {
        closeAllModals();
        showModal('userLoginModal');
    });

    document.getElementById('userLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('userEmail').value;
        const password = document.getElementById('userPassword').value;

        const user = appState.users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify({ ...user, type: 'user' }));
            showAlert('Login successful!', 'success');
            setTimeout(() => location.reload(), 1000);
        } else {
            showAlert('Invalid email or password', 'error');
        }
    });

    document.getElementById('registrationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('userName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }

        if (appState.users.some(u => u.email === email)) {
            showAlert('Email already registered', 'error');
            return;
        }

        const newUser = { id: Date.now(), name, email, password, registeredAt: new Date().toISOString() };
        appState.users.push(newUser);
        saveToLocalStorage();
        showAlert('Registration successful! Please login.', 'success');
        closeModal('registrationModal');
    });

    document.getElementById('eventHeadLoginBtn').addEventListener('click', () => {
        closeAllModals();
        showModal('eventHeadLoginModal');
    });

    document.getElementById('eventHeadLoginForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('eventHeadEmail').value;
        const password = document.getElementById('eventHeadPassword').value;

        const eventHead = appState.eventHeads.find(eh => eh.email === email && eh.password === password);
        if (eventHead) {
            localStorage.setItem('currentUser', JSON.stringify({ ...eventHead, type: 'eventHead' }));
            showAlert('Login successful!', 'success');
            setTimeout(() => window.location.href = 'event-head.html', 1000);
        } else {
            showAlert('Invalid email or password', 'error');
        }
    });

    document.getElementById('eventHeadRegistrationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('eventHeadName').value;
        const email = document.getElementById('eventHeadRegEmail').value;
        const department = document.getElementById('eventHeadDept').value;
        const password = document.getElementById('eventHeadRegPassword').value;
        const confirmPassword = document.getElementById('eventHeadConfirmPassword').value;

        if (password !== confirmPassword) {
            showAlert('Passwords do not match', 'error');
            return;
        }

        if (appState.eventHeads.some(eh => eh.email === email)) {
            showAlert('Email already registered', 'error');
            return;
        }

        const newEventHead = {
            id: Date.now(),
            name,
            email,
            department,
            password,
            status: 'pending', 
            loginHistory: [],
            registeredAt: new Date().toISOString()
        };
        appState.eventHeads.push(newEventHead);
        saveToLocalStorage();
        showAlert('Registration successful! Waiting for admin approval.', 'success');
        closeModal('eventHeadRegistrationModal');
    });

    document.getElementById('adminLoginBtn').addEventListener('click', () => {
        closeAllModals();
        showModal('adminLoginModal');
    });

    document.getElementById('adminLoginSubmitBtn').addEventListener('click', () => {
        const password = document.getElementById('adminPassword').value;

        if (password === appState.admin.password) {
            localStorage.setItem('currentUser', JSON.stringify({ email: 'admin', type: 'admin' }));
            showAlert('Admin login successful!', 'success');
            setTimeout(() => window.location.href = 'admin-dashboard.html', 1000);
        } else {
            showAlert('Invalid admin password', 'error');
        }
    });

    document.getElementById('switchToRegister').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('userLoginModal');
        showModal('registrationModal');
    });

    document.getElementById('switchToLogin').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('registrationModal');
        showModal('userLoginModal');
    });

    document.getElementById('switchToEventHeadReg').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('eventHeadLoginModal');
        showModal('eventHeadRegistrationModal');
    });

    document.getElementById('switchToEventHeadLogin').addEventListener('click', (e) => {
        e.preventDefault();
        closeModal('eventHeadRegistrationModal');
        showModal('eventHeadLoginModal');
    });
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('show'));
}

function setupModalCloseHandlers() {
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

function setupFilterListeners() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            renderEvents(category);
        });
    });
}

function setupNavbarListeners() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    document.getElementById('exploreBtn').addEventListener('click', () => {
        document.getElementById('events').scrollIntoView({ behavior: 'smooth' });
    });

    const registerNowBtn = document.getElementById('registerNowBtn');
    if (registerNowBtn) {
        registerNowBtn.addEventListener('click', () => {
            window.location.href = 'registrations.html';
        });
    }
}

function updateNavbarUI() {
    const currentUser = getCurrentUser();
    const userLoginBtn = document.getElementById('userLoginBtn');
    const eventHeadLoginBtn = document.getElementById('eventHeadLoginBtn');
    const adminLoginBtn = document.getElementById('adminLoginBtn');

    if (currentUser) {
        if (currentUser.type === 'admin') {
            userLoginBtn.style.display = 'none';
            eventHeadLoginBtn.style.display = 'none';
            adminLoginBtn.style.display = 'block';
            adminLoginBtn.textContent = '📊 Admin Dashboard';
            adminLoginBtn.style.background = 'var(--danger-color)';
            adminLoginBtn.onclick = () => window.location.href = 'admin-dashboard.html';
        } else if (currentUser.type === 'eventHead') {
            userLoginBtn.style.display = 'none';
            eventHeadLoginBtn.innerHTML = `👤 ${currentUser.name} <button class="btn-secondary" style="margin-left: 10px;" onclick="logout()">Logout</button>`;
            adminLoginBtn.style.display = 'none';
        } else if (currentUser.type === 'user') {
            userLoginBtn.innerHTML = `👤 ${currentUser.name} <button class="btn-secondary" style="margin-left: 10px;" onclick="logout()">Logout</button>`;
            eventHeadLoginBtn.style.display = 'none';
            adminLoginBtn.style.display = 'none';
        }
    } else {
        userLoginBtn.style.display = 'block';
        userLoginBtn.textContent = 'Register / Login';
        eventHeadLoginBtn.style.display = 'block';
        adminLoginBtn.style.display = 'block';
        adminLoginBtn.textContent = 'Admin Login';
    }
}

function createEvent(eventData) {
    const events = JSON.parse(localStorage.getItem('events')) || [];

    const newEvent = {
        id: Date.now(),
        ...eventData,
        createdAt: new Date().toISOString(),
        status: 'pending',      
        approved: false,        
        attendees: 0
    };

    events.push(newEvent);

    localStorage.setItem('events', JSON.stringify(events));

    return newEvent;
}

function updateEvent(eventId, eventData) {
    const index = appState.events.findIndex(e => e.id === eventId);
    if (index !== -1) {
        appState.events[index] = { ...appState.events[index], ...eventData };
        saveToLocalStorage();
        return appState.events[index];
    }
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        appState.events = appState.events.filter(e => e.id !== eventId);
        saveToLocalStorage();
        showAlert('Event deleted successfully', 'success');
        closeAllModals();
    }
}

function editEvent(eventId) {
    const event = appState.events.find(e => e.id === eventId);
    if (event) {
        localStorage.setItem('editingEvent', JSON.stringify(event));
        window.location.href = 'event-head.html?edit=' + eventId;
    }
}

function init() {
    if (document.getElementById('eventsGrid')) {
        renderEvents();
        setupFilterListeners();
        setupNavbarListeners();
        setupAuthListeners();
        setupModalCloseHandlers();
        updateNavbarUI();
    }
}

document.addEventListener('DOMContentLoaded', init);