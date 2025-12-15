const paletteClasses = [
    "card-tea",
    "card-forest",
    "card-peach",
    "card-blue",
    "card-bubble",
    "card-earth",
    "card-grape",
    "card-lilacs",
    "card-butter",
    "card-iced",
    "card-orange",
    "card-olive"
];

const apiURL = "./data/greek_characters.json";

let sortOrder = 'asc';
let charactersData = [];
let filteredCharacters = [];
let currentIndex = 0;
const batchSize = 6;

document.addEventListener("DOMContentLoaded", () => {
    loadCharacters();
    document.getElementById("loadMore").addEventListener("click", renderMoreCards);
});

async function loadCharacters() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        charactersData = data.characters.filter(c => c.name && c.rank);
        filteredCharacters = [...charactersData];

        buildCategorySelect(charactersData);
        toggleNoResultsMessage(filteredCharacters.length);
        openPopupFromURL();
        renderMoreCards();
        revealOnScroll();
    } catch (error) {
        console.error("JSON Error:", error);
    }
}

function renderMoreCards() {
    const container = document.getElementById("cardContainer");

    const nextItems = filteredCharacters.slice(
        currentIndex,
        currentIndex + batchSize
    );

    nextItems.forEach((character, index) => {
        const paletteClass =
            paletteClasses[(currentIndex + index) % paletteClasses.length];

        container.appendChild(createCard(character, paletteClass));
    });

    currentIndex += batchSize;

    revealOnScroll();

    if (currentIndex >= filteredCharacters.length) {
        document.querySelector(".load-more-wrapper").style.display = "none";
    }
}

function createCard(character, colorClass) {
    const card = document.createElement("div");
    card.className = `card ${colorClass}`;

    card.innerHTML = `
    <h2 class="card-name">${character.name}</h2>
    <span class="card-title">${character.title}</span>

    <div class="img-box">
        <img src="${character.image || ''}" alt="${character.name}">
    </div>

    <div class="card-meta">
        <div class="card-categories">
            ${character.categories.map(cat => `
                <span class="badge badge-${cat.toLowerCase()}">${cat}</span>
            `).join('')}
        </div>

        <div class="stars">
            ${generateStars(character.rank)}
        </div>
    </div>

    <button class="btn see-more-btn" data-id="${character.id}">
        SEE MORE
    </button>
`;

    return card;
}

function generateStars(rank) {
    const rating = Number(rank) || 0; 
    const full = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    return full + empty;
}

document.addEventListener("click", (e) => {
    if (e.target.classList.contains("see-more-btn")) {
        const card = e.target.closest(".card");
        const colorClass = [...card.classList].find(c => c.startsWith("card-"));
        const id = e.target.dataset.id;
        openPopup(id, colorClass);
    }
});

document.getElementById("closePopup").addEventListener("click", closePopup);
function openPopup(id, colorClass, skipPush = false) {
    const character = charactersData.find(c => c.id === id);
    if (!character) return;

    document.getElementById("popupName").textContent = character.name;
    document.getElementById("popupTitle").textContent = character.title;
    document.getElementById("popupDescription").textContent = character.description;
    document.getElementById("popupDomain").textContent = "Domain: " + character.domain;
    document.getElementById("popupSymbol").textContent = "Symbol: " + character.symbol;
    document.getElementById("popupStars").innerHTML = generateStars(character.rank);
    document.getElementById("popupImage").src = character.image;

    const overlay = document.getElementById("popupOverlay");
    overlay.setAttribute("data-color", colorClass);
    overlay.style.display = "flex";

    if (!skipPush) {
        const url = new URL(window.location);
        url.searchParams.set("character", id);
        window.history.pushState({}, "", url);
    }
}

function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";

    const url = new URL(window.location);
    url.searchParams.delete("character");
    window.history.pushState({}, "", url);
}

function openPopupFromURL() {
    const params = new URLSearchParams(window.location.search);
    const characterId = params.get("character");
    if (!characterId) return;

    const index = charactersData.findIndex(c => c.id === characterId);

    if (index === -1) {
        handleInvalidCharacterParam();
        return;
    }

    const colorClass = paletteClasses[index % paletteClasses.length];
    openPopup(characterId, colorClass, true);
}

function handleInvalidCharacterParam() {
    const url = new URL(window.location);
    url.searchParams.delete('character');
    window.history.replaceState({}, "", url);

    const container = document.getElementById('cardContainer');
    container.style.display = 'none';
    
    document.querySelector('.load-more-wrapper').style.display = 'none';

    const msg = document.getElementById('noResults');
    msg.textContent = 'Character not found';
    msg.style.display = 'block';
}

function revealOnScroll() {
    const cards = document.querySelectorAll('.card');
    const vh = window.innerHeight;

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        if (rect.top < vh * 0.9) {
        card.classList.add('show');
        }
    });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('load', revealOnScroll);

const routes = ['/', '/characters', '/about'];

function validateRoute() {
    const hash = window.location.hash.replace('#', '') || '/';

    if (!routes.includes(hash)) {
        window.location.href = '404.html';
    }
}

window.addEventListener('load', validateRoute);
window.addEventListener('hashchange', validateRoute);

function buildCategorySelect(characters) {
    const select = document.getElementById('categorySelect');
    const categories = new Set();

    characters.forEach(char => {
        char.categories.forEach(cat => categories.add(cat));
    });

    [...categories].sort().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.toUpperCase();
        select.appendChild(option);
    });
}

function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

document.getElementById('categorySelect').addEventListener('change', applyFilters);
searchInput.addEventListener('input', debounce(applyFilters, 300));

function applyFilters() {
    const searchValue = document
        .getElementById('searchInput')
        .value
        .toLowerCase()
        .trim();

    const selectedCategory =
        document.getElementById('categorySelect').value;

    filteredCharacters = charactersData.filter(char => {
        const matchText =
            char.name.toLowerCase().includes(searchValue) ||
            char.title.toLowerCase().includes(searchValue);

        const matchCategory =
            selectedCategory === 'all' ||
            char.categories.includes(selectedCategory);

        return matchText && matchCategory;
    });

    sortCharacters(filteredCharacters);
    currentIndex = 0;
    document.getElementById('cardContainer').innerHTML = '';
    document.querySelector('.load-more-wrapper').style.display = 'block';

    toggleNoResultsMessage(filteredCharacters.length);

    renderMoreCards();
}

function toggleNoResultsMessage(hasResults) {
    const msg = document.getElementById('noResults');
    msg.style.display = hasResults ? 'none' : 'block';
}

function sortCharacters(list) {
    return list.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();

        if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1;
        if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });
}

const sortToggle = document.getElementById('sortToggle');

sortToggle.addEventListener('click', () => {
    sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    sortToggle.className = sortOrder === 'asc'
        ? 'bx bx-arrow-down-wide-narrow'
        : 'bx bx-arrow-up-narrow-wide';

    applyFilters();
});



