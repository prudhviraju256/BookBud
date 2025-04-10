const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const searchResultsSection = document.getElementById('searchResultsSection');
const readList = document.getElementById('readList');
const recommendations = document.getElementById('recommendations');
const bookCardTemplate = document.getElementById('bookCardTemplate');

let readBooks = [];

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (query !== '') {
    const results = await fetchBooks(query);
    displaySearchResults(results);
  }
});

async function fetchBooks(query) {
  const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.docs.slice(0, 10); // Top 10 results
}

function displaySearchResults(books) {
  searchResults.innerHTML = '';
  searchResultsSection.style.display = 'block';

  books.forEach(book => {
    const card = createBookCard({
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
      cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover'
    });
    searchResults.appendChild(card);
  });
}

function createBookCard({ title, author, cover }) {
  const card = bookCardTemplate.content.cloneNode(true);
  card.querySelector('.book-title').textContent = title;
  card.querySelector('.book-author').textContent = author;
  card.querySelector('img').src = cover;

  const addButton = card.querySelector('.add-button');
  if (addButton) {
    addButton.addEventListener('click', () => {
      addToReadList({ title, author, cover });
    });
  }

  return card;
}

function addToReadList(book) {
  if (readBooks.some(b => b.title === book.title)) return;
  readBooks.push(book);
  renderReadList();
  generateRecommendations();
}

function renderReadList() {
  readList.innerHTML = '';
  readBooks.forEach(book => {
    const card = createBookCard(book);
    const addButton = card.querySelector('.add-button');
    if (addButton) addButton.remove();
    readList.appendChild(card);
  });
}

async function generateRecommendations() {
  recommendations.innerHTML = `<p>Loading recommendations...</p>`;
  
  if (readBooks.length === 0) {
    recommendations.innerHTML = `<p>No books read yet.</p>`;
    return;
  }

  // Use the title of the last read book to search for similar books
  const lastRead = readBooks[readBooks.length - 1];
  const recResponse = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(lastRead.title)}`);
  const recData = await recResponse.json();

  // Get first 5 recommendations
  const recBooks = recData.docs.slice(1, 6);

  recommendations.innerHTML = '';
  recBooks.forEach(book => {
    const card = createBookCard({
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown Author',
      cover: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : 'https://via.placeholder.com/150x200?text=No+Cover'
    });
    const addButton = card.querySelector('.add-button');
    if (addButton) addButton.remove();
    recommendations.appendChild(card);
  });
}

document.getElementById('clearSearchBtn').addEventListener('click', () => {
  searchInput.value = '';
  searchResults.innerHTML = '';
  searchResultsSection.style.display = 'none';
});
// --- Chatbox Logic ---
const chatboxForm = document.getElementById('chatboxForm');
const chatboxInput = document.getElementById('chatboxInput');
const chatboxMessages = document.getElementById('chatboxMessages');

chatboxForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = chatboxInput.value.trim();
  if (message === '') return;

  // Display user message
  const userMessage = document.createElement('div');
  userMessage.textContent = `You: ${message}`;
  chatboxMessages.appendChild(userMessage);

  // Scroll to bottom
  chatboxMessages.scrollTop = chatboxMessages.scrollHeight;

  // Clear input
  chatboxInput.value = '';

  // Simulate bot reply
  setTimeout(() => {
    const botMessage = document.createElement('div');
    botMessage.textContent = `Bot: You said "${message}"`;
    chatboxMessages.appendChild(botMessage);
    chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
  }, 500);
});
document.getElementById("chatToggleBtn").addEventListener("click", function () {
  window.location.href = "chat box.html";
});



