const calendarId = 'ninq39q6r61rid4mot3h1ues5u3cmrdr@import.calendar.google.com';
const apiKey = 'AIzaSyDFk7BVAYxUIngHdDOnVFD14XhnqdOSFDc';

const calendarEventsContainer = document.getElementById('calendar-events');
const loadMoreBtn = document.getElementById('load-more-btn');
const noMoreMsg = document.getElementById('no-more-msg');

let allEvents = [];
let eventsDisplayed = 0;
const EVENTS_PER_PAGE = 3;

async function fetchCalendarEvents() {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    allEvents = data.items || [];
    displayNextEvents();
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    calendarEventsContainer.innerHTML = '<p style="color:#ff6666;">Failed to load events.</p>';
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  });
}

function createAddToCalendarLink(event) {
  const start = event.start.dateTime || event.start.date;
  const end = event.end.dateTime || event.end.date;
  const title = encodeURIComponent(event.summary || 'Team 1912 Event');
  const details = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(event.location || '');

  const startFormatted = new Date(start).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const endFormatted = new Date(end).toISOString().replace(/[-:]|\.\d{3}/g, '');

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${location}&sf=true&output=xml`;
}

function cleanDescription(desc) {
  if (!desc) return '';
  return desc.replace(/powered by Google Calendar/i, '').trim();
}

function displayNextEvents() {
  const eventsToShow = allEvents.slice(eventsDisplayed, eventsDisplayed + EVENTS_PER_PAGE);
  eventsToShow.forEach(event => {
    const card = document.createElement('div');
    card.classList.add('event-card');

    const title = document.createElement('h3');
    title.textContent = event.summary || 'Untitled Event';

    const date = document.createElement('p');
    const start = event.start.dateTime || event.start.date;
    date.textContent = formatDate(start);

    const location = document.createElement('p');
    if (event.location) location.textContent = event.location;

    const description = document.createElement('p');
    if (event.description) description.textContent = cleanDescription(event.description);

    const addBtn = document.createElement('a');
    addBtn.href = createAddToCalendarLink(event);
    addBtn.textContent = 'Add to Calendar';
    addBtn.className = 'add-calendar-btn';
    addBtn.target = '_blank';
    addBtn.rel = 'noopener noreferrer';

    card.appendChild(title);
    card.appendChild(date);
    if (event.location) card.appendChild(location);
    if (event.description) card.appendChild(description);
    card.appendChild(addBtn);

    calendarEventsContainer.appendChild(card);
  });

  eventsDisplayed += EVENTS_PER_PAGE;

  if (eventsDisplayed >= allEvents.length) {
    loadMoreBtn.style.display = 'none';
    noMoreMsg.style.display = 'block';
  }
}

loadMoreBtn.addEventListener('click', displayNextEvents);
fetchCalendarEvents();
