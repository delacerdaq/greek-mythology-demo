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

let charactersData = [];
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

        charactersData = data.characters
            .filter(char => char.name && char.rank)
            .slice(0, 60);

        renderMoreCards();
        revealOnScroll();
    } catch (error) {
        console.error("JSON Error:", error);
    }
}

function renderMoreCards() {
    const container = document.getElementById("cardContainer");

    const end = currentIndex + batchSize;
    const nextSet = charactersData.slice(currentIndex, end);

    nextSet.forEach((character, index) => {
        const paletteClass = paletteClasses[(currentIndex + index) % paletteClasses.length];

        const card = createCard(character, paletteClass);
        container.appendChild(card);
    });

    currentIndex = end;

    if (currentIndex >= charactersData.length) {
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
function openPopup(id, colorClass) {
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
}

function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
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

