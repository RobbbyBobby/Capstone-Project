// Add item to pantry

function addItem() {
    const input = document.getElementById("item-input");
    const itemName = input.value.trim();

    if (itemName === "") {
        alert("Please enter an item name.");
        return;
    }

    const list = document.getElementById("pantry-list");
    const li = document.createElement("li");
    li.textContent = itemName;
    list.appendChild(li);
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

    const listItems = document.querySelectorAll("#pantry-list li");
    let found = false;

    listItems.forEach(item => {
        if (item.textContent.toLowerCase() === itemName) {
            item.remove();
            found = true;
        }
    });

    if (!found) {
        alert("Item not found in pantry.");
    }

    input.value = "";
}

// Highlight items that will expire
function highlightExpiring() {
    const expireList = document.querySelectorAll("#expire-list li");
    expireList.forEach(item => item.classList.add("highlight"));
    alert("Expiring items highlighted!");
}