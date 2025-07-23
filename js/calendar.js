document.addEventListener("DOMContentLoaded", () => {
  const loadMoreBtn = document.getElementById("load-more-btn");
  const noMoreMsg = document.getElementById("no-more-msg");
  const eventsContainer = document.getElementById("calendar-events");
  const eventsPerPage = 6;
  let currentCount = 0;

  // Replace this with your actual Google Calendar ID and API key
  const calendarId = "ninq39q6r61rid4mot3h1ues5u3cmrdr@import.calendar.google.com";
  const apiKey = "AIzaSyDFk7BVAYxUIngHdDOnVFD14XhnqdOSFDc";

  let allEvents = [];

  // Format event date nicely
  function formatEventDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  // Create event card HTML
  function createEventCard(event) {
    const card = document.createElement("div");
    card.className = "event-card";
    card.innerHTML = `
      <h3>${event.summary || "No Title"}</h3>
      <p><strong>Date:</strong> ${formatEventDate(event.start.dateTime || event.start.date)}</p>
      <p>${event.description ? event.description : ""}</p>
    `;
    return card;
  }

  // Render events up to currentCount
  function renderEvents() {
    eventsContainer.innerHTML = "";
    const eventsToShow = allEvents.slice(0, currentCount);
    eventsToShow.forEach((event) => {
      eventsContainer.appendChild(createEventCard(event));
    });
  }

  // Fetch events from Google Calendar API
  async function fetchEvents() {
    const now = new Date().toISOString();
    const maxResults = 2500; // max allowed by API

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events?key=${apiKey}&timeMin=${now}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      const data = await response.json();
      allEvents = data.items || [];

      // Initialize display
      currentCount = Math.min(eventsPerPage, allEvents.length);
      renderEvents();
      noMoreMsg.style.display = "none";
      loadMoreBtn.style.display = "inline-block";
    } catch (error) {
      console.error("Failed to fetch calendar events:", error);
      eventsContainer.innerHTML = "<p style='color: #f00;'>Failed to load events.</p>";
      loadMoreBtn.style.display = "none";
    }
  }

  loadMoreBtn.addEventListener("click", () => {
    if (currentCount >= allEvents.length) {
      noMoreMsg.style.display = "block";
    } else {
      currentCount = Math.min(currentCount + eventsPerPage, allEvents.length);
      renderEvents();
      noMoreMsg.style.display = "none";
    }
  });

  fetchEvents();
});
