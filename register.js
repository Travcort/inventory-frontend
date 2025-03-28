async function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const isAdmin = document.getElementById('isAdmin').checked;
    const errorElement = document.getElementById('registerError');

    // Basic validation
    if (!name || !email || !password) {
        errorElement.textContent = 'Please fill in all fields.';
        return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorElement.textContent = 'Please enter a valid email address.';
        return;
    }

    // Password length validation
    if (password.length < 6) {
        errorElement.textContent = 'Password must be at least 6 characters long.';
        return;
    }

    try {
        const response = await fetch('http://192.168.56.1:5000/api/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password, isAdmin })
        });

        const data = await response.json();

        if (data.success) {
            alert('Registration successful! Please log in.');
            window.location.href = 'dash.html';
        } else {
            errorElement.textContent = data.message || 'Registration failed.';
        }
    } catch (error) {
        console.error('Error during registration:', error);
        errorElement.textContent = 'Error during registration. Please try again.';
    }
}