const calendarContainer = document.getElementById("event-cards");

const calendarId = "ninq39q6r61rid4mot3h1ues5u3cmrdr@import.calendar.google.com";
const apiKey = "AIzaSyDFk7BVAYxUIngHdDOnVFD14XhnqdOSFDc";
const maxEvents = 10;

async function fetchCalendarEvents() {
    const now = new Date().toISOString();
    const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&orderBy=startTime&singleEvents=true&timeMin=${now}&maxResults=${maxEvents}`;

    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        displayEvents(data.items);
    } catch (error) {
        calendarContainer.innerHTML = `<p class="error">Unable to load events. Please try again later.</p>`;
        console.error("Failed to fetch events:", error);
    }
}

function displayEvents(events) {
    if (!events.length) {
        calendarContainer.innerHTML = "<p class='no-events'>No upcoming events.</p>";
        return;
    }

    calendarContainer.innerHTML = "";

    events.forEach(event => {
        const title = event.summary || "Untitled Event";
        const description = event.description || "";
        const location = event.location || "Location TBA";
        const start = formatDate(event.start.dateTime || event.start.date);
        const end = event.end?.dateTime || event.end?.date;

        const card = document.createElement("div");
        card.className = "event-card";
        card.innerHTML = `
            <h3>${title}</h3>
            <p><strong>Date:</strong> ${start}</p>
            <p><strong>Location:</strong> ${location}</p>
            ${description ? `<p class="event-description">${description}</p>` : ""}
        `;
        calendarContainer.appendChild(card);
    });
}

function formatDate(dateStr) {
    const options = {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
    };
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", options);
}

document.addEventListener("DOMContentLoaded", fetchCalendarEvents);
