import {
    toggleFavorite,
    initTheme,
    openPopupFromURL,
    closePopup,
    openPopup,
    charactersData,
    loadCharacters,
    renderMoreCards,
    hideNoResults,
    handleEmptyResults
} from "./core.js";

let filteredCharacters = [];
let index = { value: 0 };
let sortOrder = "asc";
const batchSize = 6;

document.addEventListener("DOMContentLoaded", init);

async function init() {
    initTheme();
    await handleLoadCharacters();
    buildCategorySelect(charactersData);
    buildEras(charactersData);
    bindUI();
    handleRenderMoreCards();
    revealOnScroll();
    openPopupFromURL();
}

async function handleLoadCharacters() {
    const filtered = await loadCharacters();
    filteredCharacters = [...charactersData];
}

function handleRenderMoreCards() {
    renderMoreCards(filteredCharacters, index, batchSize, "cardContainer", {
        onToggleLoadMore: toggleLoadMore,
        onRevealOnScroll: revealOnScroll
    });
}

function getFilterValues() {
    const searchEl = document.getElementById('searchInput');
    const categoryEl = document.getElementById('categorySelect');
    const erasEl = document.getElementById('timelineEras');

    if (!searchEl || !categoryEl || !erasEl) {
        return null;
    }

    return {
        search: searchEl.value.toLowerCase().trim(),
        category: categoryEl.value,
        era: erasEl.value
    };
}

function matchesFilters(char, filters) {
    const matchText = 
        char.name.toLowerCase().includes(filters.search) ||
        char.title.toLowerCase().includes(filters.search);
    
    const matchEra = filters.era === 'allEras' || char.era.includes(filters.era);
    const matchCategory = filters.category === 'all' || char.categories.includes(filters.category);

    return matchText && matchEra && matchCategory;
}

function applyFilters() {
    const filters = getFilterValues();
    if (!filters) return;

    filteredCharacters = charactersData.filter(char => matchesFilters(char, filters));
    sortCharacters(filteredCharacters);
    
    if (filteredCharacters.length === 0) {
        handleEmptyResults();
    } else {
        hideNoResults();
        resetRender();
    }
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

function resetRender() {
    index.value = 0;
    document.getElementById("cardContainer").innerHTML = "";
    handleRenderMoreCards();
}

function toggleLoadMore(currentIndex, totalLength) {
    const btn = document.querySelector(".load-more-wrapper");
    if (btn) {
        btn.style.display = currentIndex >= totalLength ? "none" : "block";
    }
}

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

function buildEras (characters) {
    const selectEras = document.getElementById('timelineEras');
    const eras = new Set();

    characters.forEach(char => {
        if (char.era) {
            eras.add(char.era);
        }
    });

    [...eras].sort().forEach(era => {
        const option = document.createElement('option');
        option.value = era;
        option.textContent = era.toUpperCase();
        selectEras.appendChild(option);
    });
}

function bindUI() {
    document.getElementById("loadMore")?.addEventListener("click", handleRenderMoreCards);
    document.getElementById("categorySelect")?.addEventListener("change", applyFilters);
    document.getElementById("timelineEras")?.addEventListener("change", applyFilters);
    document.getElementById("searchInput")?.addEventListener("input", debounce(applyFilters));
    document.getElementById("closePopup").addEventListener("click", closePopup);
    window.addEventListener("scroll", revealOnScroll);

    document.addEventListener("click", e => {
        if (e.target.classList.contains("favorite-icon")) {
            const id = e.target.dataset.id;
            toggleFavorite(id);
            e.target.classList.toggle("bx-heart");
            e.target.classList.toggle("bxs-heart");
        }
    });

    document.addEventListener("click", (e) => {
        if (e.target.classList.contains("see-more-btn")) {
            const card = e.target.closest(".card");
            const colorClass = [...card.classList].find(c => c.startsWith("card-"));
            const id = e.target.dataset.id;
            openPopup(id, colorClass);
        }
    });

    const sortToggle = document.getElementById('sortToggle');

    sortToggle?.addEventListener('click', () => {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

        sortToggle.className = sortOrder === 'asc'
            ? 'bx bx-arrow-down-wide-narrow'
            : 'bx bx-arrow-up-narrow-wide';

        applyFilters();
    });
}

function debounce(fn, delay = 300) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}

function revealOnScroll() {
    document.querySelectorAll(".card").forEach(card => {
        if (card.getBoundingClientRect().top < window.innerHeight * 0.9) {
            card.classList.add("show");
        }
    });
}