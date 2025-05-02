function toggleWorks(el) {
  const works = el.querySelector('.works');
  if (works) {
    works.style.display = works.style.display === 'block' ? 'none' : 'block';
  }
}

// Example: manually mark progress (in real app you'd store this in localStorage or DB)
const progressMap = {
  'a-the-theocratic-age': 10,
  'b-the-aristocratic-age': 5,
  'c-the-democratic-age': 2,
  'd-the-chaotic-age-a-canonical-prophecy': 0
};

window.onload = function () {
  for (const id in progressMap) {
    const bar = document.getElementById(id + '-bar');
    if (bar) {
      bar.style.width = progressMap[id] + '%';
    }
  }
};


// Track a book as read with timestamp
function markAsRead(title) {
  const now = new Date();
  const entry = {
    title: title,
    date: now.toISOString()
  };
  let log = JSON.parse(localStorage.getItem('readingLog') || '[]');
  log.unshift(entry);
  localStorage.setItem('readingLog', JSON.stringify(log));
  renderLog();
}

// Show log in sidebar
function renderLog() {
  const list = document.getElementById('reading-log');
  list.innerHTML = '';
  let log = JSON.parse(localStorage.getItem('readingLog') || '[]');
  log.forEach(entry => {
    const li = document.createElement('li');
    li.textContent = `${new Date(entry.date).toLocaleDateString()} — ${entry.title}`;
    li.onclick = () => window.open('reviews/' + entry.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.html', '_blank');
    list.appendChild(li);
  });
}

window.onload = function () {
  for (const id in progressMap) {
    const bar = document.getElementById(id + '-bar');
    if (bar) {
      bar.style.width = progressMap[id] + '%';
    }
  }
  renderLog();
};

// Update book links to support tracking
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.works li').forEach(el => {
    el.addEventListener('click', () => {
      markAsRead(el.textContent);
    });
  });
});
