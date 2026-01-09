import { loadCharacters, charactersData } from './core.js';
import { initTheme } from './core.js';

const mythologyText = `Greek mythology is a fascinating collection of stories, legends and myths that form the foundation of ancient Greek culture and religion. These immortal narratives describe the adventures and misadventures of gods, goddesses, heroes and fantastic creatures that inhabited a world where the divine and the mortal intertwined.

The Olympian gods, led by Zeus, ruled the cosmos from Mount Olympus, each with their own domains and powers. From Poseidon, lord of the seas, to Athena, goddess of wisdom, each deity personified fundamental aspects of nature and human experience.

Greek heroes, such as Hercules, Perseus and Theseus, faced epic challenges, terrible monsters and divine trials, demonstrating courage, intelligence and strength. Their journeys reflect the values and aspirations of ancient Greek society.

Mythological creatures, from Medusa to Cerberus, guardian of the underworld, add layers of mystery and danger to these timeless narratives. Each story carries moral lessons, explanations of natural phenomena and deep reflections on the human condition.

Greek mythology continues to inspire art, literature, cinema and popular culture to this day, demonstrating the enduring power of these narratives that transcend time and space.`;

function typewriterEffect(text, element, speed = 30, callback = null) {
    let index = 0;
    element.textContent = '';
    
    function type() {
        if (index < text.length) {
            const char = text[index];
            element.textContent += char;
            index++;
            
            const delay = (char === '.' || char === '!' || char === '?') ? speed * 3 : speed;
            setTimeout(type, delay);
        } else {
            if (callback) callback();
        }
    }
    
    type();
}

function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        
        container.appendChild(particle);
    }
}

function displayStats(characters) {
    const totalCharacters = characters.length;
    animateNumber('total-characters', totalCharacters, 1000);
    
    const eras = [...new Set(characters.map(c => c.era))];
    const totalEras = eras.length;
    animateNumber('total-eras', totalEras, 1000);
    
    const allCategories = characters.flatMap(c => c.categories || []);
    const uniqueCategories = [...new Set(allCategories)];
    const totalCategories = uniqueCategories.length;
    animateNumber('total-categories', totalCategories, 1000);
    
    const totalRank = characters.reduce((sum, c) => sum + (Number(c.rank) || 0), 0);
    const avgRating = (totalRank / totalCharacters).toFixed(1);
    animateNumber('avg-rating', avgRating, 1000, true);
    
    return { eras, uniqueCategories };
}

function animateNumber(elementId, target, duration, isDecimal = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = isDecimal ? target : Math.round(target);
            clearInterval(timer);
        } else {
            element.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
        }
    }, 16);
}

function displayErasTimeline(eras, characters) {
    const container = document.getElementById('eras-timeline');
    if (!container) return;
    
    eras.forEach((era, index) => {
        const count = characters.filter(c => c.era === era).length;
        const badge = document.createElement('div');
        badge.className = 'era-badge';
        badge.style.animationDelay = `${0.1 * index}s`;
        badge.innerHTML = `
            <span>${era}</span>
            <span class="era-count">${count}</span>
        `;
        container.appendChild(badge);
    });
}

function displayCategoriesGrid(categories, characters) {
    const container = document.getElementById('categories-grid');
    if (!container) return;
    
    const categoryCounts = {};
    characters.forEach(char => {
        (char.categories || []).forEach(cat => {
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });
    });
    
    const sortedCategories = categories.sort((a, b) => categoryCounts[b] - categoryCounts[a]);
    
    sortedCategories.forEach((category, index) => {
        const count = categoryCounts[category] || 0;
        const item = document.createElement('div');
        item.className = 'category-item';
        item.style.animationDelay = `${0.05 * index}s`;
        item.innerHTML = `
            <div class="category-name">${category}</div>
            <div class="category-count">${count}</div>
        `;
        
        const categoryClass = `badge-${category.toLowerCase()}`;
        item.style.borderColor = `var(--cat-${category.toLowerCase()}, var(--border))`;
        
        container.appendChild(item);
    });
}

async function initAboutPage() {
    initTheme();
    
    createParticles();
    
    const characters = await loadCharacters();
    
    if (characters.length === 0) {
        console.error('No characters loaded');
        return;
    }
    
    const typewriterElement = document.getElementById('typewriter-text');
    if (typewriterElement) {
        typewriterEffect(mythologyText, typewriterElement, 20, () => {
            const cursor = document.querySelector('.typewriter-cursor');
            if (cursor) {
                cursor.style.transition = 'opacity 0.5s ease';
                cursor.style.opacity = '0';
            }
        });
    }
    
    setTimeout(() => {
        const { eras, uniqueCategories } = displayStats(characters);
        displayErasTimeline(eras, characters);
        displayCategoriesGrid(uniqueCategories, characters);
    }, 1000);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAboutPage);
} else {
    initAboutPage();
}
