document.addEventListener("DOMContentLoaded", function () {
    const dashboardItems = document.getElementById("dashboardItems");
    
    // Add Item Modal
    const openAddModalBtn = document.getElementById("openAddItemModalBtn");
    const addItemModal = document.getElementById("addItemModal");
    const closeAddModal = document.getElementById("closeAddModal");
    const itemNameInput = document.getElementById("itemName");
    const itemPriceInput = document.getElementById("itemPrice");
    const itemImageInput = document.getElementById("itemImage");
    const submitItemBtn = document.getElementById("submitItemBtn");

    // Edit Item Modal
    const editModal = document.getElementById("editModal");
    const closeEditModal = document.getElementById("closeEditModal");
    const editItemName = document.getElementById("editItemName");
    const editItemPrice = document.getElementById("editItemPrice");
    const editItemImage = document.getElementById("editItemImage");
    const saveEditBtn = document.getElementById("saveEditBtn");

    let currentEditingItem = null;

    // Open Add Item Modal
    openAddModalBtn.addEventListener("click",
        function () {
            addItemModal.style.display = "block";
        });
    
        // Close Add Item Modal
        closeAddModal.addEventListener("click", function () {
            addItemModal.style.display = "none";
        });
    
        // Add Item Function
        submitItemBtn.addEventListener("click", function () {
            const name = itemNameInput.value;
            const price = itemPriceInput.value;
            const imageFile = itemImageInput.files[0];
    
            if (!name || !price || !imageFile) {
                alert("Please fill in all fields and select an image.");
                return;
            }
    
            const reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onload = function (event) {
                const imageUrl = event.target.result;
    
                const itemCard = document.createElement("div");
                itemCard.classList.add("item-card");
                itemCard.innerHTML = `
                    <img src="${imageUrl}" alt="${name}" class="item-image">
                    <h3 class="item-name">${name}</h3>
                    <p class="item-price">Price: $${price}</p>
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                `;
    
                dashboardItems.appendChild(itemCard);
                attachEventListeners(itemCard);
    
                // Close modal and reset input fields
                addItemModal.style.display = "none";
                itemNameInput.value = "";
                itemPriceInput.value = "";
                itemImageInput.value = "";
            };
        });
    
        // Attach event listeners to buttons (Edit & Delete)
        function attachEventListeners(itemCard) {
            const editBtn = itemCard.querySelector(".edit-btn");
            const deleteBtn = itemCard.querySelector(".delete-btn");
    
            // Edit Item
            editBtn.addEventListener("click", function () {
                editModal.style.display = "block";
                editItemName.value = itemCard.querySelector(".item-name").textContent;
                editItemPrice.value = itemCard.querySelector(".item-price").textContent.replace("Price: $", "");
                currentEditingItem = itemCard;
            });
    
            // Delete Item
            document.addEventListener("click", function (event) {
                if (event.target.classList.contains("delete-btn")) {
                    const card = event.target.closest(".item-card");
                    const itemName = card.querySelector("h3").innerText; // Assuming item name is in an h3 tag
            
                    Swal.fire({
                        title: "Are you sure?",
                        text: `Do you really want to delete "${itemName}"? This action cannot be undone.`,
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#d33",
                        cancelButtonColor: "#3085d6",
                        confirmButtonText: "Yes, delete it!"
                    }).then((result) => {
                        if (result.isConfirmed) {
                            card.remove(); // Remove the item from the DOM
                            Swal.fire("Deleted!", `"${itemName}" has been deleted.`, "success");
                        }
                    });
                }
            });
            
        }
    
        // Close Edit Modal
        closeEditModal.addEventListener("click", function () {
            editModal.style.display = "none";
        });
    
        // Save Changes in Edit Modal
        saveEditBtn.addEventListener("click", function () {
            if (currentEditingItem) {
                currentEditingItem.querySelector(".item-name").textContent = editItemName.value;
                currentEditingItem.querySelector(".item-price").textContent = "Price: $" + editItemPrice.value;
                editModal.style.display = "none";
            }
        });
        // Search functionality
   document.getElementById("searchInput").addEventListener("input", function () {
    let searchValue = this.value.toLowerCase(); // Get the search input value
    let items = document.querySelectorAll(".item-card"); // Select all item cards

    items.forEach(item => {
        let itemName = item.querySelector("h3").innerText.toLowerCase(); // Get item name
        if (itemName.includes(searchValue)) {
            item.style.display = "block"; // Show matching item
        } else {
            item.style.display = "none"; // Hide non-matching item
        }
    });
});

});
    