// Open and Close Form
function openForm() {
    document.getElementById("itemForm").style.display = "block";
}

function closeForm() {
    document.getElementById("itemForm").style.display = "none";
}

// Add Product to Dashboard
function addProduct() {
    let name = document.getElementById("productName").value;
    let price = document.getElementById("productPrice").value;
    let image = document.getElementById("productImage").value;

    if (name === "" || price === "" || image === "") {
        alert("Please fill in all fields!");
        return;
    }

    let productContainer = document.getElementById("productContainer");

    let productCard = document.createElement("div");
    productCard.classList.add("product-card");

    productCard.innerHTML = `
        <img src="${image}" alt="${name}">
        <h3>${name}</h3>
        <p>Price: $${price}</p>
        <button onclick="editProduct(this)">Edit</button>
        <button class="delete" onclick="deleteProduct(this)">Delete</button>
    `;

    productContainer.appendChild(productCard);

    // Close form and clear fields
    closeForm();
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productImage").value = "";
}

// Edit Product
function editProduct(button) {
    let card = button.parentElement;
    let name = card.querySelector("h3").innerText;
    let price = card.querySelector("p").innerText.replace("Price: $", "");
    let image = card.querySelector("img").src;

    // Prefill form
    document.getElementById("productName").value = name;
    document.getElementById("productPrice").value = price;
    document.getElementById("productImage").value = image;

    // Remove the old product card
    card.remove();

    // Open form
    openForm();
}

// Delete Product
function deleteProduct(button) {
    if (confirm("Are you sure you want to delete this product?")) {
        button.parentElement.remove();
    }
}

// Filter Products
function filterItems() {
    let filterValue = document.getElementById("filterInput").value.toLowerCase();
    let cards = document.getElementsByClassName("product-card");

    for (let card of cards) {
        let name = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = name.includes(filterValue) ? "block" : "none";
    }
}
