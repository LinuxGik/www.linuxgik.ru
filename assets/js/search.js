document.addEventListener('DOMContentLoaded', function() {
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');

  searchToggle.addEventListener('click', () => {
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', async (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length < 2) {
      searchResults.innerHTML = '';
      return;
    }

    const response = await fetch('/search.json');
    const pages = await response.json();
    
    const results = pages.filter(page => 
      page.title.toLowerCase().includes(query)
    );

    searchResults.innerHTML = results.map(page => `
      <a href="${page.url}" class="search-result">
        <h3>${page.title}</h3>
      </a>
    `).join('');
  });

  // Закрытие поиска по клику вне области поиска
  searchOverlay.addEventListener('click', (e) => {
    if (e.target === searchOverlay) {
      searchOverlay.classList.remove('active');
    }
  });
}); 