function loadRegistrations(filter = 'all') {
    const events = JSON.parse(localStorage.getItem('events')) || [];
    const grid = document.getElementById('registrationGrid');
    const noData = document.getElementById('noRegistrations');

    grid.innerHTML = '';

    let filtered = events.filter(e => e.registrationStatus === 'registrations_open');

    if (filter !== 'all') {
        filtered = filtered.filter(e => e.category === filter);
    }

    if (filtered.length === 0) {
        noData.style.display = 'block';
        return;
    } else {
        noData.style.display = 'none';
    }

    filtered.forEach(event => {
        const card = document.createElement('div');
        card.className = 'registration-card';

        card.innerHTML = `
            <div class="registration-card-header">
                <h2>${event.title}</h2>
                <span class="badge">${event.category}</span>
            </div>

            <div class="registration-card-content">
                <div class="event-meta">
                    <div class="meta-item">
                        <strong>Date</strong>
                        ${event.date}
                    </div>
                    <div class="meta-item">
                        <strong>Time</strong>
                        ${event.time}
                    </div>
                    <div class="meta-item">
                        <strong>Location</strong>
                        ${event.location}
                    </div>
                    <div class="meta-item">
                        <strong>Seats</strong>
                        ${event.attendees}/${event.registrationLimit}
                    </div>
                </div>

                <!-- 👇 Google Form Link (IMPORTANT) -->
                <a href="${event.formLink}" target="_blank" class="google-form-link">
                Register Now
                </a>

                <div class="registration-status">
                    Registrations are open. Hurry up!
                </div>
            </div>
        `;

        grid.appendChild(card);
    });
}
function openForm(link) {
    if (!link || link === '#') {
        showAlert('Registration link not available', 'error');
        return;
    }
    window.open(link, '_blank');
}

document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', function () {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        const filter = this.getAttribute('data-filter');
        loadRegistrations(filter);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadRegistrations();
});