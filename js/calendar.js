const calendarId = 'ninq39q6r61rid4mot3h1ues5u3cmrdr@import.calendar.google.com';
const apiKey = 'AIzaSyDFk7BVAYxUIngHdDOnVFD14XhnqdOSFDc';

const calendarEventsContainer = document.getElementById('calendar-events');
const loadMoreBtn = document.getElementById('load-more-btn');
const noMoreMsg = document.getElementById('no-more-msg');

let allEvents = [];
let displayedCount = 0;
const EVENTS_PER_LOAD = 6;

async function fetchCalendarEvents() {
  try {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?key=${apiKey}&orderBy=startTime&singleEvents=true&timeMin=${new Date().toISOString()}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    allEvents = data.items || [];
    displayedCount = 0;
    calendarEventsContainer.innerHTML = '';
    noMoreMsg.style.display = 'none';
    loadMoreBtn.style.display = 'inline-block';
    loadMoreEvents();
  } catch (error) {
    console.error('Failed to fetch calendar events:', error);
    calendarEventsContainer.innerHTML = '<p style="color:#ff6666;">Failed to load events.</p>';
    loadMoreBtn.style.display = 'none';
    noMoreMsg.style.display = 'none';
  }
}

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

function cleanDescription(description) {
  if (!description) return '';
  return description.replace(/powered by Google Calendar/i, '').trim();
}

function renderEventCard(event) {
  const card = document.createElement('div');
  card.classList.add('event-card');

  const title = document.createElement('h3');
  title.textContent = event.summary || 'Untitled Event';

  const date = document.createElement('p');
  const start = event.start.dateTime || event.start.date;
  const startDate = new Date(start);
  const options = { 
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', 
    hour: '2-digit', minute: '2-digit', hour12: true 
  };
  date.textContent = startDate.toLocaleString('en-US', options);

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

function loadMoreEvents() {
  const nextBatch = allEvents.slice(displayedCount, displayedCount + EVENTS_PER_LOAD);
  nextBatch.forEach(event => {
    calendarEve
