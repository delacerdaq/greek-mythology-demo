export const paletteClasses = [
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

export let charactersData = [];
export const apiURL = "./data/greek_characters.json";
export const FAVORITES_KEY = "favoriteCharacters";
const THEME_KEY = "theme";

export function generateStars(rank) {
    const rating = Number(rank) || 0; 
    const full = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    return full + empty;
}

export function getFavorites() {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
}

export function saveFavorites(list) {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(list));
}

export function isFavorite(id) {
    return getFavorites().includes(id);
}

export function toggleFavorite(id) {
    let favorites = getFavorites();

    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
    } else {
        favorites.push(id);
    }

    saveFavorites(favorites);
}

export function openPopupFromURL() {
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

export function openPopup(id, colorClass, skipPush = false) {
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

export function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";

    const url = new URL(window.location);
    url.searchParams.delete("character");
    window.history.pushState({}, "", url);
}

function handleInvalidCharacterParam() {
    const url = new URL(window.location);
    url.searchParams.delete('character');
    window.history.replaceState({}, "", url);

    const container = document.getElementById('cardContainer');
    if (container) {
        container.style.display = 'none';
    }

    const loadMoreBtn = document.querySelector(".load-more-wrapper");
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }

    showNoResults('Character not found');
}

export function initTheme() {
    const themeToggle = document.querySelector(".theme-color i");
    if (!themeToggle) return;

    const body = document.body;
    const savedTheme = localStorage.getItem(THEME_KEY);

    function setTheme(isDark) {
        if (isDark) {
            body.classList.add("dark");
            themeToggle.classList.remove("bx-toggle-left");
            themeToggle.classList.add("bx-toggle-right");
        } else {
            body.classList.remove("dark");
            themeToggle.classList.remove("bx-toggle-right");
            themeToggle.classList.add("bx-toggle-left");
        }
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    }

    setTheme(savedTheme === "dark");

    themeToggle.addEventListener("click", () => {
        const isDark = !body.classList.contains("dark");
        setTheme(isDark);
    });
}

export function showNoResults(message = null) {
    const noResults = document.getElementById("noResults");
    if (noResults) {
        if (message) {
            noResults.textContent = message;
        }
        noResults.style.display = "block";
    }
}

export function hideNoResults() {
    const noResults = document.getElementById("noResults");
    if (noResults) {
        noResults.style.display = "none";
    }
}

export function clearCardContainer(containerId = "cardContainer") {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = "";
    }
}

export function hideLoadMoreButton() {
    const loadMoreBtn = document.querySelector(".load-more-wrapper");
    if (loadMoreBtn) {
        loadMoreBtn.style.display = "none";
    }
}

export function handleEmptyResults(message = null) {
    showNoResults(message);
    clearCardContainer();
    hideLoadMoreButton();
}

export async function loadCharacters() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();

        const filtered = data.characters.filter(c => c.name && c.rank);
        charactersData.length = 0;
        charactersData.push(...filtered);
        return filtered;
    } catch (error) {
        console.error("JSON Error:", error);
        return [];
    }
}

export function createCard(character, colorClass) {
    const card = document.createElement("div");
    const favClass = isFavorite(character.id) ? 'bxs-heart' : 'bx-heart';
    card.className = `card ${colorClass}`;

    card.innerHTML = `
    <div class="card-header">
        <div class="heartEra-section">
            <i class='bx ${favClass} favorite-icon' data-id="${character.id}"></i>

            <span>
                ${character.era}
            </span>
        </div>
        
        <div class="card-name-container">
            <h2 class="card-name">${character.name}</h2>
            <span class="card-title">${character.title}</span>
        </div>
    </div>
    
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

export function renderMoreCards(characters, indexRef, batchSize = 6, containerId = "cardContainer", callbacks = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const currentIndex = typeof indexRef === 'object' ? indexRef.value : indexRef;
    const slice = characters.slice(currentIndex, currentIndex + batchSize);

    slice.forEach((char, i) => {
        const color = paletteClasses[(currentIndex + i) % paletteClasses.length];
        container.appendChild(createCard(char, color));
    });

    const newIndex = currentIndex + batchSize;
    if (typeof indexRef === 'object') {
        indexRef.value = newIndex;
    }

    if (callbacks.onToggleLoadMore) {
        callbacks.onToggleLoadMore(newIndex, characters.length);
    }

    if (callbacks.onRevealOnScroll) {
        callbacks.onRevealOnScroll();
    }
}
