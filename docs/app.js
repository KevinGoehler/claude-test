/**
 * Watchlist - Movie Tracker App
 * A modern movie tracking application
 */

// ========================================
// State Management
// ========================================

const STORAGE_KEYS = {
    LISTS: 'watchlist_lists',
    SETTINGS: 'watchlist_settings'
};

const state = {
    movies: [],
    lists: [],
    currentPage: 'home',
    currentMovie: null,
    currentList: null,
    searchQuery: '',
    isLoading: true
};

// ========================================
// DOM Elements
// ========================================

const elements = {
    // Pages
    pages: document.querySelectorAll('.page'),
    pageHome: document.getElementById('page-home'),
    pageLists: document.getElementById('page-lists'),
    pageProfile: document.getElementById('page-profile'),
    pageSettings: document.getElementById('page-settings'),

    // Navigation
    navItems: document.querySelectorAll('.nav-item'),

    // Home
    searchInput: document.getElementById('search-input'),
    clearSearch: document.getElementById('clear-search'),
    movieGrid: document.getElementById('movie-grid'),
    homeContent: document.getElementById('home-content'),

    // Lists
    listsContainer: document.getElementById('lists-container'),
    createListBtn: document.getElementById('create-list-btn'),

    // Profile Stats
    statTotal: document.getElementById('stat-total'),
    statWatched: document.getElementById('stat-watched'),
    statLists: document.getElementById('stat-lists'),

    // Settings
    exportData: document.getElementById('export-data'),
    clearData: document.getElementById('clear-data'),

    // Movie Modal
    movieModal: document.getElementById('movie-modal'),
    movieModalBackdrop: document.getElementById('modal-backdrop'),
    movieModalClose: document.getElementById('modal-close'),
    movieModalBody: document.getElementById('modal-body'),

    // List Modal
    listModal: document.getElementById('list-modal'),
    listModalBackdrop: document.getElementById('list-modal-backdrop'),
    listModalClose: document.getElementById('list-modal-close'),
    listModalBody: document.getElementById('list-modal-body'),

    // Create List Modal
    createListModal: document.getElementById('create-list-modal'),
    createListBackdrop: document.getElementById('create-list-backdrop'),
    createListClose: document.getElementById('create-list-close'),
    createListForm: document.getElementById('create-list-form'),
    listNameInput: document.getElementById('list-name')
};

// ========================================
// API Functions
// ========================================

async function fetchMovies() {
    try {
        const response = await fetch('data/movies.json');
        const data = await response.json();
        return data.movies;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

// ========================================
// Storage Functions
// ========================================

function loadLists() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.LISTS);
        return stored ? JSON.parse(stored) : getDefaultLists();
    } catch (error) {
        console.error('Error loading lists:', error);
        return getDefaultLists();
    }
}

function saveLists() {
    try {
        localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(state.lists));
    } catch (error) {
        console.error('Error saving lists:', error);
    }
}

function getDefaultLists() {
    return [
        { id: 'watchlist', name: 'Watch Later', movies: [], isDefault: true },
        { id: 'watched', name: 'Watched', movies: [], isDefault: true }
    ];
}

// ========================================
// Utility Functions
// ========================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========================================
// Render Functions
// ========================================

