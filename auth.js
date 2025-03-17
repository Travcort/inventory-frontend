document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const formTitle = document.getElementById("form-title");
    const toggleLinks = document.querySelectorAll("a[href='#']"); // Select toggle links

    function toggleForm(event) {
        event.preventDefault(); // Prevent page refresh

        if (loginForm.classList.contains("hidden")) {
            loginForm.classList.remove("hidden");
            signupForm.classList.add("hidden");
            formTitle.textContent = "Login";
        } else {
            loginForm.classList.add("hidden");
            signupForm.classList.remove("hidden");
            formTitle.textContent = "Sign Up";
        }
    }

    // Attach event listeners to both toggle links
    toggleLinks.forEach(link => {
        link.addEventListener("click", toggleForm);
    });

    // Handle signup form submission
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const name = signupForm.querySelector("input[name='name']").value;
        const email = signupForm.querySelector("input[name='email']").value;
        const password = signupForm.querySelector("input[name='password']").value;
        const confirmPassword = signupForm.querySelector("input[name='confirmPassword']").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Store user details in local storage
        const user = { name, email, password };
        localStorage.setItem("user", JSON.stringify(user));

        alert("Signup successful! You can now log in.");
        toggleForm(event); // Switch to login form
    });

    // Handle login form submission
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = loginForm.querySelector("input[name='email']").value;
        const password = loginForm.querySelector("input[name='password']").value;

        // Retrieve stored user details
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser && storedUser.email === email && storedUser.password === password) {
            alert("Login successful!");
            window.location.href = "homepage1.html"; // Redirect to homepage
        } else {
            alert("Invalid credentials. Please try again.");
        }
    });
});
