import {
    getFavorites,
    isFavorite,
    toggleFavorite,
    initTheme,
    openPopupFromURL,
    closePopup,
    openPopup,
    charactersData,
    loadCharacters,
    renderMoreCards,
    showNoResults,
    hideNoResults
} from "./core.js";

document.addEventListener("DOMContentLoaded", initFavorites);

let favoriteCharacters = [];
let index = { value: 0 };
const batchSize = 6;

async function initFavorites() {
    initTheme();
    await loadCharacters();
    openPopupFromURL();

    const favoritesIds = getFavorites();
    favoriteCharacters = charactersData.filter(c => favoritesIds.includes(c.id));

    if (favoriteCharacters.length === 0) {
        showNoResults();
    } else {
        hideNoResults();
        renderFavoriteCards();
        bindFavoritesUI();
    }
}

function renderFavoriteCards() {
    renderMoreCards(favoriteCharacters, index, batchSize, "cardContainer", {
        onRevealOnScroll: revealOnScroll
    });
}

function revealOnScroll() {
    document.querySelectorAll(".card").forEach(card => {
        if (card.getBoundingClientRect().top < window.innerHeight * 0.9) {
            card.classList.add("show");
        }
    });
}

function bindFavoritesUI() {
    document.getElementById("closePopup")?.addEventListener("click", closePopup);
    window.addEventListener("scroll", revealOnScroll);

    document.addEventListener("click", e => {
        if (e.target.classList.contains("favorite-icon")) {
            const id = e.target.dataset.id;
            toggleFavorite(id);
            e.target.classList.toggle("bx-heart");
            e.target.classList.toggle("bxs-heart");
            
            if (!isFavorite(id)) {
                const card = e.target.closest(".card");
                if (card) {
                    card.remove();
                    favoriteCharacters = favoriteCharacters.filter(c => c.id !== id);
                    
                    if (favoriteCharacters.length === 0) {
                        showNoResults();
                    }
                }
            }
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
}
