// ========== MUSIC REVIEWS DATA ==========
let currentReviews = [];
let currentSort = 'rating';
let currentGenreFilter = 'all';
let currentSearchTerm = '';

// Default reviews
const defaultReviews = [
    {
        id: 1,
        title: "The Dark Side of the Moon",
        artist: "Pink Floyd",
        genre: "Rock",
        rating: 9.8,
        review: "A masterpiece of progressive rock that explores themes of conflict, greed, and mental illness.",
        shortPreview: "A flawless masterpiece that redefined what an album could be...",
        year: 1973,
        dateAdded: "2024-01-15",
        coverColor: "#1a1a2e",
        albumArt: null,
        embedType: null,
        embedUrl: null,
        tracks: []
    },
    {
        id: 2,
        title: "To Pimp a Butterfly",
        artist: "Kendrick Lamar",
        genre: "Hip Hop",
        rating: 9.6,
        review: "A genre-defying masterpiece that blends jazz, funk, and hip-hop.",
        shortPreview: "A stunning fusion of jazz, funk, and conscious hip-hop...",
        year: 2015,
        dateAdded: "2024-01-20",
        coverColor: "#2d5016",
        albumArt: null,
        embedType: null,
        embedUrl: null,
        tracks: []
    },
    {
        id: 3,
        title: "Random Access Memories",
        artist: "Daft Punk",
        genre: "Electronic",
        rating: 9.2,
        review: "A love letter to the late 70s and early 80s music scene.",
        shortPreview: "Daft Punk's magnum opus is a celebration of analog sound...",
        year: 2013,
        dateAdded: "2024-01-10",
        coverColor: "#c0c0c0",
        albumArt: null,
        embedType: null,
        embedUrl: null,
        tracks: []
    }
];

// Load reviews from localStorage
function loadStoredReviews() {
    const stored = localStorage.getItem('musicReviews');
    if (stored) {
        currentReviews = JSON.parse(stored);
    } else {
        currentReviews = defaultReviews;
        localStorage.setItem('musicReviews', JSON.stringify(currentReviews));
    }
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderStars(rating) {
    const fullStars = Math.floor(rating / 2);
    const decimal = rating / 2 - fullStars;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<span style="color: #ffd700;">★</span>';
    }
    if (decimal >= 0.5) {
        starsHTML += '<span style="color: #ffd700;">½</span>';
    }
    const emptyStars = 5 - Math.ceil(rating / 2);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<span style="color: var(--text-muted);">☆</span>';
    }
    return starsHTML;
}

// Filter and search function
function getFilteredAndSearchedReviews() {
    let filtered = [...currentReviews];
    
    // Apply genre filter
    if (currentGenreFilter !== 'all') {
        filtered = filtered.filter(review => review.genre === currentGenreFilter);
    }
    
    // Apply search term
    if (currentSearchTerm !== '') {
        const searchLower = currentSearchTerm.toLowerCase();
        filtered = filtered.filter(review => {
            if (review.title.toLowerCase().includes(searchLower)) return true;
            if (review.artist.toLowerCase().includes(searchLower)) return true;
            if (review.tracks && review.tracks.length > 0) {
                return review.tracks.some(track => track.name.toLowerCase().includes(searchLower));
            }
            return false;
        });
    }
    
    return filtered;
}

// Sort function
function getSortedReviews() {
    const filtered = getFilteredAndSearchedReviews();
    const sorted = [...filtered];
    
    switch(currentSort) {
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        case 'artist':
            return sorted.sort((a, b) => a.artist.localeCompare(b.artist));
        case 'title':
            return sorted.sort((a, b) => a.title.localeCompare(b.title));
        default:
            return sorted.sort((a, b) => b.rating - a.rating);
    }
}

// Update results count
function updateResultsCount() {
    const filtered = getFilteredAndSearchedReviews();
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = filtered.length;
    }
}

