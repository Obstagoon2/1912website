const calendarId = 'ninq39q6r61rid4mot3h1ues5u3cmrdr@import.calendar.google.com';
const apiKey = 'AIzaSyDFk7BVAYxUIngHdDOnVFD14XhnqdOSFDc';

const calendarEventsContainer = document.getElementById('calendar-events');
const loadMoreBtn = document.getElementById('load-more-btn');
const noMoreMsg = document.getElementById('no-more-msg');

const EVENTS_PER_PAGE = 6;
let allEvents = [];
let currentCount = 0;

function formatDateForDisplay(dateString) {
  const options = { 
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', hour12: true 
  };
  const date = new Date(dateString);
  return date.toLocaleString('en-US', options);
}

function formatDateForGoogleCalendar(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  // Format to YYYYMMDDTHHmmssZ, removing hyphens, colons, milliseconds
  return d.toISOString().replace(/[-:]|\.\d{3}/g, '');
}

function createAddToCalendarLink(event) {
  const start = event.start.dateTime || event.start.date;
  const end = event.end.dateTime || event.end.date;
  const title = encodeURIComponent(event.summary || 'Team 1912 Event');
  const details = encodeURIComponent(event.description || '');
  const location = encodeURIComponent(event.location || '');

  const startFormatted = formatDateForGoogleCalendar(start);
  const endFormatted = formatDateForGoogleCalendar(end);

  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startFormatted}/${endFormatted}&details=${details}&location=${location}&sf=true&output=xml`;
}

function cleanDescription(description) {
  if (!description) return '';
  return description.replace(/powered by Google Calendar/i, '').trim();
}

function createEventCard(event) {
  const card = document.createElement('div');
  card.classList.add('event-card');

  const title = document.createElement('h3');
  title.textContent = event.summary || 'Untitled Event';

  const date = document.createElement('p');
  date.textContent = formatDateForDisplay(event.start.dateTime || event.start.date);

  const location = document.createElement('p');
  location.textContent = event.location || '';

  const description = document.createElement('p');
  description.textContent = cleanDescription(event.description);

  const addBtn = document.createElement('a');
  addBtn.href = createAddToCalendarLink(event);
  addBtn.textContent = 'Add to Calendar';
  addBtn.classList.add('add-calendar-btn');
  addBtn.target = '_blank';
  addBtn.rel = 'noopener noreferrer';

  card.appendChild(title);
  card.appendChild(date);
  if (location.textContent) card.appendChild(location);
  if (description.textContent) card.appendChild(description);
  card.appendChild(addBtn);

  return card;
}

function renderEvents() {
  calendarEventsContainer.innerHTML = '';
  const eventsToShow = allEvents.slice(0, currentCount);
  eventsToShow.forEach(event => {
    calendarEventsContainer.appendChild(createEventCard(event));
  });
}

function updateNoMoreMessage() {
  if (currentCount >= allEvents.length) {
    noMoreMsg.style.display = 'block';
  } else {
    noMoreMsg.style.display = 'none';
  }
}

loadMoreBtn.addEventListener('click', () => {
  if (currentCount < allEvents.length) {
    currentCount = Math.min(currentCount + EVENTS_PER_PAGE, allEvents.length);
    renderEvents();
    updateNoMoreMessage();
  } else {
    updateNoMoreMessage();
  }
});

async function fetchCalendarEvents() {
  const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    allEvents = data.items || [];
    currentCount = Math.min(EVENTS_PER_PAGE, allEvents.length);
    renderEvents();
    updateNoMoreMessage();

    // Always show the button, even if no more events
    loadMoreBtn.style.display = 'inline-block';
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    calendarEventsContainer.innerHTML = '<p style="color:#ff6666;">Failed to load events.</p>';
    loadMoreBtn.style.display = 'none';
    noMoreMsg.style.display = 'none';
  }
}

fetchCalendarEvents();
