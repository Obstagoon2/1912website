const calendarId = 'ninq39q6r61rid4mot3h1ues5u3cmrdr@import.calendar.google.com';
const apiKey = 'AIzaSyDFk7BVAYxUIngHdDOnVFD14XhnqdOSFDc';
const maxEvents = 100; // upper limit just in case
const eventsPerPage = 6;

let allEvents = [];
let currentOffset = 0;

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'calendar-card';

    const title = document.createElement('h3');
    title.textContent = event.summary || 'Untitled Event';

    const time = document.createElement('p');
    time.className = 'event-time';
    time.textContent = formatDate(event.start.dateTime || event.start.date);

    const location = document.createElement('p');
    location.className = 'event-location';
    location.textContent = event.location || 'Location: TBD';

    const addLink = document.createElement('a');
    addLink.href = event.htmlLink;
    addLink.target = '_blank';
    addLink.rel = 'noopener';
    addLink.className = 'add-calendar-btn';
    addLink.textContent = 'Add to my calendar';

    card.appendChild(title);
    card.appendChild(time);
    card.appendChild(location);
    card.appendChild(addLink);

    return card;
}

function renderNextEvents() {
    const container = document.getElementById('calendar-events');
    const end = currentOffset + eventsPerPage;
    const eventsToShow = allEvents.slice(currentOffset, end);

    eventsToShow.forEach(event => {
        const card = createEventCard(event);
        container.appendChild(card);
    });

    currentOffset = end;

    const loadMoreBtn = document.getElementById('load-more-btn');
    const noMoreMsg = document.getElementById('no-more-msg');

    if (currentOffset >= allEvents.length) {
        loadMoreBtn.style.display = 'none';
        noMoreMsg.style.display = 'block';
    } else {
        loadMoreBtn.style.display = 'inline-block';
        noMoreMsg.style.display = 'none';
    }
}

function fetchCalendarEvents() {
    const timeMin = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=${maxEvents}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.items && data.items.length) {
                allEvents = data.items;
                renderNextEvents();
            } else {
                document.getElementById('calendar-events').innerHTML = '<p>No upcoming events found.</p>';
                document.getElementById('load-more-btn').style.display = 'none';
            }
        })
        .catch(err => {
            console.error('Error fetching calendar events:', err);
            document.getElementById('calendar-events').innerHTML = '<p>Failed to load events.</p>';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('load-more-btn').addEventListener('click', renderNextEvents);
    fetchCalendarEvents();
});
