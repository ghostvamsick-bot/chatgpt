const heroSection = document.getElementById('hero');
const heroTitle = document.getElementById('hero-title');
const heroMeta = document.getElementById('hero-meta');
const heroDescription = document.getElementById('hero-description');
const heroTags = document.getElementById('hero-tags');
const trendingGrid = document.getElementById('trending-grid');
const categoriesSection = document.getElementById('categories');
const searchButton = document.getElementById('search-button');
const searchOverlay = document.getElementById('search-overlay');
const closeSearch = document.getElementById('close-search');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');

const fetchJson = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const setHero = (featured) => {
  heroSection.style.backgroundImage = `url(${featured.heroImage})`;
  heroTitle.textContent = featured.title;
  heroMeta.textContent = `${featured.year} • ${featured.rating} • ${featured.duration}`;
  heroDescription.textContent = featured.description;
  heroTags.innerHTML = '';
  featured.tags.forEach((tag) => {
    const span = document.createElement('span');
    span.textContent = tag;
    heroTags.appendChild(span);
  });
};

const renderTrending = (items) => {
  trendingGrid.innerHTML = '';
  items.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'card';

    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = item.title;

    const meta = document.createElement('div');
    meta.className = 'card-meta';
    meta.textContent = `${item.genre} • ${item.year} • ${item.duration}`;

    card.append(title, meta);
    trendingGrid.appendChild(card);
  });
};

const renderCategories = (categories) => {
  categoriesSection.innerHTML = '';
  categories.forEach((category) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'category';

    const name = document.createElement('div');
    name.className = 'category-name';
    name.textContent = category.name;

    const items = document.createElement('div');
    items.className = 'category-items';

    category.items.forEach((title) => {
      const tag = document.createElement('span');
      tag.textContent = title;
      items.appendChild(tag);
    });

    wrapper.append(name, items);
    categoriesSection.appendChild(wrapper);
  });
};

const openSearch = () => {
  searchOverlay.classList.add('active');
  searchOverlay.setAttribute('aria-hidden', 'false');
  searchInput.focus();
};

const closeSearchPanel = () => {
  searchOverlay.classList.remove('active');
  searchOverlay.setAttribute('aria-hidden', 'true');
  searchInput.value = '';
  searchResults.innerHTML = '';
};

const renderSearchResults = (results) => {
  searchResults.innerHTML = '';
  if (!results.length) {
    const empty = document.createElement('li');
    empty.textContent = 'No matches found.';
    searchResults.appendChild(empty);
    return;
  }

  results.forEach((title) => {
    const item = document.createElement('li');
    item.textContent = title;
    searchResults.appendChild(item);
  });
};

const loadPage = async () => {
  const [featured, trending, categories] = await Promise.all([
    fetchJson('/api/featured'),
    fetchJson('/api/trending'),
    fetchJson('/api/categories')
  ]);

  setHero(featured);
  renderTrending(trending);
  renderCategories(categories);
};

searchButton.addEventListener('click', openSearch);
closeSearch.addEventListener('click', closeSearchPanel);
searchOverlay.addEventListener('click', (event) => {
  if (event.target === searchOverlay) {
    closeSearchPanel();
  }
});

searchInput.addEventListener('input', async (event) => {
  const query = event.target.value.trim();
  if (!query) {
    searchResults.innerHTML = '';
    return;
  }

  const data = await fetchJson(`/api/search?q=${encodeURIComponent(query)}`);
  renderSearchResults(data.results);
});

loadPage();
