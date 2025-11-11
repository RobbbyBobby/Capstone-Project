// Add item to pantry

function addItem() {
    const input = document.getElementById("item-input");
    const itemName = input.value.trim();

    if (itemName === "") {
        alert("Please enter an item name.");
        return;
    }

    // Create item object with dateAdded (ISO yyyy-mm-dd)
    const dateAdded = new Date().toISOString().slice(0, 10);
    const item = { name: itemName, dateAdded };

    const pantry = loadPantry();
    pantry.push(item);
    savePantry(pantry);
    renderPantry();

    input.value = "";
}

// Remove item from the pantry
function removeItem() {
    const input = document.getElementById("item-input");
    const itemName = input.value.trim().toLowerCase();

    if (itemName === "") {
        alert("Please enter an item name to remove.");
        return;
    }

    let pantry = loadPantry();
    const originalLen = pantry.length;
    pantry = pantry.filter(it => it.name.toLowerCase() !== itemName);
    if (pantry.length === originalLen) {
        alert("Item not found in pantry.");
    } else {
        savePantry(pantry);
        renderPantry();
    }

    input.value = "";
}

// Highlight items that will expire
function highlightExpiring() {
    const expireList = document.querySelectorAll("#expire-list li");
    expireList.forEach(item => item.classList.add("highlight"));
    alert("Expiring items highlighted!");
}

// --- New helper functions for tracking days an item has existed ---

// Returns number of full days between given ISO date string (yyyy-mm-dd) and today
function daysSince(isoDateStr) {
    if (!isoDateStr) return 0;
    const start = new Date(isoDateStr + 'T00:00:00');
    const now = new Date();
    // Clear time portion for both to count full days
    const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const nowUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((nowUtc - startUtc) / msPerDay);
}

const PANTRY_KEY = 'pantryItems_v1';

function savePantry(pantryArray) {
    try {
        localStorage.setItem(PANTRY_KEY, JSON.stringify(pantryArray));
    } catch (e) {
        console.error('Failed to save pantry to localStorage', e);
    }
}

function loadPantry() {
    try {
        const raw = localStorage.getItem(PANTRY_KEY);
        if (!raw) return [];
        return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to load pantry from localStorage', e);
        return [];
    }
}

// Render the pantry list showing item name and days existed
function renderPantry() {
    const list = document.getElementById('pantry-list');
    if (!list) return;
    list.innerHTML = '';

    const pantry = loadPantry();
    if (pantry.length === 0) {
        const li = document.createElement('li');
        li.textContent = 'Pantry is empty.';
        list.appendChild(li);
        return;
    }

    pantry.forEach((it, idx) => {
        const li = document.createElement('li');
        li.className = 'pantry-item';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = it.name;

        const days = daysSince(it.dateAdded);
        const meta = document.createElement('span');
        meta.className = 'meta';
        meta.textContent = `${days} day${days !== 1 ? 's' : ''}`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.className = 'remove-btn';
        removeBtn.addEventListener('click', () => {
            removeItemByIndex(idx);
        });

        li.appendChild(nameSpan);
        li.appendChild(meta);
        li.appendChild(removeBtn);
        list.appendChild(li);
    });
}

function removeItemByIndex(index) {
    const pantry = loadPantry();
    if (index < 0 || index >= pantry.length) return;
    pantry.splice(index, 1);
    savePantry(pantry);
    renderPantry();
}
