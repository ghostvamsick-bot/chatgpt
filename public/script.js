const hero = document.getElementById("hero");
const heroTitle = document.getElementById("heroTitle");
const heroSummary = document.getElementById("heroSummary");
const heroMeta = document.getElementById("heroMeta");
const trendingRow = document.getElementById("trendingRow");
const originalsRow = document.getElementById("originalsRow");
const resultsGrid = document.getElementById("resultsGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const renderCard = (item) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <h3>${item.title}</h3>
    <span>${item.genre}</span>
    <span>${item.year} • ${item.rating}</span>
  `;
  return card;
};

const renderResult = (item) => {
  const card = document.createElement("div");
  card.className = "result-card";
  card.innerHTML = `
    <h3>${item.title}</h3>
    <span>${item.genre}</span>
    <span>${item.year} • ${item.rating}</span>
  `;
  return card;
};

const updateHero = (item) => {
  hero.style.backgroundImage = `url('${item.heroImage}')`;
  heroTitle.textContent = item.title;
  heroSummary.textContent = item.summary;
  heroMeta.innerHTML = `
    <span>${item.year}</span>
    <span>${item.runtime}</span>
    <span>${item.genre}</span>
    <span>${item.rating}</span>
  `;
};

const loadCatalog = async () => {
  const response = await fetch("/api/catalog");
  const catalog = await response.json();

  updateHero(catalog.featured[0]);

  catalog.trending.forEach((item) => {
    trendingRow.appendChild(renderCard(item));
  });

  catalog.originals.forEach((item) => {
    originalsRow.appendChild(renderCard(item));
  });
};

const renderResults = (results) => {
  resultsGrid.innerHTML = "";
  if (!results.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No matches yet. Try another search.";
    resultsGrid.appendChild(empty);
    return;
  }

  results.forEach((item) => resultsGrid.appendChild(renderResult(item)));
};

const runSearch = async () => {
  const query = searchInput.value.trim();
  if (!query) {
    renderResults([]);
    return;
  }

  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const data = await response.json();
  renderResults(data.results);
};

searchButton.addEventListener("click", runSearch);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runSearch();
  }
});

loadCatalog();