function renderMovieGrid(movies) {
    if (movies.length === 0) {
        elements.movieGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
                <h3 class="empty-state-title">No movies found</h3>
                <p class="empty-state-text">Try a different search term</p>
            </div>
        `;
        return;
    }

    elements.movieGrid.innerHTML = movies.map(movie => `
        <article class="movie-card" data-movie-id="${movie.id}" tabindex="0" role="button" aria-label="View details for ${escapeHtml(movie.title)}">
            <div class="movie-poster">
                <img src="${movie.poster}" alt="${escapeHtml(movie.title)} poster" loading="lazy">
                <div class="movie-rating-badge">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>${movie.imdbRating}</span>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title-card">${escapeHtml(movie.title)}</h3>
                <p class="movie-year">${movie.year}</p>
            </div>
        </article>
    `).join('');

    // Add click handlers
    elements.movieGrid.querySelectorAll('.movie-card').forEach(card => {
        card.addEventListener('click', () => {
            const movieId = parseInt(card.dataset.movieId);
            openMovieModal(movieId);
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const movieId = parseInt(card.dataset.movieId);
                openMovieModal(movieId);
            }
        });
    });
}

function renderMovieModal(movie) {
    elements.movieModalBody.innerHTML = `
        <div class="movie-detail">
            <div class="movie-detail-header">
                <div class="movie-detail-poster">
                    <img src="${movie.poster}" alt="${escapeHtml(movie.title)} poster">
                </div>
                <div class="movie-detail-info">
                    <h2 id="modal-title" class="movie-detail-title">${escapeHtml(movie.title)}</h2>
                    <div class="movie-detail-meta">
                        <span>${movie.year}</span>
                        <span>${movie.runtime}</span>
                        <span class="movie-detail-badge">${movie.contentRating}</span>
                        <span class="movie-detail-badge rating">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            ${movie.imdbRating}
                        </span>
                    </div>
                </div>
            </div>

            <p class="movie-detail-description">${escapeHtml(movie.description)}</p>

            <div class="movie-detail-section">
                <h3 class="movie-detail-section-title">Director</h3>
                <p style="color: var(--color-text-secondary);">${escapeHtml(movie.director)}</p>
            </div>

            <div class="movie-detail-section">
                <h3 class="movie-detail-section-title">Genres</h3>
                <div class="movie-genres">
                    ${movie.genre.map(g => `<span class="genre-tag">${escapeHtml(g)}</span>`).join('')}
                </div>
            </div>

            <button type="button" class="btn btn-primary btn-full" id="add-to-list-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M12 5v14"></path>
                    <path d="M5 12h14"></path>
                </svg>
                Add to List
            </button>
        </div>
    `;

    // Add click handler for add to list button
    document.getElementById('add-to-list-btn').addEventListener('click', () => {
        openListModal(movie);
    });
}

function renderListModal(movie) {
    const movieInLists = state.lists.map(list => ({
        ...list,
        hasMovie: list.movies.some(m => m.id === movie.id)
    }));

    elements.listModalBody.innerHTML = `
        <div class="list-options">
            ${movieInLists.map(list => `
                <button type="button" class="list-option ${list.hasMovie ? 'selected' : ''}" data-list-id="${list.id}">
                    <div class="list-option-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"></path>
                            <path d="M15 3v4a2 2 0 0 0 2 2h4"></path>
                        </svg>
                    </div>
                    <span class="list-option-name">${escapeHtml(list.name)}</span>
                    ${list.hasMovie ? `
                        <svg class="list-option-check" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                    ` : ''}
                </button>
            `).join('')}
            <button type="button" class="list-option new" id="create-new-list-option">
                <div class="list-option-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M12 5v14"></path>
                        <path d="M5 12h14"></path>
                    </svg>
                </div>
                <span class="list-option-name">Create New List</span>
            </button>
        </div>
    `;

    // Add click handlers
    elements.listModalBody.querySelectorAll('.list-option[data-list-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            const listId = btn.dataset.listId;
            toggleMovieInList(movie, listId);
            closeListModal();
            closeMovieModal();
            showToast(`Updated "${state.lists.find(l => l.id === listId).name}"`, 'success');
        });
    });

    document.getElementById('create-new-list-option').addEventListener('click', () => {
        closeListModal();
        openCreateListModal(movie);
    });
}

function renderLists() {
    if (state.currentList) {
        renderListDetail();
        return;
    }

    if (state.lists.length === 0) {
        elements.listsContainer.innerHTML = `
            <div class="empty-state">
                <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z"></path>
                    <path d="M15 3v4a2 2 0 0 0 2 2h4"></path>
                </svg>
                <h3 class="empty-state-title">No lists yet</h3>
                <p class="empty-state-text">Create a list to start organizing your movies</p>
            </div>
        `;
        return;
    }

    elements.listsContainer.innerHTML = state.lists.map(list => {
        const posterImages = list.movies.slice(0, 4).map(m =>
            `<img src="${m.poster}" alt="" loading="lazy">`
        ).join('');
        const emptySlots = 4 - Math.min(list.movies.length, 4);
        const emptyImages = Array(emptySlots).fill('<div style="background: var(--color-bg-tertiary);"></div>').join('');

        return `
            <article class="list-card" data-list-id="${list.id}" tabindex="0" role="button">
                <div class="list-card-posters">
                    ${posterImages}${emptyImages}
                </div>
                <div class="list-card-info">
                    <h3 class="list-card-name">${escapeHtml(list.name)}</h3>
                    <p class="list-card-count">${list.movies.length} movie${list.movies.length !== 1 ? 's' : ''}</p>
                </div>
                <svg class="list-card-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m9 18 6-6-6-6"></path>
                </svg>
            </article>
        `;
    }).join('');

    // Add click handlers
    elements.listsContainer.querySelectorAll('.list-card').forEach(card => {
        card.addEventListener('click', () => {
            const listId = card.dataset.listId;
            state.currentList = state.lists.find(l => l.id === listId);
            renderLists();
        });
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const listId = card.dataset.listId;
                state.currentList = state.lists.find(l => l.id === listId);
                renderLists();
            }
        });
    });
}

function renderListDetail() {
    const list = state.currentList;

    elements.listsContainer.innerHTML = `
        <div class="list-detail-header">
            <button type="button" class="back-btn" id="back-to-lists" aria-label="Back to lists">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m15 18-6-6 6-6"></path>
                </svg>
            </button>
            <h2 class="list-detail-title">${escapeHtml(list.name)}</h2>
            ${!list.isDefault ? `
                <button type="button" class="btn-icon" id="delete-list-btn" aria-label="Delete list">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                </button>
            ` : ''}
        </div>

        ${list.movies.length === 0 ? `
            <div class="empty-state">
                <svg class="empty-state-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
                    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                    <circle cx="9" cy="9" r="2"></circle>
                    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                </svg>
                <h3 class="empty-state-title">No movies yet</h3>
                <p class="empty-state-text">Browse movies and add them to this list</p>
            </div>
        ` : `
            <div class="list-movies">
                ${list.movies.map(movie => `
                    <article class="list-movie-item" data-movie-id="${movie.id}">
                        <div class="list-movie-poster">
                            <img src="${movie.poster}" alt="${escapeHtml(movie.title)} poster" loading="lazy">
                        </div>
                        <div class="list-movie-info">
                            <h3 class="list-movie-title">${escapeHtml(movie.title)}</h3>
                            <p class="list-movie-meta">${movie.year} · ${movie.imdbRating} IMDb</p>
                        </div>
                        <button type="button" class="list-movie-remove" data-movie-id="${movie.id}" aria-label="Remove ${escapeHtml(movie.title)} from list">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                <path d="M18 6 6 18"></path>
                                <path d="m6 6 12 12"></path>
                            </svg>
                        </button>
                    </article>
                `).join('')}
            </div>
        `}
    `;

    // Add event listeners
    document.getElementById('back-to-lists').addEventListener('click', () => {
        state.currentList = null;
        renderLists();
    });

    const deleteBtn = document.getElementById('delete-list-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            if (confirm(`Delete "${list.name}"? This cannot be undone.`)) {
                state.lists = state.lists.filter(l => l.id !== list.id);
                saveLists();
                state.currentList = null;
                renderLists();
                updateStats();
                showToast('List deleted', 'success');
            }
        });
    }

    // Movie item clicks
    elements.listsContainer.querySelectorAll('.list-movie-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!e.target.closest('.list-movie-remove')) {
                const movieId = parseInt(item.dataset.movieId);
                openMovieModal(movieId);
            }
        });
    });

    // Remove buttons
    elements.listsContainer.querySelectorAll('.list-movie-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const movieId = parseInt(btn.dataset.movieId);
            removeMovieFromList(movieId, list.id);
            renderLists();
            updateStats();
            showToast('Movie removed', 'success');
        });
    });
}

function updateStats() {
    const totalMovies = new Set();
    const watchedMovies = new Set();

    state.lists.forEach(list => {
        list.movies.forEach(movie => {
            totalMovies.add(movie.id);
            if (list.id === 'watched') {
                watchedMovies.add(movie.id);
            }
        });
    });

    elements.statTotal.textContent = totalMovies.size;
    elements.statWatched.textContent = watchedMovies.size;
    elements.statLists.textContent = state.lists.length;
}

// ========================================
// Modal Functions
// ========================================

function openMovieModal(movieId) {
    const movie = state.movies.find(m => m.id === movieId);
    if (!movie) return;

    state.currentMovie = movie;
    renderMovieModal(movie);
    elements.movieModal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Focus trap
    elements.movieModalClose.focus();
}

function closeMovieModal() {
    elements.movieModal.hidden = true;
    document.body.style.overflow = '';
    state.currentMovie = null;
}

function openListModal(movie) {
    renderListModal(movie);
    elements.listModal.hidden = false;
}

function closeListModal() {
    elements.listModal.hidden = true;
}

function openCreateListModal(movieToAdd = null) {
    elements.createListModal.hidden = false;
    elements.listNameInput.value = '';
    elements.listNameInput.focus();

    // Store movie to add after creating list
    elements.createListForm.dataset.movieToAdd = movieToAdd ? JSON.stringify(movieToAdd) : '';
}

function closeCreateListModal() {
    elements.createListModal.hidden = true;
    elements.createListForm.dataset.movieToAdd = '';
}

// ========================================
// List Functions
// ========================================

function createList(name) {
    const newList = {
        id: generateId(),
        name: name.trim(),
        movies: [],
        isDefault: false
    };
    state.lists.push(newList);
    saveLists();
    return newList;
}

function toggleMovieInList(movie, listId) {
    const list = state.lists.find(l => l.id === listId);
    if (!list) return;

    const existingIndex = list.movies.findIndex(m => m.id === movie.id);
    if (existingIndex > -1) {
        list.movies.splice(existingIndex, 1);
    } else {
        list.movies.push({
            id: movie.id,
            title: movie.title,
            year: movie.year,
            poster: movie.poster,
            imdbRating: movie.imdbRating
        });
    }
    saveLists();
    updateStats();
}

function removeMovieFromList(movieId, listId) {
    const list = state.lists.find(l => l.id === listId);
    if (!list) return;

    list.movies = list.movies.filter(m => m.id !== movieId);
    saveLists();
}

// ========================================
// Toast Notifications
// ========================================

function showToast(message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            ${type === 'success'
                ? '<polyline points="20 6 9 17 4 12"></polyline>'
                : '<circle cx="12" cy="12" r="10"></circle><path d="M12 8v4"></path><path d="M12 16h.01"></path>'
            }
        </svg>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(100%)';
        setTimeout(() => toast.remove(), 200);
    }, 2500);
}

// ========================================
// Navigation
// ========================================

function navigateTo(page) {
    state.currentPage = page;
    state.currentList = null;

    // Update pages
    elements.pages.forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');

    // Update nav
    elements.navItems.forEach(item => {
        const isActive = item.dataset.page === page;
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    // Render page content
    if (page === 'lists') {
        renderLists();
    } else if (page === 'profile') {
        updateStats();
    }
}

// ========================================
// Search
// ========================================

function handleSearch(query) {
    state.searchQuery = query.toLowerCase().trim();
    elements.clearSearch.hidden = !query;

    const sectionTitle = elements.homeContent.querySelector('.section-title');

    if (!state.searchQuery) {
        sectionTitle.textContent = 'Popular Movies';
        renderMovieGrid(state.movies);
        return;
    }

    const filtered = state.movies.filter(movie =>
        movie.title.toLowerCase().includes(state.searchQuery) ||
        movie.director.toLowerCase().includes(state.searchQuery) ||
        movie.genre.some(g => g.toLowerCase().includes(state.searchQuery))
    );

    sectionTitle.textContent = `Results for "${escapeHtml(query)}"`;
    renderMovieGrid(filtered);
}

// ========================================
// Settings Functions
// ========================================

function exportData() {
    const data = {
        lists: state.lists,
        exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `watchlist-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Data exported successfully', 'success');
}

function clearAllData() {
    if (confirm('Are you sure you want to delete all your data? This cannot be undone.')) {
        state.lists = getDefaultLists();
        saveLists();
        updateStats();
        renderLists();
        showToast('All data cleared', 'success');
    }
}

// ========================================
// Event Listeners
// ========================================

function initEventListeners() {
    // Navigation
    elements.navItems.forEach(item => {
        item.addEventListener('click', () => {
            navigateTo(item.dataset.page);
        });
    });

    // Search
    const debouncedSearch = debounce(handleSearch, 300);
    elements.searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });

    elements.clearSearch.addEventListener('click', () => {
        elements.searchInput.value = '';
        handleSearch('');
        elements.searchInput.focus();
    });

    // Movie Modal
    elements.movieModalClose.addEventListener('click', closeMovieModal);
    elements.movieModalBackdrop.addEventListener('click', closeMovieModal);

    // List Modal
    elements.listModalClose.addEventListener('click', closeListModal);
    elements.listModalBackdrop.addEventListener('click', closeListModal);

    // Create List Modal
    elements.createListBtn.addEventListener('click', () => openCreateListModal());
    elements.createListClose.addEventListener('click', closeCreateListModal);
    elements.createListBackdrop.addEventListener('click', closeCreateListModal);

    elements.createListForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = elements.listNameInput.value.trim();
        if (!name) return;

        const newList = createList(name);

        // If there's a movie to add, add it
        const movieData = elements.createListForm.dataset.movieToAdd;
        if (movieData) {
            const movie = JSON.parse(movieData);
            toggleMovieInList(movie, newList.id);
            closeMovieModal();
        }

        closeCreateListModal();
        renderLists();
        updateStats();
        showToast(`"${name}" created`, 'success');
    });

    // Settings
    elements.exportData.addEventListener('click', exportData);
    elements.clearData.addEventListener('click', clearAllData);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (!elements.movieModal.hidden) closeMovieModal();
            if (!elements.listModal.hidden) closeListModal();
            if (!elements.createListModal.hidden) closeCreateListModal();
        }
    });
}

// ========================================
// Initialization
// ========================================

async function init() {
    // Load data
    state.lists = loadLists();
    state.movies = await fetchMovies();

    // Initial render
    renderMovieGrid(state.movies);
    updateStats();

    // Init events
    initEventListeners();

    state.isLoading = false;
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
