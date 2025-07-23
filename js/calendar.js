const calendarEventsContainer = document.getElementById("calendar-events");
const loadMoreBtn = document.getElementById("load-more-btn");
const noMoreMsg = document.getElementById("no-more-msg");

let allEvents = [];
let eventsLoaded = 0;
const eventsPerPage = 6;

const calendarId = 'ninq39q6r61rid4mot3h1ues5u3cmrdr@import.calendar.google.com';
const apiKey = 'AIzaSyDFk7BVAYxUIngHdDOnVFD14XhnqdOSFDc';
const apiUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`;

function createAddToCalendarLink(event) {
    const start = event.start.dateTime || event.start.date;
    const end = event.end.dateTime || event.end.date;
    const title = encodeURIComponent(event.summary || 'Team 1912 Event');
    const details = encodeURIComponent(event.description || '');
    const location = encodeURIComponent(event.location || '');

    function formatDate(dateString) {
        if (!dateString) return '';
        const d = new Date(dateString);
        return d.toISOString().replace(/[-:]|\.\d{3}/g, '');
    }

    const startFormatted = formatDate(start);
    const endFormatted = formatDate(end);

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${location}&sf=true&output=xml`;
}

function createEventCard(event) {
    const card = document.createElement("div");
    card.className = "calendar-card";

    const title = document.createElement("h3");
    title.textContent = event.summary || "Untitled Event";

    const date = document.createElement("p");
    const startDate = new Date(event.start.dateTime || event.start.date);
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    date.textContent = startDate.toLocaleDateString(undefined, options) + " @ " +
        (startDate.getHours().toString().padStart(2, '0') + ":" + startDate.getMinutes().toString().padStart(2, '0'));

    const desc = document.createElement("p");
    desc.textContent = event.description || "";

    const addBtn = document.createElement("a");
    addBtn.href = createAddToCalendarLink(event);
    addBtn.textContent = "Add to Calendar";
    addBtn.className = "add-calendar-btn";
    addBtn.target = "_blank";
    addBtn.rel = "noopener noreferrer";

    card.appendChild(title);
    card.appendChild(date);
    if (desc.textContent) card.appendChild(desc);
    card.appendChild(addBtn);

    return card;
}

function appendEvents() {
    const nextSlice = allEvents.slice(eventsLoaded, eventsLoaded + eventsPerPage);
    nextSlice.forEach(event => {
        const card = createEventCard(event);
        calendarEventsContainer.appendChild(card);
    });

    eventsLoaded += nextSlice.length;

    if (eventsLoaded >= allEvents.length) {
        loadMoreBtn.style.display = "none";
        noMoreMsg.style.display = "block";
    }
}

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        allEvents = data.items || [];
        if (allEvents.length > 0) {
            appendEvents();
        } else {
            calendarEventsContainer.innerHTML = "<p>No upcoming events found.</p>";
            loadMoreBtn.style.display = "none";
        }
    })
    .catch(error => {
        console.error("Error fetching events:", error);
        calendarEventsContainer.innerHTML = "<p>Failed to load events.</p>";
        loadMoreBtn.style.display = "none";
    });

loadMoreBtn.addEventListener("click", appendEvents);
