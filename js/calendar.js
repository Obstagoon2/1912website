const calendarId = "ninq39q6r61rid4mot3h1ues5u3cmrdr@import.calendar.google.com";
const apiKey = "AIzaSyDFk7BVAYxUIngHdDOnVFD14XhnqdOSFDc";
const maxPerPage = 6;

let allEvents = [];
let shownCount = 0;

document.addEventListener("DOMContentLoaded", async () => {
    const events = await fetchEvents();
    if (events.length === 0) {
        document.getElementById("calendar-events").innerHTML = "<p>No upcoming events found.</p>";
        return;
    }

    allEvents = events;
    renderEvents();
    setupLoadMoreButton();
});

async function fetchEvents() {
    const now = new Date().toISOString();
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&timeMin=${now}&singleEvents=true&orderBy=startTime`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.items || [];
    } catch (err) {
        console.error("Error fetching events:", err);
        return [];
    }
}

function renderEvents() {
    const container = document.getElementById("calendar-events");
    const nextEvents = allEvents.slice(shownCount, shownCount + maxPerPage);

    for (const event of nextEvents) {
        const card = document.createElement("div");
        card.classList.add("event-card");

        const title = event.summary || "No Title";
        const start = new Date(event.start.dateTime || event.start.date);
        const end = new Date(event.end.dateTime || event.end.date);
        const location = event.location || "No location provided";
        const description = event.description?.split("You can see")[0].trim() || "";

        const startTime = start.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
        const endTime = end.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

        const calendarUrl = createGoogleCalendarUrl(event);

        card.innerHTML = `
            <h3>${title}</h3>
            <p><strong>${startTime}</strong> - <strong>${endTime}</strong></p>
            <p>${description}</p>
            <p><strong>Location:</strong> ${location}</p>
            <a href="${calendarUrl}" target="_blank" class="calendar-add-button">➕ Add to My Calendar</a>
        `;

        container.appendChild(card);
    }

    shownCount += nextEvents.length;

    const loadMoreBtn = document.getElementById("load-more-btn");
    const noMoreMsg = document.getElementById("no-more-msg");

    if (shownCount >= allEvents.length) {
        loadMoreBtn.style.display = "none";
        noMoreMsg.style.display = "block";
    }
}

function setupLoadMoreButton() {
    const btn = document.getElementById("load-more-btn");
    btn.style.display = "block";
    btn.addEventListener("click", renderEvents);
}

function createGoogleCalendarUrl(event) {
    const title = encodeURIComponent(event.summary || "Team 1912 Event");
    const start = new Date(event.start.dateTime || event.start.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(event.end.dateTime || event.end.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const details = encodeURIComponent(event.description?.split("You can see")[0].trim() || "");
    const location = encodeURIComponent(event.location || "");

    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&sf=true&output=xml`;
}
