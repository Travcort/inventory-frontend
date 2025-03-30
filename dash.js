
lucide.createIcons();
document.addEventListener("DOMContentLoaded", function () {
    const buttons = document.querySelectorAll("#menu button");
    const contents = document.querySelectorAll(".tab-content");
    const title = document.getElementById("tab-title");
    
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const tab = button.getAttribute("data-tab");
            
            contents.forEach(content => {
                content.classList.remove("active");
                if (content.id === tab) {
                    content.classList.add("active");
                }
            });
            
            title.textContent = button.textContent.trim();
        });
    });
});


// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        showDashboard();
        fetchProducts();
    }
});

// Show the dashboard and hide the login form
function showDashboard() {
    document.getElementById('loginSection').style.display = 'none';
    document.getElementById('dashboardSection').style.display = 'block';
}

// Login function
async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorElement = document.getElementById('loginError');

    console.log('Attempting login with:', { email, password });

    if (!email || !password) {
        console.log('Validation failed: Missing email or password');
        errorElement.textContent = 'Please fill in all fields.';
        return;
    }

    try {
        console.log('Sending request to /api/auth');
        const response = await fetch('http://192.168.56.1:5000/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);

        if (data.success) {
            console.log('Login successful, storing token');
            localStorage.setItem('token', data.token);
            showDashboard();
            fetchProducts();
        } else {
            console.log('Login failed:', data.message);
            errorElement.textContent = data.message || 'Login failed.';
        }
    } catch (error) {
        console.error('Error during login:', error);
        errorElement.textContent = `Error logging in: ${error.message}`;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    document.getElementById('dashboardSection').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
    document.getElementById('loginError').textContent = '';
}

// Fetch Products from Backend
async function fetchProducts() {
    try {
        const response = await fetch('http://192.168.56.1:5000/api/products');
        const data = await response.json();
        const productContainer = document.getElementById('productContainer');
        productContainer.innerHTML = ''; // Clear existing products

        if (data.success) {
            data.products.forEach(product => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                productCard.setAttribute('data-id', product._id); // Store product ID
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}">
                    <h3>${product.name}</h3>
                    <p>Description: ${product.description}</p>
                    <p>Stock: ${product.stock}</p>
                    <button onclick="editProduct(this)">Edit</button>
                    <button class="delete" onclick="deleteProduct(this)">Delete</button>
                `;
                productContainer.appendChild(productCard);
            });
        } else {
            productContainer.innerHTML = '<p>No products available.</p>';
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        document.getElementById('productContainer').innerHTML = '<p>Error loading products.</p>';
    }
}

// Filter items based on input
function filterItems() {
    const filterValue = document.getElementById("filterInput").value.toLowerCase();
    const productCards = document.getElementsByClassName("product-card");

    for (let i = 0; i < productCards.length; i++) {
        const productName = productCards[i].querySelector("h3").innerText.toLowerCase();
        if (productName.includes(filterValue)) {
            productCards[i].style.display = "block";
        } else {
            productCards[i].style.display = "none";
        }
    }
}

// Open the form for adding/editing items
function openForm() {
    document.getElementById("itemForm").style.display = "block";
}

// Close the form
function closeForm() {
    document.getElementById("itemForm").style.display = "none";
    document.getElementById("productName").value = "";
    document.getElementById("productDescription").value = "";
    document.getElementById("productImage").value = "";
    document.getElementById("productStock").value = "";
    window.editingProductId = null; // Reset editing state
}

// Add or Update Product
async function addProduct() {
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const image = document.getElementById("productImage").value;
    const stock = document.getElementById("productStock").value;

    if (name === "" || description === "" || image === "" || stock === "") {
        alert("Please fill in all fields!");
        return;
    }

    const productData = { name, description, image, stock: parseInt(stock) };
    const token = localStorage.getItem('token');

    if (window.editingProductId) {
        // Update existing product
        try {
            const response = await fetch(`http://192.168.56.1:5000/api/products/${window.editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
            const data = await response.json();
            if (data.success) {
                fetchProducts();
            } else {
                alert('Error updating product: ' + data.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('Error updating product.');
        }
    } else {
        // Add new product
        try {
            const response = await fetch('http://192.168.56.1:5000/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
            const data = await response.json();
            if (data.success) {
                fetchProducts();
            } else {
                alert('Error adding product: ' + data.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product.');
        }
    }

    closeForm();
}

// Edit Product
function editProduct(button) {
    const card = button.parentElement;
    const id = card.getAttribute('data-id');
    const name = card.querySelector("h3").innerText;
    const description = card.querySelector("p").innerText.replace("Description: ", "");
    const image = card.querySelector("img").src;
    const stock = card.querySelector("p:nth-child(3)").innerText.replace("Stock: ", "");

    // Prefill form
    document.getElementById("productName").value = name;
    document.getElementById("productDescription").value = description;
    document.getElementById("productImage").value = image;
    document.getElementById("productStock").value = stock;

    // Store the ID for updating
    window.editingProductId = id;

    openForm();
}

// Delete Product
async function deleteProduct(button) {
    if (confirm("Are you sure you want to delete this product?")) {
        const card = button.parentElement;
        const id = card.getAttribute('data-id');
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://192.168.56.1:5000/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                fetchProducts();
            } else {
                alert('Error deleting product: ' + data.message);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('Error deleting product.');
        }
    }
}
