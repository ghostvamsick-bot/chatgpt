const heroTitle = document.getElementById("hero-title");
const heroMeta = document.getElementById("hero-meta");
const heroDescription = document.getElementById("hero-description");
const heroTags = document.getElementById("hero-tags");
const heroImage = document.getElementById("hero-image");

const railNew = document.getElementById("rail-new");
const railTop = document.getElementById("rail-top");
const collectionsGrid = document.getElementById("collections-grid");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const searchResults = document.getElementById("search-results");

const createTag = (label) => {
  const span = document.createElement("span");
  span.className = "tag";
  span.textContent = label;
  return span;
};

const createCard = (item) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
    <div>
      <p class="rating">★ ${item.rating}</p>
      <h4>${item.title}</h4>
      <p>${item.year} · ${item.duration}</p>
    </div>
    <button class="secondary">Add to List</button>
  `;
  return card;
};

const renderHero = (spotlight) => {
  heroTitle.textContent = spotlight.title;
  heroMeta.textContent = `${spotlight.year} · ${spotlight.maturity} · ${spotlight.runtime}`;
  heroDescription.textContent = spotlight.description;
  heroTags.innerHTML = "";
  spotlight.tags.forEach((tag) => heroTags.appendChild(createTag(tag)));
  heroImage.src = spotlight.heroImage;
};

const renderRail = (container, items) => {
  container.innerHTML = "";
  items.forEach((item) => container.appendChild(createCard(item)));
};

const renderCollections = (collections) => {
  collectionsGrid.innerHTML = "";
  collections.forEach((collection) => {
    const wrapper = document.createElement("div");
    wrapper.className = "collection";
    wrapper.innerHTML = `
      <h3>${collection.title}</h3>
      <p>${collection.description}</p>
      <ul>
        ${collection.items.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    `;
    collectionsGrid.appendChild(wrapper);
  });
};

const renderSearchResults = (results) => {
  searchResults.innerHTML = "";
  if (!results.length) {
    const empty = document.createElement("span");
    empty.textContent = "No matches yet. Try a title like 'Atlas'.";
    searchResults.appendChild(empty);
    return;
  }
  results.forEach((item) => {
    const row = document.createElement("div");
    row.className = "card";
    row.innerHTML = `
      <h4>${item.title}</h4>
      <p>${item.year} · ${item.duration}</p>
    `;
    searchResults.appendChild(row);
  });
};

const fetchData = async () => {
  const [spotlightRes, genresRes, collectionsRes] = await Promise.all([
    fetch("/api/spotlight"),
    fetch("/api/genres"),
    fetch("/api/collections")
  ]);

  const spotlight = await spotlightRes.json();
  const genres = await genresRes.json();
  const collections = await collectionsRes.json();

  renderHero(spotlight);

  const newRelease = genres.find((genre) => genre.id === "new");
  const topRated = genres.find((genre) => genre.id === "top");

  if (newRelease) {
    renderRail(railNew, newRelease.items);
  }

  if (topRated) {
    renderRail(railTop, topRated.items);
  }

  renderCollections(collections);
};

const handleSearch = async () => {
  const query = searchInput.value.trim();
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  renderSearchResults(data.results);
};

searchButton.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleSearch();
  }
});

fetchData().catch(() => {
  heroDescription.textContent = "Unable to load spotlight details.";
});