// Display reviews
function displayReviews() {
    const grid = document.getElementById('reviewsGrid');
    if (!grid) return;
    
    const sortedReviews = getSortedReviews();
    updateResultsCount();
    
    if (sortedReviews.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 3rem;">No reviews found. Try a different search!</p>';
        return;
    }
    
    grid.innerHTML = sortedReviews.map(review => `
        <div style="display: flex; background: var(--card-bg); border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid var(--border-color); min-height: 130px;">
            <!-- ALBUM ART - LEFT SIDE, CENTERED VERTICALLY -->
            <div style="width: 100px; display: flex; align-items: center; justify-content: center; padding: 12px;">
                ${review.albumArt ? 
                    `<img src="${review.albumArt}" alt="${review.title}" style="width: 76px; height: 76px; object-fit: cover; border-radius: 8px;">` : 
                    `<div style="width: 76px; height: 76px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, #ff1493, #ffd700); border-radius: 8px; font-size: 1.8rem;">🎵</div>`
                }
            </div>
            
            <!-- CONTENT - RIGHT SIDE, TOP ALIGNED -->
            <div style="flex: 1; padding: 10px 12px 10px 0; display: flex; flex-direction: column;">
                <!-- TOP SECTION: Title, Artist, Rating -->
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="flex: 1; min-width: 0;">
                        <span style="background: var(--bg-secondary); color: #ff1493; padding: 2px 8px; border-radius: 20px; font-size: 10px;">${escapeHtml(review.genre)}</span>
                        <h3 style="margin: 4px 0 2px 0; font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(review.title)}</h3>
                        <p style="color: #ff1493; font-weight: 500; margin: 0; font-size: 12px; cursor: pointer; display: inline-block;" onclick="filterByArtist('${escapeHtml(review.artist)}')">${escapeHtml(review.artist)}</p>
                        <p style="color: var(--text-muted); font-size: 10px; margin: 2px 0 0 0;">${review.year || 'N/A'}</p>
                    </div>
                    <div style="text-align: right; margin-left: 10px;">
                        <div style="display: flex; align-items: baseline; gap: 2px; justify-content: flex-end;">
                            <span style="font-size: 16px; font-weight: bold; color: #ffd700;">${review.rating.toFixed(1)}</span>
                            <span style="color: var(--text-muted); font-size: 10px;">/10</span>
                        </div>
                        <div style="font-size: 10px; white-space: nowrap;">${renderStars(review.rating)}</div>
                    </div>
                </div>
                
                <!-- REVIEW PREVIEW - Fixed spacing -->
                <div style="margin-top: 8px;">
                    <p style="color: var(--text-secondary); font-size: 11px; line-height: 1.4; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${escapeHtml(review.shortPreview || review.review.substring(0, 80))}...</p>
                </div>
                
                <!-- BOTTOM SECTION - Tracks and Read Review Button -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px;">
                    ${review.tracks && review.tracks.length > 0 ? 
                        `<span style="font-size: 10px; color: var(--text-muted);">🎵 ${review.tracks.length} tracks reviewed</span>` : 
                        `<span></span>`
                    }
                    <a href="review.html?id=${review.id}" style="color: #ff1493; text-decoration: none; font-weight: 600; font-size: 11px; padding: 4px 0;">Read full review →</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter by artist
function filterByArtist(artistName) {
    currentSearchTerm = artistName;
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = artistName;
    }
    currentGenreFilter = 'all';
    const genreSelect = document.getElementById('genreFilter');
    if (genreSelect) {
        genreSelect.value = 'all';
    }
    displayReviews();
}

// Display featured review
function displayFeaturedReview() {
    const featuredDiv = document.getElementById('featuredReview');
    if (!featuredDiv || currentReviews.length === 0) return;
    
    const topReview = [...currentReviews].sort((a, b) => b.rating - a.rating)[0];
    
    featuredDiv.innerHTML = `
        <div class="featured-image" style="background: ${topReview.coverColor || '#ff1493'}">
            <div class="featured-icon">🎵</div>
        </div>
        <div class="featured-content">
            <span class="featured-badge">EDITOR'S PICK</span>
            <p class="featured-artist">${escapeHtml(topReview.artist)} • ${topReview.year || 'N/A'}</p>
            <h2 class="featured-title">${escapeHtml(topReview.title)}</h2>
            <div class="featured-rating">
                <span class="featured-rating-number">${topReview.rating}</span>
                <span>/10</span>
            </div>
            <p class="featured-review">${escapeHtml(topReview.review.substring(0, 200))}...</p>
            <a href="review.html?id=${topReview.id}" style="color: #ff1493; font-weight: 600; text-decoration: none;">Read full review →</a>
        </div>
    `;
}

// Setup search
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchTerm = e.target.value;
            displayReviews();
        });
    }
    
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            currentSearchTerm = '';
            currentGenreFilter = 'all';
            const genreSelect = document.getElementById('genreFilter');
            if (genreSelect) genreSelect.value = 'all';
            displayReviews();
        });
    }
}

// Setup genre filter
function setupGenreFilter() {
    const genreSelect = document.getElementById('genreFilter');
    if (genreSelect) {
        genreSelect.addEventListener('change', (e) => {
            currentGenreFilter = e.target.value;
            displayReviews();
        });
    }
}

// Setup sort buttons
function setupSortButtons() {
    const sortBtns = document.querySelectorAll('.sort-btn');
    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentSort = btn.getAttribute('data-sort');
            displayReviews();
        });
    });
}

// Dark mode
function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
        const toggleIcon = document.querySelector('.toggle-icon');
        if (toggleIcon) toggleIcon.textContent = '☀️';
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    const toggleIcon = document.querySelector('.toggle-icon');
    if (toggleIcon) {
        toggleIcon.textContent = isDarkMode ? '☀️' : '🌙';
    }
}

// Listen for admin updates
window.addEventListener('storage', function(e) {
    if (e.key === 'reviewsUpdated') {
        loadStoredReviews();
        displayReviews();
        displayFeaturedReview();
    }
});

// Make filterByArtist available globally
window.filterByArtist = filterByArtist;

// Initialize
function init() {
    loadStoredReviews();
    displayReviews();
    displayFeaturedReview();
    setupSortButtons();
    setupGenreFilter();
    setupSearch();
    initDarkMode();
    
    const darkModeBtn = document.getElementById('darkModeBtn');
    if (darkModeBtn) {
        darkModeBtn.addEventListener('click', toggleDarkMode);
    }
}

document.addEventListener('DOMContentLoaded', init);

